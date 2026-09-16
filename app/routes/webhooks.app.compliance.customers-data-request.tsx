import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "app/shopify.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { shop, topic, payload } = await authenticate.webhook(request);

  console.log(`Received ${topic} compliance webhook for ${shop}`, payload);

  // Customers data request handling
  // If your app stores customer PII, return the data requested.
  // Otherwise, respond 200 OK.

  return new Response();
};
