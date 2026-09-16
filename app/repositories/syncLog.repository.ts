import prisma from "../db.server";

export async function createSyncLog(data: {
  shopId: string;
  type: string;
  status: "SUCCESS" | "FAILED";
  details: string;
  itemCount?: number;
}) {
  return prisma.syncLog.create({
    data: {
      shopId: data.shopId,
      type: data.type,
      status: data.status,
      details: data.details,
      itemCount: data.itemCount ?? 0,
    },
  });
}

export async function getRecentSyncLogsByShopId(shopId: string, limit = 10) {
  return prisma.syncLog.findMany({
    where: { shopId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getAllSyncLogsByShopId(shopId: string, limit = 200) {
  return prisma.syncLog.findMany({
    where: { shopId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
