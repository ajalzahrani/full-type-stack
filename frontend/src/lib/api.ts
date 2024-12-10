import { hc } from "hono/client";
import { type AppType } from "@server/app";
import {
  insertUserSchema,
  requestUserByUsernameAndPasswordSchema,
  insertResourceSchema,
} from "@server/types";
import { z } from "zod";

const client = hc<AppType>("/");

export const api = client.api;

export async function getTotalUsers() {
  const res = await api.users.total.$get();

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  const data = await res.json();
  return data.total;
}

export async function createUser(user: z.infer<typeof insertUserSchema>) {
  const res = await api.users.signup.$post({ json: user });

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return res.json();
}

export async function loginUser(
  user: z.infer<typeof requestUserByUsernameAndPasswordSchema>
) {
  const res = await api.users.login.$post({ json: user });

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return res.json();
}

export async function createResource(
  resource: z.infer<typeof insertResourceSchema>
) {
  const res = await api.users.create.$post({ json: resource });
}
