CREATE TABLE `BucketItemUpdate` (
	`id` text PRIMARY KEY NOT NULL,
	`itemId` text NOT NULL,
	`userId` text NOT NULL,
	`text` text NOT NULL,
	`createdAt` integer NOT NULL,
	FOREIGN KEY (`itemId`) REFERENCES `BucketListItem`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `BucketItemUpdate_userId_itemId_idx` ON `BucketItemUpdate` (`userId`,`itemId`);