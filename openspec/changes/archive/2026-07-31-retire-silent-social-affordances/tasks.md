## 1. Public Surfaces

- [x] 1.1 Remove follow state, controls, and counts from public profiles while preserving profile actions.
- [x] 1.2 Remove like and comment state and controls from both public timeline routes while preserving artifact and owner actions.
- [x] 1.3 Remove like-derived data, card metrics, and sorting from Explore while retaining a balanced artifact-focused layout.

## 2. Runtime Retirement

- [x] 2.1 Remove the unreachable follow, like, and comment client components.
- [x] 2.2 Remove the unreachable social server actions and their unused imports.
- [x] 2.3 Confirm the retired social tables and indexes remain unchanged in the Drizzle schema.

## 3. Product Truth

- [x] 3.1 Update product, architecture, privacy, and project-status documentation to describe runtime retirement and historical-data preservation.

## 4. Verification

- [x] 4.1 Add or update focused tests for the retired public behavior.
- [x] 4.2 Run source-reference checks, typecheck, lint, focused/full tests, build, and strict OpenSpec validation.
- [x] 4.3 Capture responsive browser evidence and complete independent design critique and audit with zero unresolved P0/P1 findings.
