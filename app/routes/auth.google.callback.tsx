import type { LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";
import {
  exchangeCodeForTokens,
  getGoogleUserProfile,
  linkGoogleAccountToShop,
} from "../services/google.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const shopDomain = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  if (error || !code || !shopDomain) {
    console.error("Google OAuth error or missing parameters:", { error, code, shopDomain });
    return redirect(`/app?auth_error=${encodeURIComponent(error || "Invalid OAuth response")}`);
  }

  try {
    // 1. Exchange code for access & refresh tokens
    const tokens = await exchangeCodeForTokens(code);

    // 2. Fetch user profile
    const profile = await getGoogleUserProfile(tokens.access_token);

    // 3. Link Google account to Shop in Prisma DB
    await linkGoogleAccountToShop(shopDomain, tokens, profile);

    // 4. Redirect back to main embedded app
    return redirect(`/app?shop=${encodeURIComponent(shopDomain)}&google_auth=success`);
  } catch (err: any) {
    console.error("Error handling Google OAuth callback:", err);
    return redirect(`/app?auth_error=${encodeURIComponent(err.message || "Failed to complete Google authentication")}`);
  }
};
