import { PrismaClient } from "@prisma/client";
// Prevents creating a new DB connection on every reload during development.
// In production, creates one connection and reuses it.
const globalForPrisma = globalThis as unknown as {
prisma: PrismaClient | undefined;
};
export const prisma =
globalForPrisma.prisma ??
new PrismaClient({
log: process.env.NODE_ENV ===
? ["query"
,
"error"]
: ["error"],
"development"
});
if (process.env.NODE_ENV !== "production") {
globalForPrisma.prisma = prisma;
}
