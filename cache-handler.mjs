import Redis from "ioredis";

export default class RedisCacheHandler {
  redis;
  prefix = "next-cache:";

  constructor(options = {}) {
    // Use provided Redis URL or default to localhost
    this.redis = new Redis(
      options.redisUrl || process.env.REDIS_URL || "redis://localhost:6379",
    );

    if (options.prefix) {
      this.prefix = options.prefix;
    }

    // Log connection status
    this.redis.on("connect", () => {
      // console.log("Connected to Redis server");
    });

    this.redis.on("error", (err) => {
      console.error("Redis connection error:", err);
    });
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
    await this.redis.quit();
    console.log("Redis connection closed");
  }
}
