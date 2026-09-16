import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "app/shopify.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { shop, topic, payload } = await authenticate.webhook(request);

  console.log(`Received ${topic} compliance webhook for ${shop}`, payload);

  // Customers redact handling
  // If your app stores customer PII, erase customer records matching payload.customer.id.

  return new Response();
};
