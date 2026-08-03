## 1. Data and Selection

- [x] 1.1 Add daily novelty fields to the journal schema and generate an additive D1 migration
- [x] 1.2 Implement and unit-test the eligible corpus, stable daily selection, recent-repeat avoidance, and next-choice behavior
- [x] 1.3 Add owner-scoped read, replace, and reversible completion actions that preserve journal content
- [x] 1.4 Extend local Daily state and account import to carry novelty fields safely
- [x] 1.5 Add validated person-authored novelty text across D1, local storage, and account import

## 2. Daily Experience

- [x] 2.1 Add an accessible new-thing sidecar beside today’s journal with another, done, undo, pending, success, and error states
- [x] 2.2 Show stored novelty context read-only while browsing past journal days
- [x] 2.3 Preserve the approved Life Atlas system at 390, 768, and 1440 widths
- [x] 2.4 Add an inline choose-my-own path with save, cancel, validation, and rollback states
- [x] 2.5 Rebuild habits as a compact checklist and remove progress and streak decoration
- [x] 2.6 Remove the redundant Today navigation item and name authenticated `/` as the dashboard
- [x] 2.7 Separate public navigation from the post-onboarding private workspace and gate private entry points in account and local modes
- [x] 2.8 Add a consolidated, chronological Things I've done view for completed daily-new-item records in account and local modes

## 3. Route Simplification

- [x] 3.1 Remove the unused dashboard, life-plan, and look-back compatibility routes
- [x] 3.2 Remove redirect-specific tests and references without changing canonical Today, Live More, Daily, or History behavior

## 4. Verification

- [x] 4.1 Add unit coverage for selection and persistence invariants
- [x] 4.2 Add local and authenticated browser coverage for replacement, completion, reload restoration, journal preservation, and past-day history
- [x] 4.3 Run lint, typecheck, unit tests, focused browser tests, strict OpenSpec validation, local migration verification, and production build
- [x] 4.4 Capture responsive design evidence and pass the Fleet design-review gate with zero P0/P1 findings
- [x] 4.5 Extend local and authenticated browser coverage for custom intentions and the redesigned habit checklist
- [x] 4.6 Re-run responsive evidence, accessibility, project checks, and production build
