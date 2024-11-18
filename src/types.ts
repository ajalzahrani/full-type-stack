import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import * as schema from "./db/schema";
import { z } from "zod";

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

export const insertProfileSchema = createInsertSchema(schema.Profiles);
export const selectProfileSchema = createSelectSchema(schema.Profiles);
export const requestProfileByIdSchema = selectProfileSchema.pick({ id: true });
export const requestProfileByUserIdSchema = selectProfileSchema.pick({
  userId: true,
});

export const insertPostSchema = createInsertSchema(schema.Posts);
export const selectPostSchema = createSelectSchema(schema.Posts);
export const requestPostByIdSchema = selectPostSchema.pick({ id: true });
export const requestPostByUserIdSchema = selectPostSchema.pick({
  userId: true,
});
