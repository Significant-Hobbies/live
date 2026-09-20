CREATE TABLE `WeeklyLogEntry` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`weekOf` text NOT NULL,
	`text` text NOT NULL,
	`promptText` text,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `WeeklyLogEntry_userId_weekOf_key` ON `WeeklyLogEntry` (`userId`,`weekOf`);--> statement-breakpoint
CREATE INDEX `WeeklyLogEntry_userId_idx` ON `WeeklyLogEntry` (`userId`);--> statement-breakpoint
ALTER TABLE `User` ADD `weekStartsOn` text;
