CREATE TABLE `Appointments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`resourceConfigId` integer NOT NULL,
	`patientId` integer NOT NULL,
	`appointmentTime` integer NOT NULL,
	`status` text NOT NULL,
	`typeId` integer,
	`updatedAt` text,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP),
	`deletedAt` text
);
--> statement-breakpoint
CREATE TABLE `Facilities` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`updatedAt` text,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP),
	`deletedAt` text
);
--> statement-breakpoint
CREATE TABLE `Posts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`userId` integer,
	FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Profiles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`bio` text NOT NULL,
	`userId` integer,
	FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `ResourceConfigurations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`resourceId` integer NOT NULL,
	`assignedBy` integer,
	`estimatedWaitingTime` integer DEFAULT 0,
	`startTime` text,
	`endTime` text,
	`startDate` integer,
	`endDate` integer,
	`weekDays` text,
	`statusId` integer NOT NULL,
	`blocked` integer DEFAULT false,
	`facilityId` integer,
	`updatedAt` text,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP),
	`deletedAt` text
);
--> statement-breakpoint
CREATE TABLE `Resources` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`resourceType` text NOT NULL,
	`description` text,
	`updatedAt` text,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP),
	`deletedAt` text
);
--> statement-breakpoint
CREATE TABLE `Users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`age` integer NOT NULL,
	`username` text NOT NULL,
	`password` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Users_username_unique` ON `Users` (`username`);