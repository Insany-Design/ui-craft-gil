CREATE TABLE `course_config` (
	`id` integer PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`password_hash` text NOT NULL,
	`epoch` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `course_rate` (
	`key` text PRIMARY KEY NOT NULL,
	`count` integer NOT NULL,
	`expires` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `course_sessions` (
	`token_hash` text PRIMARY KEY NOT NULL,
	`epoch` text NOT NULL,
	`expires` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `course_sessions_expires_idx` ON `course_sessions` (`expires`);