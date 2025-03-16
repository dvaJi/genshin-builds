import Redis from "ioredis";

export default class RedisCacheHandler {
  static instance;
  redis;
  prefix = "next-cache:";
  connectionAttempts = 0;
  maxRetries = 3;
  retryDelay = 1000; // 1 second
  isConnected = false;
  reconnecting = false;

  constructor(options = {}) {
    // Implement singleton pattern to reuse connections
    if (RedisCacheHandler.instance) {
      return RedisCacheHandler.instance;
    }

    const redisOptions = {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        // Don't retry forever
        if (times > 10) {
          return null;
        }
        // Exponential backoff with max delay of 3 seconds
        const delay = Math.min(times * 100, 3000);
        return delay;
      },
      reconnectOnError(err) {
        const targetErrors = ["READONLY", "EPIPE", "ECONNRESET"];
        if (targetErrors.some((e) => err.message.includes(e))) {
          return true;
        }
        return false;
      },
      // Close if Redis connection is broken or unresponsive
      connectTimeout: 10000,
      disconnectTimeout: 5000,
      commandTimeout: 5000,
      enableReadyCheck: true,
      maxLoadingRetryTime: 5000,
      // Connection pool settings
      connectionName: "next-cache",
      db: 0,
      enableOfflineQueue: true,
      // Auto-reconnect settings
      autoResubscribe: true,
      autoResendUnfulfilledCommands: true,
      retryUnfulfilledCommands: true,
      lazyConnect: false,
    };

    this.initializeRedis(
      options.redisUrl || process.env.REDIS_URL || "redis://localhost:6379",
      redisOptions,
    );
    RedisCacheHandler.instance = this;
  }

  async initializeRedis(url, options) {
    try {
      this.redis = new Redis(url, options);

      this.redis.on("connect", () => {
        this.isConnected = true;
        this.connectionAttempts = 0;
        this.reconnecting = false;
      });

      this.redis.on("ready", () => {
        this.isConnected = true;
        console.log("Redis connection is ready");
      });

      this.redis.on("error", async (err) => {
        console.error("Redis connection error:", err);
        this.isConnected = false;

        if (err.message.includes("EPIPE") && !this.reconnecting) {
          this.reconnecting = true;
          await this.handleConnectionError();
        }
      });

      this.redis.on("close", () => {
        this.isConnected = false;
        console.log("Redis connection closed");
      });

      this.redis.on("end", () => {
        this.isConnected = false;
        console.log("Redis connection ended");
      });

      // Handle process termination
      const cleanup = async () => {
        if (this.redis) {
          try {
            await this.close();
          } catch (error) {
            console.error("Error during cleanup:", error);
          }
        }
      };

      process.on("SIGTERM", cleanup);
      process.on("SIGINT", cleanup);
      process.on("exit", cleanup);
    } catch (error) {
      console.error("Failed to initialize Redis:", error);
      throw error;
    }
  }

  async handleConnectionError() {
    if (this.connectionAttempts >= this.maxRetries) {
      console.error("Max reconnection attempts reached");
      return;
    }

    try {
      this.connectionAttempts++;
      console.log(
        `Attempting to reconnect (${this.connectionAttempts}/${this.maxRetries})...`,
      );

      // Close existing connection if it exists
      if (this.redis) {
        try {
          await this.redis.disconnect();
        } catch (error) {
          // Ignore disconnect errors
        }
      }

      // Wait before retrying
      await new Promise((resolve) =>
        setTimeout(resolve, this.retryDelay * this.connectionAttempts),
      );

      // Reinitialize connection
      await this.initializeRedis(
        process.env.REDIS_URL || "redis://localhost:6379",
        this.redis.options,
      );
    } catch (error) {
      console.error("Reconnection attempt failed:", error);
      this.reconnecting = false;
    }
  }

  async ensureConnection() {
    if (!this.isConnected && !this.reconnecting) {
      await this.handleConnectionError();
    }
    return this.isConnected;
  }

  getFullKey(key) {
    return `${this.prefix}${key}`;
  }

  async get(key) {
    try {
      if (!(await this.ensureConnection())) {
        return undefined;
      }

      const data = await this.redis.get(this.getFullKey(key));
      if (!data) return undefined;

      const parsed = JSON.parse(data);

      // Handle streaming response
      if (
        parsed.value &&
        typeof parsed.value === "object" &&
        parsed.value.readable
      ) {
        return {
          ...parsed,
          value: Buffer.from(parsed.value),
        };
      }

      return parsed;
    } catch (error) {
      console.error("Error getting cache entry:", error);
      return undefined;
    }
  }

  async set(key, data, ctx = {}) {
    try {
      if (!(await this.ensureConnection())) {
        return;
      }

      // Handle streaming response
      let valueToStore = data;
      if (data && typeof data === "object" && data.readable) {
        valueToStore = await new Promise((resolve, reject) => {
          const chunks = [];
          data.on("data", (chunk) => chunks.push(chunk));
          data.on("end", () => resolve(Buffer.concat(chunks)));
          data.on("error", reject);
        });
      }

      const entry = {
        value: valueToStore,
        lastModified: Date.now(),
        tags: Array.isArray(ctx.tags) ? ctx.tags : [],
      };

      const fullKey = this.getFullKey(key);

      // If revalidate is a number, set TTL
      if (typeof ctx.revalidate === "number") {
        await this.redis.set(
          fullKey,
          JSON.stringify(entry),
          "EX",
          ctx.revalidate,
        );
      } else {
        await this.redis.set(fullKey, JSON.stringify(entry));
      }

      // Only process tags if they exist
      if (Array.isArray(ctx.tags) && ctx.tags.length > 0) {
        // Also store keys by tag for efficient revalidation
        for (const tag of ctx.tags) {
          await this.redis.sadd(`${this.prefix}tag:${tag}`, fullKey);
        }
      }
    } catch (error) {
      console.error("Error setting cache entry:", error);
    }
  }

  async revalidateTag(tags) {
    try {
      if (!(await this.ensureConnection())) {
        return;
      }

      const tagsArray = Array.isArray(tags) ? tags : [tags];

      for (const tag of tagsArray) {
        const tagKey = `${this.prefix}tag:${tag}`;

        // Get all keys associated with this tag
        const keys = await this.redis.smembers(tagKey);

        if (keys.length > 0) {
          // Delete all cache entries with this tag
          await this.redis.del(...keys);

          // Clean up the tag set
          await this.redis.del(tagKey);
        }
      }
    } catch (error) {
      console.error("Error revalidating cache tags:", error);
    }
  }

  resetRequestCache() {
    // This method is not needed for Redis implementation
    // as we don't have request-specific memory cache
  }

  async clear() {
    try {
      if (!(await this.ensureConnection())) {
        return;
      }

      // Get all keys with our prefix
      const keys = await this.redis.keys(`${this.prefix}*`);

      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch (error) {
      console.error("Error clearing cache:", error);
    }
  }

  async close() {
    try {
      if (this.redis) {
        await this.redis.quit();
        this.isConnected = false;
        console.log("Redis connection closed");
      }
    } catch (error) {
      console.error("Error closing Redis connection:", error);
    }
  }
}
