import { createRequire } from "node:module";
import { PrismaPlanetScale } from "@prisma/adapter-planetscale";
import { PrismaClient } from "@prisma/client";

const require = createRequire(import.meta.url);
const { Client } = require("@planetscale/database");

const client = new Client({ url:  process.env.DATABASE_URL  })
const adapter = new PrismaPlanetScale(client);

// Workaround for v5.6.0: https://github.com/prisma/prisma/discussions/21347?sort=new#discussioncomment-7576783

export * from "@prisma/client";

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({
    adapter,
    errorFormat: "minimal",
  });
} else {
  globalThis["prisma"] =
    globalThis["prisma"] ||
    new PrismaClient({
      adapter,
      errorFormat: "pretty",
    });
  prisma = globalThis["prisma"];
}

export default prisma;
