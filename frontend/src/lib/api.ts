import {
  insertAppointmentSchema,
  insertFacilitySchema,
  insertResourceConfigurationSchema,
  insertResourceSchema,
  insertUserSchema,
  requestUserByUsernameAndPasswordSchema,
} from "@server/types";
import { hc } from "hono/client";
import { AppType } from "@server/app";
// import { hcWithType } from "@server/hc";

import { z } from "zod";

// const client = hcWithType("http://localhost:3030");
const client = hc<AppType>("/");

export async function getTotalUsers() {
  const res = await client.api.users.total.$get();

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  const data = await res.json();
  return data.total;
}

export async function createUser(user: z.infer<typeof insertUserSchema>) {
  const res = await client.api.users.signup.$post({ json: user });

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return res.json();
}

export async function loginUser(
  user: z.infer<typeof requestUserByUsernameAndPasswordSchema>
) {
  const res = await client.api.users.login.$post({ json: user });

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return res.json();
}

export async function getResources() {
  const res = await client.api.resources.$get();

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return res.json();
}

export async function getResourceById(id: number) {
  const res = await client.api.resources[":id"].$get({
    param: { id: id.toString() },
  });

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return res.json();
}

export async function createResource(
  resource: z.infer<typeof insertResourceSchema>
) {
  const res = await client.api.resources.$post({ json: resource });

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return res.json();
}

export async function updateResource(
  resource: z.infer<typeof insertResourceSchema>
) {
  const res = await client.api.resources[":id"].$patch({
    param: { id: resource.id?.toString() || "" },
    json: resource,
  });

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return res.json();
}

export async function deleteResource(id: number) {
  const res = await client.api.resources[":id"].$delete({
    param: { id: id.toString() },
  });

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return res.json();
}

export async function getAppointments() {
  const res = await client.api.appointments.$get();

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return res.json();
}

export async function getAppointmentById(id: number) {
  const res = await client.api.appointments[":id"].$get({
    param: { id: id.toString() },
  });

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return res.json();
}

export async function createAppointment(
  appointment: z.infer<typeof insertAppointmentSchema>
) {
  const res = await client.api.appointments.$post({ json: appointment });

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return res.json();
}

export async function updateAppointment(
  appointment: z.infer<typeof insertAppointmentSchema>
) {
  const res = await client.api.appointments[":id"].$patch({
    param: { id: appointment.id?.toString() || "" },
    json: appointment,
  });

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return res.json();
}

export async function deleteAppointment(id: number) {
  const res = await client.api.appointments[":id"].$delete({
    param: { id: id.toString() },
  });

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return res.json();
}

export async function getFacilities() {
  const res = await client.api.facilities.$get();

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return res.json();
}

export async function getFacilityById(id: number) {
  const res = await client.api.facilities[":id"].$get({
    param: { id: id.toString() },
  });

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return res.json();
}

export async function createFacility(
  facility: z.infer<typeof insertFacilitySchema>
) {
  const res = await client.api.facilities.$post({ json: facility });

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return res.json();
}

export async function updateFacility(
  facility: z.infer<typeof insertFacilitySchema>
) {
  const res = await client.api.facilities[":id"].$patch({
    param: { id: facility.id?.toString() || "" },
    json: facility,
  });

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return res.json();
}

export async function deleteFacility(id: number) {
  const res = await client.api.facilities[":id"].$delete({
    param: { id: id.toString() },
  });

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return res.json();
}

export async function getResourceConfiguration() {
  const res = await client.api.resourceConfiguration.$get();

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return res.json();
}

export async function getResourceConfigurationById(id: number) {
  const res = await client.api.resourceConfiguration[":id"].$get({
    param: { id: id.toString() },
  });

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return res.json();
}

export async function createResourceConfiguration(
  resourceConfiguration: z.infer<typeof insertResourceConfigurationSchema>
) {
  const res = await client.api.resourceConfiguration.$post({
    json: resourceConfiguration,
  });

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return res.json();
}

export async function updateResourceConfiguration(
  resourceConfiguration: z.infer<typeof insertResourceConfigurationSchema>
) {
  const res = await client.api.resourceConfiguration[":id"].$patch({
    param: { id: resourceConfiguration.id?.toString() || "" },
    json: resourceConfiguration,
  });

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return res.json();
}

export async function deleteResourceConfiguration(id: number) {
  const res = await client.api.resourceConfiguration[":id"].$delete({
    param: { id: id.toString() },
  });

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return res.json();
}
