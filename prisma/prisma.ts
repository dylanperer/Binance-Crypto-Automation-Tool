import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export const createSession = async () => {
  await prisma.session.create({ data: { hasEnded: "false" } });
};

export const getActiveSession = async () => {
  const session = await prisma.session.findFirst({
    where: {
      hasEnded: "false",
    },
  });
  return session;
};

export const endPreviousSession = async () => {
  await prisma.session.updateMany({
    data: {
      hasEnded: "true",
    },
  });
};
