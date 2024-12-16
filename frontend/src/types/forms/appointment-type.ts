import { z } from "zod";
import { insertAppointmentSchema } from "@server/types";

// Base form field types for string/number conversions
export type FormFieldValue = string | number;
export type FormDateValue = string | null;

export type AppointmentFormData = z.infer<typeof insertAppointmentSchema>;

// Resource Configuration Form Values
export const AppointmentTypeFormValuesSchema = z.object({
  id: z.number(),
  resourceId: z.string(),
  patientId: z.string(),
  facilityId: z.string(),
  typeId: z.string(),
  appointmentDate: z.date(),
  startTime: z.string(),
  endTime: z.string(),
  notes: z.string().optional(),
});

export type AppointmentTypeFormValues = z.infer<
  typeof AppointmentTypeFormValuesSchema
>;

export const convertFormValuesToAPI = (values: AppointmentFormData) => ({
  ...values,
  resourceId: Number(values.resourceId),
  patientId: Number(values.patientId),
  facilityId: Number(values.facilityId),
  typeId: Number(values.typeId),
});

export const convertToFormValues = (values: AppointmentFormData) => ({
  ...values,
  resourceId: String(values.resourceId),
  patientId: String(values.patientId),
  facilityId: String(values.facilityId),
  typeId: String(values.typeId),
  startTime: values.startTime.toISOString(), // Convert Date to string
  endTime: values.endTime.toISOString(), // Convert Date to string
  notes: values.notes,
});
