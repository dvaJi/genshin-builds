import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL || "DATABASE_URL",
  authToken: process.env.TURSO_AUTH_TOKEN || "	",
});

export const db = drizzle(client, {
  schema,
  logger: process.env.IS_DEV_ENV === "true",
});
