import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

// USER TABLE
export const Users = sqliteTable("Users", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  age: int().notNull(),
  username: text().notNull().unique(),
  password: text().notNull(),
});
export const usersRelations = relations(Users, ({ many }) => ({
  posts: many(Posts),
}));

// PROFILE TABLE
export const Profiles = sqliteTable("Profiles", {
  id: int().primaryKey({ autoIncrement: true }),
  bio: text().notNull(),
  userId: int().references(() => Users.id),
});

// POST TABLE
export const Posts = sqliteTable("Posts", {
  id: int().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  content: text().notNull(),
  userId: int().references(() => Users.id),
});
export const postsRelations = relations(Posts, ({ one }) => ({
  user: one(Users, {
    fields: [Posts.userId],
    references: [Users.id],
  }),
}));
