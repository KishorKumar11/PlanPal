import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

function resolvePgUrl(url: string): string {
  if (!url.startsWith("prisma+postgres://")) return url;
  const apiKey = url.split("api_key=")[1];
  const padded = apiKey + "=".repeat((4 - (apiKey.length % 4)) % 4);
  const payload = JSON.parse(Buffer.from(padded, "base64").toString("utf-8"));
  return payload.databaseUrl;
}

function createPrismaClient() {
  const connectionString = resolvePgUrl(process.env.DATABASE_URL!);
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
