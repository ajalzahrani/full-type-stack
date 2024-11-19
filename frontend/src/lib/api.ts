import { hc } from "hono/client";
import { type ApiRoutes } from "@server/app";
import {
  insertUserSchema,
  requestUserByUsernameAndPasswordSchema,
} from "@server/types";
import { z } from "zod";

const client = hc<ApiRoutes>("/");

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
  const res = await api.users.$post({ json: user });

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
