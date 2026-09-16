import "@shopify/shopify-app-react-router/adapters/node";
import {
  ApiVersion,
  AppDistribution,
  shopifyApp,
  BillingInterval,
} from "@shopify/shopify-app-react-router/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import prisma from "./db.server";
import { FREE_PLAN, STARTER_PLAN, PRO_PLAN, UNLIMITED_PLAN } from "./constants/plans";

export { FREE_PLAN, STARTER_PLAN, PRO_PLAN, UNLIMITED_PLAN };

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: ApiVersion.October25,
  scopes: process.env.SCOPES?.split(",") || [
    "read_products",
    "write_products",
  ],
  appUrl: process.env.SHOPIFY_APP_URL || "",
  authPathPrefix: "/auth",
  sessionStorage: new PrismaSessionStorage(prisma),
  distribution: AppDistribution.AppStore,
  future: {
    expiringOfflineAccessTokens: true,
  },
  billing: {
    [STARTER_PLAN]: {
      lineItems: [
        {
          amount: 5,
          currencyCode: "USD",
          interval: BillingInterval.Every30Days,
        },
      ],
    },
    [PRO_PLAN]: {
      lineItems: [
        {
          amount: 10,
          currencyCode: "USD",
          interval: BillingInterval.Every30Days,
        },
      ],
    },
    [UNLIMITED_PLAN]: {
      lineItems: [
        {
          amount: 30,
          currencyCode: "USD",
          interval: BillingInterval.Every30Days,
        },
      ],
    },
  },
  hooks: {
    afterAuth: async ({ session }) => {
      try {
        await prisma.shop.upsert({
          where: { shopDomain: session.shop },
          create: { shopDomain: session.shop },
          update: {},
        });
      } catch (error) {
        console.error("[shopify.server afterAuth Error]:", error);
      }
    },
  },
  ...(process.env.SHOP_CUSTOM_DOMAIN
    ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] }
    : {}),
});

export default shopify;
export const apiVersion = ApiVersion.October25;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;
