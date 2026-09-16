import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "app/shopify.server";
import prisma from "app/db.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { shop, topic, payload } = await authenticate.webhook(request);

  console.log(`Received ${topic} compliance webhook for ${shop}`, payload);

  // Shop redact: Delete shop record and any remaining sessions
  try {
    if (shop) {
      await prisma.session.deleteMany({ where: { shop } });
      await prisma.shop.deleteMany({ where: { shopDomain: shop } });
    }
  } catch (error) {
    console.error(`Error processing ${topic} webhook for ${shop}:`, error);
  }

  return new Response();
};
