import prisma from "../db.server";
import type { Prisma } from "@prisma/client";

export async function findGoogleAccountById(id: string) {
  return prisma.googleAccount.findUnique({
    where: { id },
  });
}

export async function findGoogleAccountByEmail(email: string) {
  return prisma.googleAccount.findFirst({
    where: { email },
  });
}

export async function upsertGoogleAccountByEmail(
  email: string,
  data: Prisma.GoogleAccountUncheckedCreateInput | Prisma.GoogleAccountUncheckedUpdateInput,
) {
  const existing = await prisma.googleAccount.findFirst({
    where: { email },
  });

  if (existing) {
    return prisma.googleAccount.update({
      where: { id: existing.id },
      data,
    });
  }

  return prisma.googleAccount.create({
    data: {
      email,
      accessToken: String(data.accessToken || ""),
      refreshToken: (data.refreshToken as string) || null,
      scopes: (data.scopes as string) || null,
      expiresAt: data.expiresAt as Date | undefined,
    },
  });
}

export async function updateGoogleAccount(
  id: string,
  data: Prisma.GoogleAccountUpdateInput,
) {
  return prisma.googleAccount.update({
    where: { id },
    data,
  });
}
