import * as schema from "../db/schema";
import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

const DBResourceAvailabilitySchema = createInsertSchema(
  schema.ResourceAvailability
);

const FormResourceAvailabilitySchema = z.object({
  id: z.string().regex(/^\d+$/, "ID must be a numeric string").optional(),
  resourceId: z.string().regex(/^\d+$/, "Resource ID must be a numeric string"),
  startTime: z.string(),
  endTime: z.string(),
  startDate: z.string(),
  endDate: z.string().nullable(),
  facilityId: z.string().regex(/^\d+$/, "Facility ID must be a numeric string"),
  consultationDuration: z
    .string()
    .regex(/^\d+$/, "Consultation Duration must be a numeric string"),
  followupDuration: z
    .string()
    .regex(/^\d+$/, "Followup Duration must be a numeric string"),
  weekDays: z.string(),
  isRecurring: z.boolean().optional(),
});

export type DBResourceAvailabilityType = z.infer<
  typeof DBResourceAvailabilitySchema
>;
export type FormResourceAvailabilityType = z.infer<
  typeof FormResourceAvailabilitySchema
>;

export const convertFormResourceAvailabilityToDBResourceAvailability = (
  formResourceAvailability: FormResourceAvailabilityType
): DBResourceAvailabilityType => {
  // Helper function to combine date and time strings
  const combineDateAndTime = (dateStr: string, timeStr: string) => {
    const [hours, minutes] = timeStr.split(":");
    const date = new Date(dateStr);
    date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    return date.getTime(); // Convert to timestamp for SQLite
  };

  const now = Date.now(); // Current timestamp

  return {
    ...formResourceAvailability,
    id: formResourceAvailability.id
      ? parseInt(formResourceAvailability.id)
      : undefined,
    resourceId: parseInt(formResourceAvailability.resourceId),
    startTime: combineDateAndTime(
      formResourceAvailability.startDate,
      formResourceAvailability.startTime
    ),
    endTime: combineDateAndTime(
      formResourceAvailability.startDate,
      formResourceAvailability.endTime
    ),
    startDate: new Date(formResourceAvailability.startDate).getTime(), // Convert to timestamp
    endDate: formResourceAvailability.endDate
      ? new Date(formResourceAvailability.endDate).getTime()
      : null,
    weekDays: formResourceAvailability.weekDays,
    facilityId: parseInt(formResourceAvailability.facilityId),
    consultationDuration: parseInt(
      formResourceAvailability.consultationDuration
    ),
    followupDuration: parseInt(formResourceAvailability.followupDuration),
    isRecurring: formResourceAvailability.isRecurring ?? true,
    createdAt: now.toString(),
    updatedAt: now.toString(),
    deletedAt: null,
  };
};

export { DBResourceAvailabilitySchema, FormResourceAvailabilitySchema };
