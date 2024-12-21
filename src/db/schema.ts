import { int, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";

// Timestamps
const timestamps = {
  updatedAt: text(),
  createdAt: text().default(sql`(CURRENT_TIMESTAMP)`),
  deletedAt: text(),
};

// USER TABLE
export const Users = sqliteTable("Users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});
export const usersRelations = relations(Users, ({ one }) => ({
  profile: one(Profiles, {
    fields: [Users.id],
    references: [Profiles.userId],
  }),
}));

// PROFILE TABLE
export const Profiles = sqliteTable("Profiles", {
  id: int().primaryKey({ autoIncrement: true }),
  bio: text().notNull(),
  userId: int().references(() => Users.id),
});
export const profilesRelations = relations(Profiles, ({ one }) => ({
  user: one(Users, {
    fields: [Profiles.userId],
    references: [Users.id],
  }),
}));

// RESOURCE CONFIGURATION TABLE

export const ResourceTypes = sqliteTable("ResourceTypes", {
  id: int("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
});
export const resourceTypesRelations = relations(ResourceTypes, ({ many }) => ({
  resources: many(Resources),
}));

export const Resources = sqliteTable("Resources", {
  id: int("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  resourceTypeId: int("resourceTypeId")
    .notNull()
    .references(() => ResourceTypes.id),
  description: text("description"),
  ...timestamps,
});
export const resourceRelations = relations(Resources, ({ many, one }) => ({
  availability: many(ResourceAvailability),
  appointments: many(Appointments),
  resourceType: one(ResourceTypes, {
    fields: [Resources.resourceTypeId],
    references: [ResourceTypes.id],
  }),
}));

export const Facilities = sqliteTable("Facilities", {
  id: int("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  ...timestamps,
});
export const facilitiesRelations = relations(Facilities, ({ many }) => ({
  appointments: many(Appointments),
}));

// Gender table
export const Genders = sqliteTable("Genders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
});
export const gendersRelations = relations(Genders, ({ many }) => ({
  patients: many(Patients),
}));

// Patients table
export const Patients = sqliteTable("Patients", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  firstName: text("firstName").notNull(),
  lastName: text("lastName").notNull(),
  dateOfBirth: integer("dateOfBirth").notNull(),
  genderId: integer("genderId").references(() => Genders.id),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  medicalRecordNumber: text("medicalRecordNumber").notNull().unique(),
  blocked: integer({ mode: "boolean" }).default(false),
  ...timestamps,
});
export const patientRelations = relations(Patients, ({ many, one }) => ({
  appointments: many(Appointments),
  gender: one(Genders, {
    fields: [Patients.genderId],
    references: [Genders.id],
  }),
}));

// ResourceAvailability table
export const ResourceAvailability = sqliteTable("ResourceAvailability", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  resourceId: integer("resourceId")
    .notNull()
    .references(() => Resources.id),
  startTime: integer("startTime").notNull(), // e.g., 2024-01-01 08:00:00
  endTime: integer("endTime").notNull(), // e.g., 2024-01-01 09:00:00
  startDate: integer("startDate").notNull(), // e.g., 2024-01-01
  endDate: integer("endDate"), // e.g., 2024-01-01
  weekDays: text("weekDays").notNull(), // e.g., 'Mon,Tue,Wed'
  facilityId: integer("facilityId").references(() => Facilities.id),
  consultationDuration: integer("consultationDuration").notNull(), // e.g., 30 minutes
  followupDuration: integer("followupDuration").notNull(), // e.g., 15 minutes
  isRecurring: integer("isRecurring", { mode: "boolean" })
    .notNull()
    .default(true),
  ...timestamps,
});
export const resourceAvailabilityRelations = relations(
  ResourceAvailability,
  ({ one }) => ({
    resource: one(Resources, {
      fields: [ResourceAvailability.resourceId],
      references: [Resources.id],
    }),
    facility: one(Facilities, {
      fields: [ResourceAvailability.facilityId],
      references: [Facilities.id],
    }),
  })
);

// AppointmentTypes table
export const AppointmentTypes = sqliteTable("AppointmentTypes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  duration: integer("duration").notNull(), // Duration in minutes
  ...timestamps,
});
export const appointmentTypeRelations = relations(
  AppointmentTypes,
  ({ many }) => ({
    appointments: many(Appointments),
  })
);

// Appointments table
export const Appointments = sqliteTable("Appointments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  resourceId: integer("resourceId")
    .notNull()
    .references(() => Resources.id),
  patientMrn: text("patientMrn")
    .notNull()
    .references(() => Patients.medicalRecordNumber),
  typeId: integer("typeId")
    .notNull()
    .references(() => AppointmentTypes.id),
  appointmentDate: integer("appointmentDate").notNull(), // e.g 2024-01-01
  startTime: integer("startTime").notNull(), // e.g 2024-01-01 08:00:00
  endTime: integer("endTime").notNull(), // e.g 2024-01-01 09:00:00
  status: text("status").notNull().default("scheduled"),
  notes: text("notes"),
  ...timestamps,
});
export const appointmentRelations = relations(Appointments, ({ one }) => ({
  resource: one(Resources, {
    fields: [Appointments.resourceId],
    references: [Resources.id],
  }),
  patient: one(Patients, {
    fields: [Appointments.patientMrn],
    references: [Patients.medicalRecordNumber],
  }),
  type: one(AppointmentTypes, {
    fields: [Appointments.typeId],
    references: [AppointmentTypes.id],
  }),
}));
