import { Hono } from "hono";
import db from "../db";
import { Users } from "../db/schema";
import { eq, and, sql } from "drizzle-orm";
import {
  insertUserSchema,
  requestUserByIdSchema,
  requestUserByUsernameAndPasswordSchema,
} from "../types";
import { HTTPException } from "hono/http-exception";
import { zValidator } from "@hono/zod-validator";

const usersRoute = new Hono()
  .get("/", async (c, next) => {
    // get users from db
    const users = await db.select().from(Users);

    if (users.length === 0) {
      throw new HTTPException(404, {
        res: c.json({ error: "Users not found" }, 404),
      });
    }

    // return users
    return c.json(users);
  })
  .get("/total", async (c) => {
    const total = await db.select({ total: sql<number>`count(*)` }).from(Users);
    return c.json(total[0]);
  })
  .get("/:id", zValidator("param", requestUserByIdSchema), async (c) => {
    // get id from params
    const { id } = c.req.valid("param");

    // get user from db
    const user = await db.select().from(Users).where(eq(Users.id, id)).limit(1);

    if (user.length === 0) {
      throw new HTTPException(404, {
        res: c.json({ error: "User not found" }, 404),
      });
    }

    // return user
    return c.json(user);
  })
  .post("/signup", zValidator("json", insertUserSchema), async (c) => {
    // get data from request
    const user = c.req.valid("json");

    try {
      // insert user into db
      await db.insert(Users).values(user);
    } catch (error) {
      throw new HTTPException(400, {
        res: c.json({ error: "User not created" }, 400),
      });
    }

    // return user
    return c.json({ message: "User created" });
  })
  .post(
    "/login",
    zValidator("json", requestUserByUsernameAndPasswordSchema),
    async (c) => {
      const { username, password } = c.req.valid("json");

      const user = await db
        .select()
        .from(Users)
        .where(and(eq(Users.username, username), eq(Users.password, password)))
        .limit(1);

      if (user.length === 0) {
        throw new HTTPException(403, {
          res: c.json({ error: "Unauthorized" }, 403),
        });
      }

      // return user
      return c.json(user);
    }
  );

export default usersRoute;
