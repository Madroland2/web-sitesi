import { PrismaClient } from "@prisma/client";

// Next.js hot-reload sırasında birden fazla Prisma instance açılmasını önler
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
