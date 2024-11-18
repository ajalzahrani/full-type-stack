import { Hono } from "hono";
import db from "../db";
import { Profiles } from "../db/schema";
import {
  requestProfileByUserIdSchema,
  requestProfileByIdSchema,
  insertProfileSchema,
} from "../types";
import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

const profileRoute = new Hono();

// get all profiles
profileRoute.get("/", async (c) => {
  const profiles = await db.select().from(Profiles);
  if (profiles.length === 0) {
    throw new HTTPException(404, {
      res: c.json({ error: "Profiles not found" }, 404),
    });
  }
  return c.json(profiles);
});

// get profile by id
profileRoute.get("/:id", async (c) => {
  const { id } = c.req.param();
  const result = requestProfileByIdSchema.safeParse({ id: Number(id) });
  if (!result.success) {
    throw new HTTPException(400, {
      res: c.json({ error: result.error.message }, 400),
    });
  }
  const profile = await db
    .select()
    .from(Profiles)
    .where(eq(Profiles.id, Number(id)))
    .limit(1);
  if (profile.length === 0) {
    throw new HTTPException(404, {
      res: c.json({ error: "Profile not found" }, 404),
    });
  }
  return c.json(profile);
});

// get profile by user id
profileRoute.get("/user/:userId", async (c) => {
  const { userId } = c.req.param();
  const result = requestProfileByUserIdSchema.safeParse({
    userId: Number(userId),
  });
  if (!result.success) {
    throw new HTTPException(400, {
      res: c.json({ error: result.error.message }, 400),
    });
  }
  const profile = await db
    .select()
    .from(Profiles)
    .where(eq(Profiles.userId, Number(userId)))
    .limit(1);
  return c.json(profile);
});

// create profile
profileRoute.post("/", async (c) => {
  const { bio, userId } = await c.req.json();
  const result = insertProfileSchema.safeParse({ bio, userId });
  if (!result.success) {
    return c.json({ error: result.error.message }, 400);
  }
  try {
    await db.insert(Profiles).values(result.data);
  } catch (error) {
    throw new HTTPException(400, {
      res: c.json({ error: "Profile not created" }, 400),
    });
  }
  return c.json(result.data);
});

export default profileRoute;
