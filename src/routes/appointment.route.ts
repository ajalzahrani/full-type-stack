import { Hono } from "hono";
import db from "../db";
import { Appointments } from "../db/schema";
import { eq } from "drizzle-orm";
import {
  insertAppointmentSchema,
  requestAppointmentByIdSchema,
} from "../types";
import { HTTPException } from "hono/http-exception";
import { zValidator } from "@hono/zod-validator";
const appointmentRoute = new Hono();

// get all resources
appointmentRoute
  .get("/", async (c) => {
    const appointments = await db.select().from(Appointments);
    return c.json(appointments);
  })
  .get("/:id", zValidator("param", requestAppointmentByIdSchema), async (c) => {
    // get resource by id
    const { id } = c.req.valid("param");
    const appointment = await db
      .select()
      .from(Appointments)
      .where(eq(Appointments.id, Number(id)))
      .limit(1);
    return c.json(appointment);
  })
  .post("/", zValidator("json", insertAppointmentSchema), async (c) => {
    // create resource
    const appointment = c.req.valid("json");

    try {
      // insert resource into db
      await db.insert(Appointments).values(appointment);
    } catch (error) {
      throw new HTTPException(400, {
        res: c.json({ error: "Appointment not created" }, 400),
      });
    }

    return c.json({ message: "Appointment created" });
  });

export default appointmentRoute;
