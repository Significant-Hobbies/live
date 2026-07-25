# drizzle/

Two kinds of file live here. The distinction matters, because only one kind is
tracked by drizzle-kit.

## Drizzle-managed

Recorded in `meta/_journal.json`, with a matching `meta/<idx>_snapshot.json`:

| File | Role |
| --- | --- |
| `0000_furry_scorpion.sql` | The original generated migration. |
| `0001_baseline_current_schema.sql` | **Baseline, intentionally empty.** Anchors `meta/0001_snapshot.json`, which records the schema as of 2026-07-25. Do not add statements to it. |

## Hand-written, applied by hand

**Not** in `_journal.json`. `drizzle-kit migrate` will not run these — they were
applied manually and the baseline snapshot already accounts for them:

| File | Applied to production? |
| --- | --- |
| `0001_better_auth.sql` | Yes |
| `0002_life_bingo.sql` | Yes |
| `0003_visibility_and_timezone.sql` | **No — see [`STATUS.md`](../STATUS.md)** |

The numeric prefixes on hand-written files are chronological labels, not journal
indices, which is why `0001_` appears twice.

## Why the baseline exists

Before 2026-07-25 the snapshot only knew `0000`, while the database had moved far
past it via `db:push` and the hand-written files above. `drizzle-kit generate`
therefore diffed against an ancient baseline and emitted `CREATE TABLE` for tables
that already existed in production — output that fails on contact with a real
database but looks plausible enough to commit by mistake.

Baselining produced 5 `CREATE TABLE`, 8 `ALTER TABLE` and 15 index statements, all
for existing objects, and **zero `DROP`s** — confirming the snapshot was merely
behind rather than divergent. Those statements were discarded and the file left
empty. `pnpm db:generate` now reports `No schema changes` against `src/db/schema.ts`
and produces correct incremental diffs from here.

## Adding a migration

1. Edit `src/db/schema.ts` — it is the source of truth.
2. Run `pnpm db:generate`. Read the generated SQL before trusting it.
3. Apply it yourself. **Nothing in this repo applies migrations to production**;
   deploys and migrations are operator-owned. Never assume a database has a
   migration because the file exists here.

Local development uses `pnpm db:push` against `file:./dev.db`, which does not go
through this directory at all.

## Retired tables

`Arc` and `DailyCheckin` are still defined in `src/db/schema.ts` with no runtime
readers or writers. They are kept so a generated migration can never drop them.
Do not "clean them up" via `db:generate` — that would emit a destructive
migration against production data. See
[`docs/architecture/data-model.md`](../docs/architecture/data-model.md).
