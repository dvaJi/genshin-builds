import { connect } from "@planetscale/database";
import { PrismaPlanetScale } from "@prisma/adapter-planetscale";
import { PrismaClient } from "@prisma/client";

export * from "@prisma/client";

let prisma: PrismaClient;
const connection = connect({ url: process.env.DATABASE_URL, fetch });
const adapter = new PrismaPlanetScale(connection);

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
