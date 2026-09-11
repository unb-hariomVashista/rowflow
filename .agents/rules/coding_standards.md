# Rowflow Architectural & Coding Standards Rulebook

This rulebook defines mandatory coding standards, architectural guidelines, and code hygiene practices derived from lead developer code reviews.

---

## 1. Layered Architecture & Strict Separation of Concerns

Always enforce the **Route ➔ Service ➔ Repository** layered architecture:

- **Routes (`app/routes/`) — Controllers Only**:
  - Responsible ONLY for authenticating sessions, parsing request parameters, invoking service/repository methods, and returning JSON/HTTP responses.
  - NEVER execute raw database queries or direct external API calls inside route loaders/actions.

- **Services (`app/services/`) — Pure Business Logic & External APIs**:
  - Contains domain business logic, external API integrations (Shopify GraphQL, Google APIs), and multi-step workflow orchestration.
  - Delegates ALL database queries to the repository layer.

- **Repositories (`app/repositories/`) — Pure Database Access Layer**:
  - Contains ONLY Prisma CRUD data access functions (`find`, `upsert`, `update`, `delete`).
  - No business logic or external API calls inside repository files.

---

## 2. Minimal & Expressive Repository APIs (Anti-Bloat)

- **Avoid Function Fragmentation**:
  - DO NOT create specialized 3-line wrapper functions for every individual field update (e.g., `setShopSyncLock`, `disconnectGoogleFromShop`, `updateGoogleAccountToken`).
  - Expose a clean, predictable, standard CRUD API per model (e.g., `findShopByDomain`, `upsertShop`, `updateShop`).
  - Pass typed data input objects (`Prisma.ShopUpdateInput`) to generic update/upsert methods instead of creating field-specific helper functions.

---

## 3. Single Responsibility Principle (SRP) & Utility Scoping

- **Utility Functions (`app/utils/`)**:
  - Helper functions like GraphQL client normalizers (`getGraphqlClient`) or string formatters MUST live in `app/utils/`, not inside service files.

- **Domain Service Scoping**:
  - Keep domain-specific lifecycle functions (e.g., `ensureGoogleSheetExists`) inside their dedicated domain service (`sheets.server.ts`), NOT in generic pipeline files like `sync.server.ts`.

---

## 4. UI Icon Standardization & Asset Management

- **No Raw Inline SVGs**:
  - NEVER write raw inline SVG code across React components when an icon library (e.g., `lucide-react`) is available in the project.
  - Import clean, tree-shakeable icons from `lucide-react`.

- **Check Public Assets First**:
  - ALWAYS inspect the `public/` directory for existing design assets (`top-banner.png`) before rendering synthetic SVG fallback graphics in hero/banner components.

---

## 5. End-User Error Sanitization & Server Logging

- **Sanitize User-Facing Errors**:
  - NEVER expose raw GCP console URLs, raw JSON API error payloads, or internal system stack traces to end users in UI toasts/alerts.

- **Server Diagnostics**:
  - Log technical details, raw HTTP response bodies, and stack traces to server logs (`console.error`).
  - Surface clean, actionable, user-friendly error messages in the UI (e.g., *"Failed to create Google Spreadsheet. Please verify your permissions and try again."*).

---

## 6. Relational Integrity & Framework Hooks

- **Database Foreign Keys**:
  - Define proper Prisma `@relation` fields with appropriate cascade deletion options (`onDelete: Cascade`) between related models (e.g., `Session` ↔ `Shop`).

- **Installation & Setup Hooks**:
  - Use framework lifecycle hooks (e.g., Shopify `afterAuth`) to initialize store data automatically upon app installation rather than lazy-checking and creating records repeatedly inside route loaders.
