import Redis from "ioredis";

export default class RedisCacheHandler {
  static instance;
  redis;
  prefix = "next-cache:";
  connectionAttempts = 0;
  maxRetries = 3;
  retryDelay = 1000; // 1 second

  constructor(options = {}) {
    // Implement singleton pattern to reuse connections
    if (RedisCacheHandler.instance) {
      return RedisCacheHandler.instance;
    }

    const redisOptions = {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        const delay = Math.min(times * 100, 3000);
        return delay;
      },
      reconnectOnError(err) {
        const targetError = "READONLY";
        if (err.message.includes(targetError)) {
          return true;
        }
        return false;
      },
      enableReadyCheck: true,
      maxLoadingRetryTime: 5000,
      showFriendlyErrorStack: true,
      // Add connection pool settings
      connectionName: "next-cache",
      db: 0,
      enableOfflineQueue: true,
      // Close connection after being idle
      disconnectTimeout: 5000,
    };

    this.redis = new Redis(
      options.redisUrl || process.env.REDIS_URL || "redis://localhost:6379",
      redisOptions
    );

    if (options.prefix) {
      this.prefix = options.prefix;
    }

    this.redis.on("connect", () => {
      this.connectionAttempts = 0;
      // console.log("Connected to Redis server");
    });

    this.redis.on("error", async (err) => {
      console.error("Redis connection error:", err);
      
      // Handle max clients error specifically
      if (err.message.includes("max number of clients reached")) {
        if (this.connectionAttempts < this.maxRetries) {
          this.connectionAttempts++;
          console.log(`Retrying connection attempt ${this.connectionAttempts}...`);
          
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, this.retryDelay));
          
          try {
            await this.redis.disconnect();
            this.redis = new Redis(
              options.redisUrl || process.env.REDIS_URL || "redis://localhost:6379",
              redisOptions
            );
          } catch (retryErr) {
            console.error("Failed to retry connection:", retryErr);
          }
        }
      }
    });

    // Handle process termination
    const cleanup = async () => {
      if (this.redis) {
        console.log("Closing Redis connection...");
        await this.redis.quit();
      }
    };

    process.on('SIGTERM', cleanup);
    process.on('SIGINT', cleanup);
    process.on('exit', cleanup);

    RedisCacheHandler.instance = this;
  }

  getFullKey(key) {
    return `${this.prefix}${key}`;
  }

  async get(key) {
    try {
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
        console.log("Redis connection closed");
      }
    } catch (error) {
      console.error("Error closing Redis connection:", error);
    }
  }
}
