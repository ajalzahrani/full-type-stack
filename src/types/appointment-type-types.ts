import * as schema from "../db/schema";
import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

const DBAppointmentTypeSchema = createInsertSchema(schema.AppointmentTypes);
const FormAppointmentTypeSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID must be a numeric string").optional(),
  name: z.string(),
  duration: z
    .string()
    .regex(/^\d+$/, "Duration must be a numeric string")
    .default("5"),
});

export type DBAppointmentTypeType = z.infer<typeof DBAppointmentTypeSchema>;
export type FormAppointmentTypeType = z.infer<typeof FormAppointmentTypeSchema>;

export const convertFormAppointmentTypeToDBAppointmentType = (
  formAppointmentType: FormAppointmentTypeType
): DBAppointmentTypeType => {
  return {
    ...formAppointmentType,
    id: formAppointmentType.id ? parseInt(formAppointmentType.id) : undefined,
    duration: parseInt(formAppointmentType.duration),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null,
  };
};

export { DBAppointmentTypeSchema, FormAppointmentTypeSchema };
