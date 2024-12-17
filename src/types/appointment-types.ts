import * as schema from "../db/schema";
import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

const DBAppointmentSchema = createInsertSchema(schema.Appointments);
const FormAppointmentSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID must be a numeric string").optional(),
  resourceId: z.string().regex(/^\d+$/, "Resource ID must be a numeric string"),
  patientMrn: z.string().regex(/^\d+$/, "Patient ID must be a numeric string"),
  facilityId: z
    .string()
    .regex(/^\d+$/, "Facility ID must be a numeric string")
    .optional(),
  typeId: z.string().regex(/^\d+$/, "Type ID must be a numeric string"),
  appointmentDate: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  status: z.string().default("scheduled"),
  notes: z.string().optional(),
});

export type DBAppointmentType = z.infer<typeof DBAppointmentSchema>;
export type FormAppointmentType = z.infer<typeof FormAppointmentSchema>;

export const convertFormAppointmentToDBAppointment = (
  formAppointment: FormAppointmentType
): DBAppointmentType => {
  const combineDateAndTime = (dateStr: string, timeStr: string) => {
    const [hours, minutes] = timeStr.split(":");
    const date = new Date(dateStr);
    date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    return date.getTime(); // Convert to timestamp for SQLite
  };

  return {
    ...formAppointment,
    appointmentDate: new Date(formAppointment.appointmentDate).getTime(),
    id: formAppointment.id ? parseInt(formAppointment.id) : undefined,
    resourceId: parseInt(formAppointment.resourceId),
    patientMrn: formAppointment.patientMrn,
    typeId: parseInt(formAppointment.typeId),
    startTime: combineDateAndTime(
      formAppointment.startTime,
      formAppointment.startTime
    ),
    endTime: combineDateAndTime(
      formAppointment.endTime,
      formAppointment.endTime
    ),
    status: formAppointment.status,
    notes: formAppointment.notes ?? null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null,
  };
};

export { DBAppointmentSchema, FormAppointmentSchema };
