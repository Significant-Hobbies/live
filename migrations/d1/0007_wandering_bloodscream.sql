CREATE TABLE `CatalogSubmission` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`title` text NOT NULL,
	`normalizedTitle` text NOT NULL,
	`category` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`reviewedBy` text,
	`reviewedAt` integer,
	FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "CatalogSubmission_status_check" CHECK("CatalogSubmission"."status" IN ('pending','approved','rejected'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `CatalogSubmission_user_title_idx` ON `CatalogSubmission` (`userId`,`normalizedTitle`);--> statement-breakpoint
CREATE INDEX `CatalogSubmission_status_created_idx` ON `CatalogSubmission` (`status`,`createdAt`);--> statement-breakpoint
CREATE INDEX `CatalogSubmission_user_created_idx` ON `CatalogSubmission` (`userId`,`createdAt`);--> statement-breakpoint
CREATE TABLE `ExperienceCatalog` (
	`slug` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`normalizedTitle` text NOT NULL,
	`description` text,
	`searchText` text NOT NULL,
	`emoji` text NOT NULL,
	`category` text NOT NULL,
	`kind` text NOT NULL,
	`source` text NOT NULL,
	`sortOrder` integer DEFAULT 2147483647 NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ExperienceCatalog_normalizedTitle_unique` ON `ExperienceCatalog` (`normalizedTitle`);--> statement-breakpoint
CREATE INDEX `ExperienceCatalog_category_kind_idx` ON `ExperienceCatalog` (`category`,`kind`);