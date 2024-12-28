import { z } from "zod";
import { hc } from "hono/client";
import { AppType } from "@server/app";

import { FormResourceAvailabilityType } from "@server/types/resource-availability-types";
import { FormAppointmentType } from "@server/types/appointment-types";
import { FormPatientType } from "@server/types/patient-types";
import { FormUserType } from "@server/types/user-types";
import { FormResourceType } from "@server/types/resource-types";
import { FormFacilityType } from "@server/types/facility-types";
import { FormAppointmentTypeType } from "@server/types/appointment-type-types";

const client = hc<AppType>("/");

export async function getTotalUsers() {
  const res = await client.api.users.total.$get();

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  const data = await res.json();
  return data.total;
}

export async function createUser(user: FormUserType) {
  const res = await client.api.users.signup.$post({ json: user });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  return res.json();
}

export async function loginUser(user: { username: string; password: string }) {
  const res = await client.api.users.login.$post({ json: user });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  return res.json();
}

export async function getResources() {
  const res = await client.api.resources.$get();

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  return res.json();
}

export async function getResourceById(id: number) {
  const res = await client.api.resources[":id"].$get({
    param: { id: id.toString() },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  return res.json();
}

export async function createResource(resource: FormResourceType) {
  const res = await client.api.resources.$post({ json: resource });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  return res.json();
}

export async function updateResource(resource: FormResourceType) {
  const res = await client.api.resources[":id"].$patch({
    param: { id: resource.id?.toString() || "" },
    json: resource,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  return res.json();
}

export async function deleteResource(id: number) {
  const res = await client.api.resources[":id"].$delete({
    param: { id: id.toString() },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  return res.json();
}

export async function getResourceTypes() {
  const res = await client.api.resourceTypes.$get();

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  return res.json();
}

export async function getAppointments() {
  const res = await client.api.appointments.$get();

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }
  return res.json();
}

export async function getAppointmentById(id: number) {
  const res = await client.api.appointments[":id"].$get({
    param: { id: id.toString() },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  return res.json();
}

export async function createAppointment(appointment: FormAppointmentType) {
  const res = await client.api.appointments.$post({ json: appointment });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  return res.json();
}

export async function updateAppointment(appointment: FormAppointmentType) {
  const res = await client.api.appointments[":id"].$patch({
    param: { id: appointment.id?.toString() || "" },
    json: appointment,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  return res.json();
}

export async function createAppointmentType(
  appointmentType: FormAppointmentTypeType
) {
  const res = await client.api.appointmentTypes.$post({
    json: appointmentType,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  return res.json();
}

export async function updateAppointmentType(
  appointmentType: FormAppointmentTypeType
) {
  const res = await client.api.appointmentTypes[":id"].$patch({
    param: { id: appointmentType.id?.toString() || "" },
    json: appointmentType,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  return res.json();
}

export async function deleteAppointmentType(id: number) {
  const res = await client.api.appointmentTypes[":id"].$delete({
    param: { id: id.toString() },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  return res.json();
}

export async function deleteAppointment(id: number) {
  const res = await client.api.appointments[":id"].$delete({
    param: { id: id.toString() },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  return res.json();
}

export async function getFacilities() {
  const res = await client.api.facilities.$get();

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  return res.json();
}

export async function getFacilityById(id: number) {
  const res = await client.api.facilities[":id"].$get({
    param: { id: id.toString() },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }
  return res.json();
}

export async function createFacility(facility: FormFacilityType) {
  const res = await client.api.facilities.$post({ json: facility });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  return res.json();
}

export async function updateFacility(facility: FormFacilityType) {
  const res = await client.api.facilities[":id"].$patch({
    param: { id: facility.id?.toString() || "" },
    json: facility,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  return res.json();
}

export async function deleteFacility(id: number) {
  const res = await client.api.facilities[":id"].$delete({
    param: { id: id.toString() },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  return res.json();
}

export async function getResourceAvailability() {
  const res = await client.api.resourceAvailability.$get();

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  return res.json();
}

export async function getResourceAvailabilityByResourceIdAndDate(
  resourceId: number,
  date: string
) {
  const res = await client.api.resourceAvailability[":resourceId"][
    ":date"
  ].$get({
    param: { resourceId: resourceId.toString(), date: date },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  return res.json();
}

export async function createResourceAvailability(
  formData: FormResourceAvailabilityType
) {
  const res = await client.api.resourceAvailability.$post({
    json: formData,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  return res.json();
}

export async function updateResourceAvailability(
  formData: FormResourceAvailabilityType
) {
  if (!formData.id) {
    throw new Error("Resource availability ID is required");
  }

  const res = await client.api.resourceAvailability[":id"].$patch({
    param: { id: formData.id },
    json: formData,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  return res.json();
}

export async function deleteResourceAvailability(id: number) {
  const res = await client.api.resourceAvailability[":id"].$delete({
    param: { id: id.toString() },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  return res.json();
}

export async function getPatients() {
  const res = await client.api.patients.$get();

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  return res.json();
}

export async function getPatientByMedicalRecordNumber(mrn: string) {
  const res = await client.api.patients.mrn[":mrn"].$get({
    param: { mrn: mrn },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  return res.json();
}

export async function createPatient(patient: FormPatientType) {
  const res = await client.api.patients.$post({ json: patient });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  return res.json();
}

export async function updatePatient(patient: FormPatientType) {
  const res = await client.api.patients[":id"].$patch({
    param: { id: patient.id?.toString() || "" },
    json: patient,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  return res.json();
}

export async function blockPatient({
  id,
  blocked,
}: {
  id: number;
  blocked: boolean;
}) {
  const res = await client.api.patients[":id"].block.$patch({
    param: { id: id.toString() },
    json: { blocked: blocked },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  return res.json();
}

export async function getAppointmentTypes() {
  const res = await client.api.appointmentTypes.$get();

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  return res.json();
}

export async function getGenders() {
  const res = await client.api.genders.$get();

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  return res.json();
}
