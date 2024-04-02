import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./lib/db/schema.ts",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL || "",
  },
  schemaFilter: ["genshinbuilds"],
  out: "./lib/db/migrations",
  verbose: true,
  strict: true,
});
