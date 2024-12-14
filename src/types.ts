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
export const insertPostSchema = createInsertSchema(schema.Posts);
export const selectPostSchema = createSelectSchema(schema.Posts);
export const requestPostByIdSchema = selectPostSchema.pick({ id: true });
export const requestPostByUserIdSchema = selectPostSchema.pick({
  userId: true,
});

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

// RESOURCE CONFIGURATION TABLE
export const insertResourceConfigurationSchema = createInsertSchema(
  schema.ResourceConfiguration
).extend({
  resourceId: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  facilityId: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  estimatedWaitingTime: z
    .union([z.string(), z.number()])
    .transform((val) => Number(val)),
  statusId: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  startDate: z
    .union([z.string(), z.date()])
    .transform((val) => (typeof val === "string" ? new Date(val) : val))
    .nullable(),
  endDate: z
    .union([z.string(), z.date()])
    .transform((val) => (typeof val === "string" ? new Date(val) : val))
    .nullable(),
  weekDays: z.string(),
  blocked: z.boolean().optional(),
});

export const selectResourceConfigurationSchema = createSelectSchema(
  schema.ResourceConfiguration
);
export const requestResourceConfigurationByIdSchema =
  selectResourceConfigurationSchema.pick({ id: true });

// APPOINTMENTS TABLE
export const insertAppointmentSchema = createInsertSchema(schema.Appointments);
export const selectAppointmentSchema = createSelectSchema(schema.Appointments);
export const requestAppointmentByIdSchema = selectAppointmentSchema.pick({
  id: true,
});
export const requestAppointmentByPatientIdSchema = selectAppointmentSchema.pick(
  {
    patientId: true,
  }
);
export const requestAppointmentByResourceConfigIdSchema =
  selectAppointmentSchema.pick({
    resourceConfigId: true,
  });
export const requestAppointmentByResourceIdSchema = z.object({
  resourceId: z.number().int().positive(),
});
