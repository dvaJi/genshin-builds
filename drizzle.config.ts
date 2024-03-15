import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./lib/db/schema.ts",
  driver: "turso",
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL || "sqlite://:memory:",
    authToken: process.env.TURSO_AUTH_TOKEN || "",
  },
  out: "./lib/db/migrations",
  verbose: true,
  strict: true,
});
