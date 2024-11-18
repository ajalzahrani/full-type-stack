import { Hono } from "hono";
import db from "../db";
import { Posts } from "../db/schema";
import { eq } from "drizzle-orm";
import {
  insertPostSchema,
  requestPostByIdSchema,
  requestPostByUserIdSchema,
} from "../types";
import { HTTPException } from "hono/http-exception";
const postsRoute = new Hono();

// get all posts
postsRoute.get("/", async (c) => {
  const posts = await db.select().from(Posts);
  if (posts.length === 0) {
    throw new HTTPException(404, {
      res: c.json({ error: "Posts not found" }, 404),
    });
  }
  return c.json(posts);
});

// get post by id
postsRoute.get("/:id", async (c) => {
  const { id } = c.req.param();
  const post = await db
    .select()
    .from(Posts)
    .where(eq(Posts.id, Number(id)))
    .limit(1);
  if (post.length === 0) {
    throw new HTTPException(404, {
      res: c.json({ error: "Post not found" }, 404),
    });
  }
  return c.json(post);
});

// get posts by user id
postsRoute.get("/user/:userId", async (c) => {
  const { userId } = c.req.param();
  const posts = await db
    .select()
    .from(Posts)
    .where(eq(Posts.userId, Number(userId)))
    .limit(1);
  if (posts.length === 0) {
    throw new HTTPException(404, {
      res: c.json({ error: "Posts not found" }, 404),
    });
  }
  return c.json(posts);
});

// create post
postsRoute.post("/", async (c) => {
  const { title, content, userId } = await c.req.json();
  const result = insertPostSchema.safeParse({ title, content, userId });
  if (!result.success) {
    throw new HTTPException(400, {
      res: c.json({ error: result.error.message }, 400),
    });
  }
  try {
    await db.insert(Posts).values(result.data);
  } catch (error) {
    throw new HTTPException(400, {
      res: c.json({ error: "Post not created" }, 400),
    });
  }
  return c.json(result.data);
});

export default postsRoute;
