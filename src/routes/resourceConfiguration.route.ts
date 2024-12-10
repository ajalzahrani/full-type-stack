import { Hono } from "hono";
import db from "../db";
import { ResourceConfiguration } from "../db/schema";
import { eq } from "drizzle-orm";
import {
  insertResourceConfigurationSchema,
  requestResourceConfigurationByIdSchema,
} from "../types";
import { HTTPException } from "hono/http-exception";
import { zValidator } from "@hono/zod-validator";
const resourceConfigurationRoute = new Hono();

// get all resources
resourceConfigurationRoute
  .get("/", async (c) => {
    const resourceConfiguration = await db.select().from(ResourceConfiguration);
    return c.json(resourceConfiguration);
  })
  .get(
    "/:id",
    zValidator("param", requestResourceConfigurationByIdSchema),
    async (c) => {
      // get resource by id
      const { id } = c.req.valid("param");
      const resourceConfiguration = await db
        .select()
        .from(ResourceConfiguration)
        .where(eq(ResourceConfiguration.id, Number(id)))
        .limit(1);
      return c.json(resourceConfiguration);
    }
  )
  .post(
    "/",
    zValidator("json", insertResourceConfigurationSchema),
    async (c) => {
      // create resource
      const resourceConfiguration = c.req.valid("json");

      try {
        // insert resource into db
        await db.insert(ResourceConfiguration).values(resourceConfiguration);
      } catch (error) {
        throw new HTTPException(400, {
          res: c.json({ error: "Resource configuration not created" }, 400),
        });
      }

      return c.json({ message: "Resource configuration created" });
    }
  );

export default resourceConfigurationRoute;
