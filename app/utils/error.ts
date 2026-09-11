/**
 * Sanitizes technical or system error messages for user-facing display and log storage.
 * Prevents raw Prisma/database stack traces, query dumps, and unhandled exception details
 * from polluting the UI or sync logs.
 */
export function sanitizeErrorMessage(err: unknown): string {
  const rawMessage = err instanceof Error ? err.message : String(err || "");

  if (!rawMessage) {
    return "An unexpected error occurred. Please try again.";
  }

  // Handle Prisma / Database technical errors
  if (
    rawMessage.includes("Invalid `prisma.") ||
    rawMessage.includes("PrismaClient") ||
    rawMessage.includes("SQLite") ||
    rawMessage.includes("data.snapshotData")
  ) {
    return "A database operation failed while updating sync records. Please restart dev server and try again.";
  }

  // Handle standard network / OAuth failures
  if (rawMessage.includes("ECONNREFUSED") || rawMessage.includes("fetch failed")) {
    return "Failed to communicate with external service. Please check your network connection.";
  }

  // Handle Shopify GraphQL error rate limiting
  if (rawMessage.toLowerCase().includes("throttled")) {
    return "Shopify API request rate limit exceeded. Please wait a moment and try again.";
  }

  // If the error message is unusually long (e.g., raw JSON payload dump), truncate it cleanly
  if (rawMessage.length > 250) {
    return `${rawMessage.substring(0, 240)}... (see server console for details)`;
  }

  return rawMessage;
}
