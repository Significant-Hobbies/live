ALTER TABLE `User` ADD `weeklyEmailOptIn` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `WeeklyLogEntry` ADD `turnsJson` text;