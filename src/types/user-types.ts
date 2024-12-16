import * as schema from "../db/schema";
import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

const DBUserSchema = createInsertSchema(schema.Users);
const FormUserSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID must be a numeric string").optional(),
  name: z.string(),
  age: z.number(),
  username: z.string(),
  password: z.string(),
});

export const requestUserByUsernameAndPasswordSchema = FormUserSchema.pick({
  username: true,
  password: true,
});

export type DBUserType = z.infer<typeof DBUserSchema>;
export type FormUserType = z.infer<typeof FormUserSchema>;

export const convertFormUserToDBUser = (formUser: FormUserType): DBUserType => {
  return {
    ...formUser,
    id: formUser.id ? parseInt(formUser.id) : undefined,
    age: formUser.age,
    username: formUser.username,
    password: formUser.password,
  };
};

export { DBUserSchema, FormUserSchema };
