import { Hono } from "hono";
import db from "../db";
import { Facilities } from "../db/schema";
import { eq } from "drizzle-orm";
import { insertFacilitySchema, requestFacilityByIdSchema } from "../types";
import { HTTPException } from "hono/http-exception";
import { zValidator } from "@hono/zod-validator";
const facilityRoute = new Hono();

// get all resources
facilityRoute
  .get("/", async (c) => {
    const facilities = await db.select().from(Facilities);
    return c.json(facilities);
  })
  .get("/:id", zValidator("param", requestFacilityByIdSchema), async (c) => {
    // get resource by id
    const { id } = c.req.valid("param");
    const facility = await db
      .select()
      .from(Facilities)
      .where(eq(Facilities.id, Number(id)))
      .limit(1);
    return c.json(facility);
  })
  .post("/", zValidator("json", insertFacilitySchema), async (c) => {
    // create resource
    const facility = c.req.valid("json");

    try {
      // insert resource into db
      await db.insert(Facilities).values(facility);
    } catch (error) {
      throw new HTTPException(400, {
        res: c.json({ error: "Facility not created" }, 400),
      });
    }

    return c.json({ message: "Facility created" });
  });

export default facilityRoute;
