import * as schema from "../db/schema";
import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

const DBResourceSchema = createInsertSchema(schema.Resources);
const FormResourceSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID must be a numeric string").optional(),
  name: z.string(),
  resourceType: z.string(),
  description: z.string().optional(),
});

export type DBResourceType = z.infer<typeof DBResourceSchema>;
export type FormResourceType = z.infer<typeof FormResourceSchema>;

export const convertFormResourceToDBResource = (
  formResource: FormResourceType
): DBResourceType => {
  return {
    ...formResource,
    id: formResource.id ? parseInt(formResource.id) : undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null,
  };
};

export { DBResourceSchema, FormResourceSchema };
