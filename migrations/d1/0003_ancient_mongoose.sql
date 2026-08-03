ALTER TABLE `JournalEntry` ADD `noveltyId` text;--> statement-breakpoint
ALTER TABLE `JournalEntry` ADD `noveltyCompleted` integer DEFAULT false NOT NULL;