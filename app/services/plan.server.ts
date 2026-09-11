import { STARTER_PLAN, PRO_PLAN, UNLIMITED_PLAN } from "../constants/plans";

export const PLAN_LIMITS: Record<string, number> = {
  Free: 10,
  [STARTER_PLAN]: 500,
  [PRO_PLAN]: 2000,
  [UNLIMITED_PLAN]: Infinity,
};

export interface PlanInfo {
  activePlanName: string;
  limit: number;
  productCount: number;
  isLimitExceeded: boolean;
}

/**
 * Retrieves the store's currently active Shopify subscription plan name.
 */
export async function getActivePlanName(billingApi: any): Promise<string> {
  if (!billingApi) return "Free";
  try {
    const billingCheck = await billingApi.check({ isTest: true });
    if (billingCheck.hasActivePayment && billingCheck.appSubscriptions && billingCheck.appSubscriptions.length > 0) {
      return billingCheck.appSubscriptions[0].name || "Free";
    }
  } catch (error) {
    console.error("Error checking billing status:", error);
  }
  return "Free";
}

/**
 * Returns the product count limit for a given plan name.
 */
export function getPlanLimit(planName: string): number {
  return PLAN_LIMITS[planName] ?? PLAN_LIMITS.Free;
}

/**
 * Checks plan details against store product count and throws an error if limit is exceeded.
 */
export async function checkPlanLimitOrThrow(
  billingApi: any,
  productCount: number,
  contextMessage: string = "sync operations"
): Promise<PlanInfo> {
  const activePlanName = await getActivePlanName(billingApi);
  const limit = getPlanLimit(activePlanName);
  const isLimitExceeded = productCount > limit;

  if (isLimitExceeded) {
    const limitFormatted = limit === Infinity ? "Unlimited" : limit.toLocaleString();
    throw new Error(
      `Plan limit exceeded: Your store has ${productCount} products, which exceeds the ${activePlanName} limit of ${limitFormatted} products. Please upgrade your plan under Billing to enable ${contextMessage}.`
    );
  }

  return {
    activePlanName,
    limit,
    productCount,
    isLimitExceeded,
  };
}
