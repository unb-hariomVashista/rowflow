import {
  findGoogleAccountById,
  updateGoogleAccount,
  upsertGoogleAccountByEmail,
} from "../repositories/googleAccount.repository";
import {
  findShopByDomain,
  updateShop,
  upsertShop,
} from "../repositories/shop.repository";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";

export const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/drive.file",
].join(" ");

export function getGoogleClientId(): string {
  return process.env.GOOGLE_CLIENT_ID || "";
}

export function getGoogleClientSecret(): string {
  return process.env.GOOGLE_CLIENT_SECRET || "";
}

export function getGoogleRedirectUri(): string {
  const appUrl = process.env.SHOPIFY_APP_URL || "http://localhost:3000";
  return `${appUrl}/auth/google/callback`;
}

export function getGoogleAuthUrl(shopDomain: string): string {
  const clientId = getGoogleClientId();
  const redirectUri = getGoogleRedirectUri();

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: GOOGLE_SCOPES,
    access_type: "offline",
    prompt: "consent",
    state: shopDomain,
  });

  return `${GOOGLE_AUTH_URL}?${params.toString()}`;
}

export async function exchangeCodeForTokens(code: string) {
  const params = new URLSearchParams({
    code,
    client_id: getGoogleClientId(),
    client_secret: getGoogleClientSecret(),
    redirect_uri: getGoogleRedirectUri(),
    grant_type: "authorization_code",
  });

  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google token exchange failed: ${errorText}`);
  }

  return response.json() as Promise<{
    access_token: string;
    refresh_token?: string;
    expires_in: number;
    scope: string;
    token_type: string;
  }>;
}

export async function getGoogleUserProfile(accessToken: string) {
  const response = await fetch(GOOGLE_USERINFO_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch Google user profile");
  }

  return response.json() as Promise<{
    id: string;
    email: string;
    name?: string;
    picture?: string;
  }>;
}

export async function linkGoogleAccountToShop(
  shopDomain: string,
  tokens: { access_token: string; refresh_token?: string; scope?: string; expires_in?: number },
  userProfile: { email: string; name?: string },
) {
  const expiresAt = tokens.expires_in
    ? new Date(Date.now() + tokens.expires_in * 1000)
    : undefined;

  const googleAccount = await upsertGoogleAccountByEmail(userProfile.email, {
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    scopes: tokens.scope || GOOGLE_SCOPES,
    expiresAt,
  });

  return upsertShop(shopDomain, { googleAccountId: googleAccount.id });
}

export async function getShopWithGoogleAccount(shopDomain: string) {
  return findShopByDomain(shopDomain);
}

export async function disconnectGoogleAccount(shopDomain: string) {
  return updateShop(shopDomain, { googleAccountId: null });
}

export async function refreshAccessToken(googleAccountId: string, refreshToken: string) {
  const params = new URLSearchParams({
    client_id: getGoogleClientId(),
    client_secret: getGoogleClientSecret(),
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  });

  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to refresh Google access token: ${errorText}`);
  }

  const data = (await response.json()) as {
    access_token: string;
    expires_in: number;
  };

  const expiresAt = new Date(Date.now() + data.expires_in * 1000);
  const updated = await updateGoogleAccount(googleAccountId, {
    accessToken: data.access_token,
    expiresAt,
  });
  return updated.accessToken;
}

export async function getValidAccessToken(googleAccountId: string): Promise<string> {
  const account = await findGoogleAccountById(googleAccountId);

  if (!account) {
    throw new Error("Google account not found");
  }

  const isExpired = account.expiresAt
    ? account.expiresAt.getTime() - Date.now() < 5 * 60 * 1000
    : false;

  if (isExpired && account.refreshToken) {
    return refreshAccessToken(account.id, account.refreshToken);
  }

  return account.accessToken;
}
