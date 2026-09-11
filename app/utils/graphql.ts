/**
 * Normalizes adminApi object to ensure GraphQL executor function is returned
 * regardless of caller passing admin or admin.graphql
 */
export function getGraphqlClient(adminApi: any) {
  if (typeof adminApi === "function") {
    return adminApi;
  }
  if (adminApi && typeof adminApi.graphql === "function") {
    return adminApi.graphql.bind(adminApi);
  }
  throw new Error("Invalid adminApi parameter passed to GraphQL client helper.");
}
