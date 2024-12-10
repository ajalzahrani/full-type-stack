import { Hono } from "hono";
import db from "../db";
import { Resources } from "../db/schema";
import { eq } from "drizzle-orm";
import { insertResourceSchema, requestResourceByIdSchema } from "../types";
import { HTTPException } from "hono/http-exception";
import { zValidator } from "@hono/zod-validator";
const resourceRoute = new Hono();

// get all resources
resourceRoute
  .get("/", async (c) => {
    const resources = await db.select().from(Resources);
    return c.json(resources);
  })
  .get("/:id", zValidator("param", requestResourceByIdSchema), async (c) => {
    // get resource by id
    const { id } = c.req.valid("param");
    const resource = await db
      .select()
      .from(Resources)
      .where(eq(Resources.id, Number(id)))
      .limit(1);
    return c.json(resource);
  })
  .post("/", zValidator("json", insertResourceSchema), async (c) => {
    // create resource
    const resource = c.req.valid("json");

    try {
      // insert resource into db
      await db.insert(Resources).values(resource);
    } catch (error) {
      throw new HTTPException(400, {
        res: c.json({ error: "Resource not created" }, 400),
      });
    }

    return c.json({ message: "Resource created" });
  });

export default resourceRoute;
