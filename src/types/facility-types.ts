import * as schema from "../db/schema";
import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

const DBFacilitySchema = createInsertSchema(schema.Facilities);
const FormFacilitySchema = z.object({
  id: z.string().regex(/^\d+$/, "ID must be a numeric string").optional(),
  name: z.string(),
  description: z.string().optional(),
});

export type DBFacilityType = z.infer<typeof DBFacilitySchema>;
export type FormFacilityType = z.infer<typeof FormFacilitySchema>;

export const convertFormFacilityToDBFacility = (
  formFacility: FormFacilityType
): DBFacilityType => {
  return {
    ...formFacility,
    id: formFacility.id ? parseInt(formFacility.id) : undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null,
  };
};

export { DBFacilitySchema, FormFacilitySchema };
