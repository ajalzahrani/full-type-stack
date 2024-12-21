import * as schema from "../db/schema";
import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

// Create Zod schemas from Drizzle schema
const DBPatientSchema = createInsertSchema(schema.Patients);

// Create a form-specific schema with string-based fields
const FormPatientSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID must be a numeric string").optional(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string(), // Will be converted to timestamp
  genderId: z
    .string()
    .regex(/^\d+$/, "Gender ID must be a numeric string")
    .optional(),
  email: z.string().email("Invalid email").optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  medicalRecordNumber: z.string().min(1, "Medical record number is required"),
  blocked: z.boolean().optional().default(false),
});

// Export types
export type DBPatientType = z.infer<typeof DBPatientSchema>;
export type FormPatientType = z.infer<typeof FormPatientSchema>;

// Conversion function
export const convertFormPatientToDBPatient = (
  formPatient: FormPatientType
): DBPatientType => {
  return {
    ...formPatient,
    id: formPatient.id ? parseInt(formPatient.id) : undefined,
    dateOfBirth: new Date(formPatient.dateOfBirth).getTime(),
    genderId: formPatient.genderId ? parseInt(formPatient.genderId) : null,
    blocked: formPatient.blocked ?? false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null,
  };
};

export { DBPatientSchema, FormPatientSchema };
