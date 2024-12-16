import { Hono } from "hono";
import { logger } from "hono/logger";
import { HTTPException } from "hono/http-exception";
import { serveStatic } from "hono/bun";
import { zValidator } from "@hono/zod-validator";
import * as scehma from "./types";
import {
  Users,
  Resources,
  ResourceConfiguration,
  Facilities,
  Appointments,
  Patients,
  AppointmentTypes,
  ResourceAvailability,
} from "./db/schema";
import {
  convertFormResourceAvailabilityToDBResourceAvailability,
  DBResourceAvailabilitySchema,
  FormResourceAvailabilitySchema,
} from "./types/resource-availability-types";
import { DBUserSchema } from "./types/user-types";
import db from "./db";
import { eq, and, sql, desc, gte, lte } from "drizzle-orm";
import { z } from "zod";
import {
  convertFormAppointmentToDBAppointment,
  FormAppointmentSchema,
} from "./types/appointment-types";

export const app = new Hono()

  .get("/api/users", async (c, next) => {
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
  .get("/api/users/total", async (c) => {
    const total = await db.select({ total: sql<number>`count(*)` }).from(Users);
    return c.json(total[0]);
  })
  .get(
    "/api/users/:id",
    zValidator("param", z.object({ id: z.string() })),
    async (c) => {
      // get id from params
      const { id } = c.req.valid("param");

      // get user from db
      const user = await db
        .select()
        .from(Users)
        .where(eq(Users.id, Number(id)))
        .limit(1);

      if (user.length === 0) {
        throw new HTTPException(404, {
          res: c.json({ error: "User not found" }, 404),
        });
      }

      // return user
      return c.json(user);
    }
  )
  .post("/api/users/signup", zValidator("json", DBUserSchema), async (c) => {
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
    "/api/users/login",
    zValidator(
      "json",
      z.object({ username: z.string(), password: z.string() })
    ),
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
  )
  // get resources
  .get("/api/resources", async (c) => {
    try {
      const resources = await db
        .select()
        .from(Resources)
        .orderBy(desc(Resources.resourceType));
      return c.json(resources);
    } catch (error) {
      throw new HTTPException(400, {
        res: c.json({ error: "Resources not found" }, 400),
      });
    }
  })
  // get resource by id
  .get(
    "/api/resources/:id",
    zValidator("param", scehma.requestResourceByIdSchema),
    async (c) => {
      // get resource by id
      const { id } = c.req.valid("param");
      const resource = await db
        .select()
        .from(Resources)
        .where(eq(Resources.id, Number(id)))
        .limit(1);
      return c.json(resource);
    }
  )
  // create resource
  .post(
    "/api/resources",
    zValidator("json", scehma.insertResourceSchema),
    async (c) => {
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
    }
  )
  // update resource
  .patch(
    "/api/resources/:id",
    zValidator("param", z.object({ id: z.string() })),
    zValidator("json", scehma.insertResourceSchema),
    async (c) => {
      const { id } = c.req.valid("param");
      const resource = c.req.valid("json");
      await db
        .update(Resources)
        .set(resource)
        .where(eq(Resources.id, Number(id)));
      return c.json({ message: "Resource updated" });
    }
  )
  // delete resource
  .delete(
    "/api/resources/:id",
    zValidator("param", z.object({ id: z.string() })),
    async (c) => {
      const { id } = c.req.valid("param");
      await db.delete(Resources).where(eq(Resources.id, Number(id)));
      return c.json({ message: "Resource deleted" });
    }
  )
  // get resource configuration
  .get("/api/resourceConfiguration", async (c) => {
    const resourceConfiguration = await db
      .select()
      .from(ResourceConfiguration)
      .innerJoin(Resources, eq(ResourceConfiguration.resourceId, Resources.id))
      .innerJoin(
        Facilities,
        eq(ResourceConfiguration.facilityId, Facilities.id)
      )
      .orderBy(desc(ResourceConfiguration.resourceId));
    return c.json(resourceConfiguration);
  })
  // get resource configuration by id
  .get(
    "/api/resourceConfiguration/:id",
    zValidator("param", scehma.requestResourceConfigurationByIdSchema),
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
  // create resource configuration
  .post(
    "/api/resourceConfiguration",
    zValidator("json", scehma.insertResourceConfigurationSchema),
    async (c) => {
      const resourceConfiguration = c.req.valid("json");

      try {
        await db.insert(ResourceConfiguration).values(resourceConfiguration);
      } catch (error) {
        throw new HTTPException(400, {
          res: c.json({ error: "Resource configuration not created" }, 400),
        });
      }

      return c.json({ message: "Resource configuration created" });
    }
  )
  // update resource configuration
  .patch(
    "/api/resourceConfiguration/:id",
    zValidator("param", z.object({ id: z.string() })),
    zValidator("json", scehma.insertResourceConfigurationSchema),
    async (c) => {
      const { id } = c.req.valid("param");
      const resourceConfiguration = c.req.valid("json");
      await db
        .update(ResourceConfiguration)
        .set(resourceConfiguration)
        .where(eq(ResourceConfiguration.id, Number(id)));
      return c.json({ message: "Resource configuration updated" });
    }
  )
  // delete resource configuration
  .delete(
    "/api/resourceConfiguration/:id",
    zValidator("param", z.object({ id: z.string() })),
    async (c) => {
      const { id } = c.req.valid("param");
      await db
        .delete(ResourceConfiguration)
        .where(eq(ResourceConfiguration.id, Number(id)));
      return c.json({ message: "Resource configuration deleted" });
    }
  )
  // get facilities
  .get("/api/facilities", async (c) => {
    const facilities = await db.select().from(Facilities);
    return c.json(facilities);
  })
  // get facility by id
  .get(
    "/api/facilities/:id",
    zValidator("param", scehma.requestFacilityByIdSchema),
    async (c) => {
      // get resource by id
      const { id } = c.req.valid("param");
      const facility = await db
        .select()
        .from(Facilities)
        .where(eq(Facilities.id, Number(id)))
        .limit(1);
      return c.json(facility);
    }
  )
  // create facility
  .post(
    "/api/facilities",
    zValidator("json", scehma.insertFacilitySchema),
    async (c) => {
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
    }
  )
  .patch(
    "/api/facilities/:id",
    zValidator("param", z.object({ id: z.string() })),
    zValidator("json", scehma.insertFacilitySchema),
    async (c) => {
      const { id } = c.req.valid("param");
      const facility = c.req.valid("json");
      await db
        .update(Facilities)
        .set(facility)
        .where(eq(Facilities.id, Number(id)));
      return c.json({ message: "Facility updated" });
    }
  )
  // delete facility
  .delete(
    "/api/facilities/:id",
    zValidator("param", z.object({ id: z.string() })),
    async (c) => {
      const { id } = c.req.valid("param");
      await db.delete(Facilities).where(eq(Facilities.id, Number(id)));
      return c.json({ message: "Facility deleted" });
    }
  )
  // get Resource Availability
  .get("/api/resourceAvailability", async (c) => {
    const resourceAvailability = await db
      .select()
      .from(ResourceAvailability)
      .innerJoin(Resources, eq(ResourceAvailability.resourceId, Resources.id));
    return c.json(resourceAvailability);
  })
  // get Resource Availability by id
  .get(
    "/api/resourceAvailability/:id",
    zValidator("param", z.object({ id: z.string() })),
    async (c) => {
      const { id } = c.req.valid("param");
      const resourceAvailability = await db
        .select()
        .from(ResourceAvailability)
        .where(eq(ResourceAvailability.id, Number(id)));
      return c.json(resourceAvailability);
    }
  )
  .get(
    "/api/resourceAvailability/:resourceId/:date",
    zValidator("param", z.object({ resourceId: z.string(), date: z.string() })),
    async (c) => {
      const { resourceId, date } = c.req.valid("param");

      const selectedDate = new Date(date).getTime();

      console.log(selectedDate);

      const availability = await db
        .select()
        .from(ResourceAvailability)
        .where(
          and(
            eq(ResourceAvailability.resourceId, parseInt(resourceId)),
            lte(ResourceAvailability.startDate, selectedDate),
            gte(ResourceAvailability.endDate, selectedDate)
          )
        );

      console.log(availability);

      // Process availability to return time slots
      // This is a simplified example and may need to be adjusted based on your specific requirements
      return c.json(
        availability.map((slot) => ({
          startTime: slot.startTime,
          endTime: slot.endTime,
        }))
      );
    }
  )
  // create resource availability
  .post(
    "/api/resourceAvailability",
    zValidator("json", FormResourceAvailabilitySchema),
    async (c) => {
      const resourceAvailability = c.req.valid("json");

      const dbResourceAvailability =
        convertFormResourceAvailabilityToDBResourceAvailability(
          resourceAvailability
        );

      console.log(dbResourceAvailability);

      try {
        await db.insert(ResourceAvailability).values(dbResourceAvailability);
      } catch (error) {
        console.error("Error creating resource availability:", error);
        throw new HTTPException(400, {
          res: c.json(
            {
              error: "Resource availability not created",
              details: error instanceof Error ? error.message : "Unknown error",
            },
            400
          ),
        });
      }

      return c.json({ message: "Resource availability created" });
    }
  )
  // update resource availability
  .patch(
    "/api/resourceAvailability/:id",
    zValidator("param", z.object({ id: z.string() })),
    zValidator("json", FormResourceAvailabilitySchema),
    async (c) => {
      const { id } = c.req.valid("param");
      const resourceAvailability = c.req.valid("json");

      const dbResourceAvailability =
        convertFormResourceAvailabilityToDBResourceAvailability(
          resourceAvailability
        );

      await db
        .update(ResourceAvailability)
        .set(dbResourceAvailability)
        .where(eq(ResourceAvailability.id, Number(id)));
      return c.json({ message: "Resource availability updated" });
    }
  )
  // delete resource availability
  .delete(
    "/api/resourceAvailability/:id",
    zValidator("param", z.object({ id: z.string() })),
    async (c) => {
      const { id } = c.req.valid("param");
      await db
        .delete(ResourceAvailability)
        .where(eq(ResourceAvailability.id, Number(id)));
      return c.json({ message: "Resource availability deleted" });
    }
  )
  // get appointments
  .get("/api/appointments", async (c) => {
    const appointments = await db
      .select()
      .from(Appointments)
      .leftJoin(Patients, eq(Appointments.patientId, Patients.id))
      .leftJoin(AppointmentTypes, eq(Appointments.typeId, AppointmentTypes.id))
      .leftJoin(Resources, eq(Appointments.resourceId, Resources.id))
      .leftJoin(Facilities, eq(Appointments.facilityId, Facilities.id));
    return c.json(appointments);
  })
  // get appointment by id
  .get(
    "/api/appointments/:id",
    zValidator("param", z.object({ id: z.string() })),
    async (c) => {
      // get resource by id
      const { id } = c.req.valid("param");
      const appointment = await db
        .select()
        .from(Appointments)
        .where(eq(Appointments.id, Number(id)))
        .limit(1);
      return c.json(appointment);
    }
  )
  // create appointment
  .post(
    "/api/appointments",
    zValidator("json", FormAppointmentSchema),
    async (c) => {
      // create resource
      const appointment = c.req.valid("json");

      const dbAppointment = convertFormAppointmentToDBAppointment(appointment);

      const patient = await db
        .select()
        .from(Patients)
        .where(eq(Patients.id, dbAppointment.patientId))
        .limit(1);

      if (patient.length === 0) {
        throw new HTTPException(404, {
          res: c.json({ error: "Patient not found" }, 404),
        });
      }

      try {
        // insert resource into db
        await db.insert(Appointments).values(dbAppointment);
      } catch (error) {
        throw new HTTPException(400, {
          res: c.json({ error: "Appointment not created" }, 400),
        });
      }

      return c.json({ message: "Appointment created" });
    }
  )
  // update appointment
  .patch(
    "/api/appointments/:id",
    zValidator("param", z.object({ id: z.string() })),
    zValidator("json", FormAppointmentSchema),
    async (c) => {
      const { id } = c.req.valid("param");
      const appointment = c.req.valid("json");

      const dbAppointment = convertFormAppointmentToDBAppointment(appointment);

      await db
        .update(Appointments)
        .set(dbAppointment)
        .where(eq(Appointments.id, Number(id)));
      return c.json({ message: "Appointment updated" });
    }
  )
  // delete appointment
  .delete(
    "/api/appointments/:id",
    zValidator("param", z.object({ id: z.string() })),
    async (c) => {
      const { id } = c.req.valid("param");
      await db.delete(Appointments).where(eq(Appointments.id, Number(id)));
      return c.json({ message: "Appointment deleted" });
    }
  )
  // get appointment types
  .get("/api/appointmentTypes", async (c) => {
    const appointmentTypes = await db.select().from(AppointmentTypes);
    return c.json(appointmentTypes);
  })
  // get patients
  .get("/api/patients", async (c) => {
    const patients = await db.select().from(Patients);
    return c.json(patients);
  })
  // get patient by id
  .get(
    "/api/patients/:id",
    zValidator("param", scehma.requestPatientByIdSchema),
    async (c) => {
      const { id } = c.req.valid("param");
      const patient = await db
        .select()
        .from(Patients)
        .where(eq(Patients.id, Number(id)))
        .limit(1);
      return c.json(patient);
    }
  )
  // get patient by medical record number
  .get(
    "/api/patients/mrn/:mrn",
    zValidator("param", z.object({ mrn: z.string() })),
    async (c) => {
      const { mrn } = c.req.valid("param");
      const patient = await db
        .select()
        .from(Patients)
        .where(eq(Patients.medicalRecordNumber, mrn))
        .limit(1);
      return c.json(patient);
    }
  )
  // create patient
  .post(
    "/api/patients",
    zValidator("json", scehma.insertPatientSchema),
    async (c) => {
      const patient = c.req.valid("json");
      await db.insert(Patients).values(patient);
      return c.json({ message: "Patient created" });
    }
  )
  // update patient
  .patch(
    "/api/patients/:id",
    zValidator("param", z.object({ id: z.string() })),
    zValidator("json", scehma.insertPatientSchema),
    async (c) => {
      const { id } = c.req.valid("param");
      const patient = c.req.valid("json");
      await db
        .update(Patients)
        .set(patient)
        .where(eq(Patients.id, Number(id)));
      return c.json({ message: "Patient updated" });
    }
  )
  // block patient
  .patch(
    "/api/patients/:id/block",
    zValidator("param", z.object({ id: z.string() })),
    zValidator("json", z.object({ blocked: z.boolean() })),
    async (c) => {
      const { id } = c.req.valid("param");
      const status = c.req.valid("json");
      await db
        .update(Patients)
        .set({ blocked: status.blocked })
        .where(eq(Patients.id, Number(id)));
      return c.json({ message: "Patient blocked" });
    }
  );

// static files
app.get("*", serveStatic({ root: "./frontend/dist" }));
app.get("*", serveStatic({ path: "./frontend/dist/index.html" }));

// error handler
app.onError((err, c) => {
  if (err instanceof HTTPException) {
    // Get the custom response
    return err.getResponse();
  }
  return c.json({ error: "Internal Server Error" }, 500);
});

export default app;
export type AppType = typeof app;
