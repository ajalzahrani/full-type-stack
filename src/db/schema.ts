import { int, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";

// Timestamps
const timestamps = {
  updatedAt: text(),
  createdAt: text().default(sql`(CURRENT_TIMESTAMP)`),
  deletedAt: text(),
};

// Helper for creating timestamp fields
const timestamp = () => integer("timestamp", { mode: "timestamp" });

// USER TABLE
export const Users = sqliteTable("Users", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  age: int().notNull(),
  username: text().notNull().unique(),
  password: text().notNull(),
});
export const usersRelations = relations(Users, ({ many }) => ({
  posts: many(Posts),
}));

// PROFILE TABLE
export const Profiles = sqliteTable("Profiles", {
  id: int().primaryKey({ autoIncrement: true }),
  bio: text().notNull(),
  userId: int().references(() => Users.id),
});

// POST TABLE
export const Posts = sqliteTable("Posts", {
  id: int().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  content: text().notNull(),
  userId: int().references(() => Users.id),
});
export const postsRelations = relations(Posts, ({ one }) => ({
  user: one(Users, {
    fields: [Posts.userId],
    references: [Users.id],
  }),
}));

// RESOURCE CONFIGURATION TABLE

export const Resources = sqliteTable("Resources", {
  id: int("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  resourceType: text("resourceType").notNull(),
  description: text("description"),
  ...timestamps,
});
export const resourceRelations = relations(Resources, ({ many }) => ({
  resourceConfiguration: many(ResourceConfiguration),
  availability: many(ResourceAvailability),
  appointments: many(Appointments),
}));

export const Facilities = sqliteTable("Facilities", {
  id: int("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  ...timestamps,
});
export const facilitiesRelations = relations(Facilities, ({ many }) => ({
  resourceConfiguration: many(ResourceConfiguration),
  appointments: many(Appointments),
}));

export const ResourceConfiguration = sqliteTable("ResourceConfigurations", {
  id: int("id").primaryKey({ autoIncrement: true }),
  resourceId: int("resourceId").notNull(), // Foreign key to the actual resource
  assignedBy: int("assignedBy"), // ID of the user who created/assigned this resource
  estimatedWaitingTime: int("estimatedWaitingTime").default(0), // Default is 0
  startTime: text("startTime"), // Example: '08:00 AM'
  endTime: text("endTime"), // Example: '05:00 PM'
  startDate: integer({ mode: "timestamp" }), // Availability start date
  endDate: integer({ mode: "timestamp" }), // Availability end date
  weekDays: text("weekDays"), // Example: 'Monday,Tuesday'
  statusId: int("statusId").notNull(), // Status ID referencing a status table
  blocked: integer({ mode: "boolean" }).default(false), // Default to not blocked
  facilityId: int("facilityId"), // Foreign key to a facility table
  ...timestamps,
});
export const resourceConfigurationRelations = relations(
  ResourceConfiguration,
  ({ one, many }) => ({
    // Relation with Appointments
    appointments: many(Appointments),

    // Relation with ResourceTypes
    resourceType: one(Resources, {
      fields: [ResourceConfiguration.resourceId],
      references: [Resources.id],
    }),

    // Relation with Facilities
    facility: one(Facilities, {
      fields: [ResourceConfiguration.facilityId],
      references: [Facilities.id],
    }),
  })
);

// export const Appointments = sqliteTable("Appointments", {
//   id: int("id").primaryKey({ autoIncrement: true }),
//   resourceConfigId: integer("resourceConfigId").notNull(), // Foreign key to ResourceConfiguration
//   patientId: int("patientId").notNull(), // Foreign key to Patients table
//   appointmentTime: integer({ mode: "timestamp" }).notNull(), // Exact time of the appointment
//   status: text("status").notNull(), // Example: 'scheduled', 'completed', etc.
//   typeId: int("typeId"), // Optional: Appointment type foreign key
//   ...timestamps,
// });
// export const appointmentsRelations = relations(Appointments, ({ one }) => ({
//   resourceConfiguration: one(ResourceConfiguration, {
//     fields: [Appointments.resourceConfigId],
//     references: [ResourceConfiguration.id],
//   }),
//   patient: one(Patients, {
//     fields: [Appointments.patientId],
//     references: [Patients.id],
//   }),
// }));

// Patients table
export const Patients = sqliteTable("Patients", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  firstName: text("firstName").notNull(),
  lastName: text("lastName").notNull(),
  dateOfBirth: integer("dateOfBirth").notNull(),
  gender: text("gender"),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  medicalRecordNumber: text("medicalRecordNumber").notNull().unique(),
  blocked: integer({ mode: "boolean" }).default(false),
  ...timestamps,
});
export const patientRelations = relations(Patients, ({ many }) => ({
  appointments: many(Appointments),
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
