import { drizzle } from "drizzle-orm/pg-proxy";

import * as schema from "./schema";

export function isStringISODate(str: string): boolean {
  // Regular expression to match ISO 8601 date format
  const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;
  return iso8601Regex.test(str);
}

export const db = drizzle(
  async (sql, params, method) => {
    try {
      const res = await fetch(process.env.DATABASE_URL2!, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sql, params, method, app: "genshin" }),
      });
      const rows = (await res.json()) as any[];

      if (rows.length > 0) {
        const keys = Object.keys(rows[0]);
        for (const key of keys) {
          if (
            typeof rows[0][key] === "string" &&
            isStringISODate(rows[0][key])
          ) {
            for (const row of rows) {
              row[key] = new Date(row[key]);
            }
          }
        }
      }

      return { rows };
    } catch (e: any) {
      console.error("Error from pg proxy server: ", e);
      return { rows: [] };
    }
  },
  { schema },
);
