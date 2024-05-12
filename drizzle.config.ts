import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./lib/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "",
  },
  schemaFilter: ["genshinbuilds"],
  out: "./lib/db/migrations",
  verbose: true,
  strict: true,
});
