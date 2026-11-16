ALTER TABLE `BucketListItem` ADD `lifeScale` text CONSTRAINT `BucketListItem_lifeScale_check` CHECK (`lifeScale` IN ('moment', 'adventure', 'chapter'));
