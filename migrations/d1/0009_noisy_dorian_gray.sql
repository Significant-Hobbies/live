ALTER TABLE `User` ADD `profileVisibility` text DEFAULT 'private' NOT NULL;
--> statement-breakpoint
-- Preserve existing, addressable public profiles. New profiles start private.
UPDATE `User` SET `profileVisibility` = 'public' WHERE `username` IS NOT NULL;
