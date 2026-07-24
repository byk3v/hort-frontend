# HORT Frontend Agent Guide

## Scope and stack

This pnpm/Turborepo workspace contains Next.js web, Expo mobile, and shared
TypeScript packages. Read `../AGENTS.md` and existing documents under `docs/`
before changing architecture or shared behavior.

## Workspace boundaries

- `apps/web` owns Next.js routes, web UI, web authentication integration, and
  any deliberate backend-for-frontend proxy.
- `apps/mobile` owns Expo navigation, native UI, mobile OIDC integration, and
  secure token storage.
- `packages/*` must be platform-neutral unless the package name and
  documentation explicitly say otherwise.
- Do not share UI merely because web and mobile implement the same feature.
  Share transport contracts and genuinely platform-neutral behavior.

## API contract rules

- Do not add handwritten copies of backend DTOs.
- Existing types under `packages/types` are migration inventory. Remove them
  only feature by feature after the generated replacement is in use.
- Generated API sources must never be manually edited.
- The future API client must receive base URL, token retrieval, and optional
  `fetch` implementation through configuration.
- Generated code must not read `process.env`, browser storage, Expo storage, or
  Keycloak state.
- Web and mobile must consume the same API package version.
- Runtime view models and form types may remain manual when they are not HTTP
  transport models.

## Authentication

- Web and mobile may use different authentication adapters.
- Do not put Keycloak-specific behavior in the generated client.
- Never persist access or refresh tokens in insecure storage.
- Changes to client IDs, roles, redirect URIs, token claims, or logout behavior
  require checking the Keycloak and backend repositories.

## Web conventions

- Keep route entry points thin and feature implementation under
  `apps/web/src/features`.
- Respect the existing ADR for Next.js Route Handlers until a new ADR
  deliberately replaces it.
- Preserve upstream status and structured error information consistently.

## Mobile conventions

- Keep platform-specific navigation and secure-storage behavior in the mobile
  app.
- Do not assume browser globals in shared packages.
- Validate native authentication flows on their actual platform when they are
  introduced.

## Verification

Use pnpm only; do not introduce npm or Yarn lockfiles. Before handoff, run the
relevant package checks and normally:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

Do not run cleanup scripts or remove caches unless the task requires it.
