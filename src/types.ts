import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import * as schema from "./db/schema";
import { z } from "zod";

// USERS TABLE
export const insertUserSchema = createInsertSchema(schema.Users);
export const selectUserSchema = createSelectSchema(schema.Users);
export const requestUserByIdSchema = selectUserSchema
  .pick({ id: true })
  .extend({
    id: z
      .string()
      .regex(/^\d+$/, "ID must be a numeric string")
      .transform((val) => parseInt(val)),
  });
export const requestUserByUsernameAndPasswordSchema = selectUserSchema.pick({
  username: true,
  password: true,
});

// PROFILES TABLE
export const insertProfileSchema = createInsertSchema(schema.Profiles);
export const selectProfileSchema = createSelectSchema(schema.Profiles);
export const requestProfileByIdSchema = selectProfileSchema.pick({ id: true });
export const requestProfileByUserIdSchema = selectProfileSchema.pick({
  userId: true,
});

// POSTS TABLE
// export const insertPostSchema = createInsertSchema(schema.Posts);
// export const selectPostSchema = createSelectSchema(schema.Posts);
// export const requestPostByIdSchema = selectPostSchema.pick({ id: true });
// export const requestPostByUserIdSchema = selectPostSchema.pick({
//   userId: true,
// });

// RESOURCE CONFIGURATION TABLE
export const insertResourceSchema = createInsertSchema(schema.Resources);
export const selectResourceSchema = createSelectSchema(schema.Resources);
export const requestResourceByIdSchema = selectResourceSchema.pick({
  id: true,
});

// RESOURCE CONFIGURATION TABLE
export const insertResourceTypeSchema = createInsertSchema(schema.Resources);
export const requestResourceTypeByIdSchema = selectResourceSchema.pick({
  id: true,
});

// FACILITIES TABLE
export const insertFacilitySchema = createInsertSchema(schema.Facilities);
export const selectFacilitySchema = createSelectSchema(schema.Facilities);
export const requestFacilityByIdSchema = selectFacilitySchema.pick({
  id: true,
});

// RESOURCE AVAILABILITY TABLE
export const insertResourceAvailabilitySchema = createInsertSchema(
  schema.ResourceAvailability
).extend({
  resourceId: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  startDate: z
    .union([z.string(), z.date()])
    .transform((val) => (typeof val === "string" ? new Date(val) : val)),
  endDate: z
    .union([z.string(), z.date()])
    .transform((val) => (typeof val === "string" ? new Date(val) : val))
    .nullable(),
});
export const selectResourceAvailabilitySchema = createSelectSchema(
  schema.ResourceAvailability
);
export const requestResourceAvailabilityByIdSchema =
  selectResourceAvailabilitySchema.pick({ id: true });

// APPOINTMENTS TABLE
export const insertAppointmentSchema = createInsertSchema(schema.Appointments);

export const selectAppointmentSchema = createSelectSchema(
  schema.Appointments
).extend({
  mrn: z.string().min(10).max(10),
});
export const requestAppointmentByIdSchema = selectAppointmentSchema.pick({
  id: true,
});
export const requestAppointmentByPatientMrnSchema =
  selectAppointmentSchema.pick({
    mrn: true,
  });
export const requestAppointmentByResourceConfigIdSchema =
  selectAppointmentSchema.pick({
    resourceId: true,
  });
export const requestAppointmentByResourceIdSchema = z.object({
  resourceId: z.number().int().positive(),
});

// PATIENTS TABLE
export const insertPatientSchema = createInsertSchema(schema.Patients);
export const selectPatientSchema = createSelectSchema(schema.Patients);
export const requestPatientByIdSchema = selectPatientSchema.pick({ id: true });
export const requestPatientByMrnSchema = selectPatientSchema.pick({
  medicalRecordNumber: true,
});
