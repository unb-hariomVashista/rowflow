import {
  FREE_PLAN,
  STARTER_PLAN,
  PRO_PLAN,
  UNLIMITED_PLAN,
  formatPlanDisplayName,
} from "../constants/plans";

export const PLAN_LIMITS: Record<string, number> = {
  [FREE_PLAN]: 10,
  Free: 10,
  "Free Plan": 10,
  [STARTER_PLAN]: 500,
  "Starter Plan": 500,
  [PRO_PLAN]: 2000,
  "Pro Plan": 2000,
  [UNLIMITED_PLAN]: Infinity,
  "Unlimited Plan": Infinity,
};

export interface PlanInfo {
  activePlanName: string;
  limit: number;
  productCount: number;
  isLimitExceeded: boolean;
}

/**
 * Retrieves the store's currently active Shopify subscription plan handle/name.
 */
export async function getActivePlanName(billingApi: any): Promise<string> {
  if (!billingApi) return FREE_PLAN;
  try {
    const billingCheck = await billingApi.check({
      plans: [STARTER_PLAN, PRO_PLAN, UNLIMITED_PLAN, "Starter Plan", "Pro Plan", "Unlimited Plan"],
      isTest: true,
    });
    if (billingCheck.hasActivePayment && billingCheck.appSubscriptions && billingCheck.appSubscriptions.length > 0) {
      const activeName = billingCheck.appSubscriptions[0].name;
      if (activeName === "Starter Plan" || activeName === STARTER_PLAN) return STARTER_PLAN;
      if (activeName === "Pro Plan" || activeName === PRO_PLAN) return PRO_PLAN;
      if (activeName === "Unlimited Plan" || activeName === UNLIMITED_PLAN) return UNLIMITED_PLAN;
      return activeName || FREE_PLAN;
    }
  } catch (error) {
    console.error("Error checking billing status:", error);
  }
  return FREE_PLAN;
}

/**
 * Returns the product count limit for a given plan handle.
 */
export function getPlanLimit(planName: string): number {
  return PLAN_LIMITS[planName] ?? PLAN_LIMITS[FREE_PLAN];
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
