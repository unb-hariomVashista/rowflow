import prisma from "../db.server";
import type { Prisma } from "@prisma/client";

/**
 * Find shop by domain including linked googleAccount and recent sync logs
 */
export async function findShopByDomain(shopDomain: string, logLimit = 15) {
  return prisma.shop.findUnique({
    where: { shopDomain },
    include: {
      googleAccount: true,
      syncLogs: {
        orderBy: { createdAt: "desc" },
        take: logLimit,
      },
    },
  });
}

/**
 * Upsert shop by domain
 */
export async function upsertShop(
  shopDomain: string,
  data: Prisma.ShopUncheckedUpdateInput = {},
) {
  return prisma.shop.upsert({
    where: { shopDomain },
    create: { shopDomain },
    update: data,
    include: {
      googleAccount: true,
      syncLogs: {
        orderBy: { createdAt: "desc" },
        take: 15,
      },
    },
  });
}

/**
 * Update shop fields
 */
export async function updateShop(
  shopDomain: string,
  data: Prisma.ShopUncheckedUpdateInput,
) {
  return prisma.shop.update({
    where: { shopDomain },
    data,
    include: {
      googleAccount: true,
      syncLogs: {
        orderBy: { createdAt: "desc" },
        take: 15,
      },
    },
  });
}
