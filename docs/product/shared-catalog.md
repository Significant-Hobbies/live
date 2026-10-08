# Shared experience catalog

Everyone searches the same approved catalog. Seed ideas come from the canonical
419-entry source corpus; personal bucket lists, completion state and notes are
separate. As-you-type search returns five results; Explore returns twenty.
Both use /api/experience-catalog and server-side pagination.

Signed-in users can explicitly submit a title and category for review. This
action never publishes or changes their personal list. Pending/rejected ideas
and submitter IDs are never included in public responses. Approval deduplicates
normalized titles and inserts an idea into ExperienceCatalog. Rejection only
updates the submission. There is no public moderation endpoint.

## Operator tooling

The additive 0007 migration is prepared, not applied by this work. Apply schema
changes only through the existing, separately authorized migration workflow.
The CLI supports local data only and refuses --remote. Do not use the unrelated
journey seed script: that script also edits demo timelines and users.

Prepare a reviewable seed artifact without changing any database:

```sh
pnpm catalog seed --output .fleet-local/experience-catalog-seed.sql
```

After the catalog schema has been applied locally:

```sh
pnpm catalog seed --local
pnpm catalog pending --local
pnpm catalog review --local --id <submission-id> --decision approve --reviewer <operator>
pnpm catalog review --local --id <submission-id> --decision reject --reviewer <operator>
```

Seed inserts are idempotent and do not overwrite approved data. The CLI records
the supplied operator name and time; this local label is not an authenticated
admin identity. Queue inspection is capped at 100 oldest pending rows.
Authenticated submissions are bounded to twenty per user per day in an atomic
database statement; repeats by the same user do not create duplicate rows.

While the catalog is absent or the seed import is incomplete, reads use built-in seed ideas and explicitly
return source: seed. They do not send the whole corpus to the client. An
unrelated database failure returns an error instead of silently replacing
shared results. Writes require the new tables; they do not pretend to succeed.
Approval requires the seed import to be complete before publishing new ideas.

Production migration, seed import, reviewer access and release remain explicit
operator actions. No production database changes were performed here.
