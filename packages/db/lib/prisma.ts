// eslint-disable-next-line -- need to import the generated code
import {PrismaClient as PrismaClientReal} from "@prisma/client";

const globalForPrisma: { prisma?: PrismaClientReal } = global as unknown as {
  prisma: PrismaClientReal;
};

export const prisma: PrismaClientReal =
  globalForPrisma.prisma || new PrismaClientReal();


if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export type PrismaClient = PrismaClientReal;
export {Prisma, PatientStatus} from '@prisma/client';
