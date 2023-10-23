import type { Config } from "drizzle-kit";

export default {
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL || "",
  },
  breakpoints: true,
} satisfies Config;
