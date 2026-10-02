# Habits removal

Owner correction: there should be no Habits page. Preserve the existing design; core destinations are Catalog, My list, Weekly journal, and Life in weeks.

Removed desktop/mobile/footer Habits links, habit tracker UI, greeting-only code, and unused habit server actions. /habits redirects to /bucket-list, /daily to /journal. Existing schema, local storage identities, historical records, import handling, and journal archive stay intact. Completion logging remains in My list. Landing, login, and manifesto copy no longer promise habit tracking.

Independent Assessment A: 32/40, ten Nielsen heuristics, no unresolved P0/P1. Fresh native browser verified both redirects and four primary destinations. Independent Assessment B: 17/20, detector zero findings, no unresolved P0/P1; fresh native browser at390/768/1440 verified navigation, contrast, touch targets and no horizontal overflow. Read-only browser evaluation precluded an injected overlay; plain screenshots and accessibility measurements were used. Synthetic anonymous screenshots are captured at all three widths.

Validation: pnpm quality passed including664 tests;105 browser checks passed across three viewports, including list completion, reload persistence, journal saving, navigation and redirects. PR CI covers authenticated redirects and import through My list.

Inherited color literals and silent compatibility redirects remain minor findings. No redesign, new dependencies, migrations, or account data writes. The owned local server is stopped before release.
