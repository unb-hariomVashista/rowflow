export const FREE_PLAN = "free";
export const STARTER_PLAN = "starter-plan";
export const PRO_PLAN = "pro-plan";
export const UNLIMITED_PLAN = "unlimited-plan";

export function formatPlanDisplayName(planHandle: string): string {
  if (planHandle === STARTER_PLAN || planHandle === "Starter Plan") return "Starter Plan";
  if (planHandle === PRO_PLAN || planHandle === "Pro Plan") return "Pro Plan";
  if (planHandle === UNLIMITED_PLAN || planHandle === "Unlimited Plan") return "Unlimited Plan";
  return "Free Plan";
}

