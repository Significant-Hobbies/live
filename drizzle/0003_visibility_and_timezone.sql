-- Profile visibility opt-in + user timezone.
-- Additive and safe for existing production databases.
--
-- 1. Commitment.visibility / UserQuest.visibility
--    Both were rendered on the public profile with no visibility column at all,
--    so every commitment and completed quest was published with no way to opt
--    out. Defaulting to 'private' means existing rows stop being exposed the
--    moment this lands; owners opt back in per item from their profile.
--
-- 2. User.timezone
--    Every `dayDate` column is documented as a user-local YYYY-MM-DD key, but
--    the server resolved it in UTC. Storing the browser-reported IANA zone lets
--    the day boundary and the AM/PM ritual split match the user's own day.
--    NULL keeps the previous UTC behaviour until the browser reports a zone.
--
-- SQLite has no ADD COLUMN IF NOT EXISTS. Run each statement once; if a column
-- already exists SQLite raises "duplicate column name" and that statement can
-- be skipped safely.

ALTER TABLE "Commitment" ADD COLUMN "visibility" TEXT NOT NULL DEFAULT 'private';

ALTER TABLE "UserQuest" ADD COLUMN "visibility" TEXT NOT NULL DEFAULT 'private';

ALTER TABLE "User" ADD COLUMN "timezone" TEXT;

CREATE INDEX IF NOT EXISTS "Commitment_visibility_idx" ON "Commitment" ("visibility");
CREATE INDEX IF NOT EXISTS "UserQuest_userId_visibility_idx" ON "UserQuest" ("userId", "visibility");
