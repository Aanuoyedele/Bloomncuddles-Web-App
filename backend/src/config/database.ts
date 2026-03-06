import { PrismaClient } from '@prisma/client';

// Single shared Prisma instance to avoid spawning multiple DB connections.
// Every controller/service should import `prisma` from here.
const prisma = new PrismaClient();

export default prisma;
