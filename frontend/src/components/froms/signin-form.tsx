import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import CustomFormField, { FormFieldType } from "./form";

import SubmitButton from "../submit-button";

import { Form } from "../ui/form";
import {
  FormUserSchema,
  FormUserType,
  requestUserByUsernameAndPasswordSchema,
} from "@server/types/user-types";
import { loginUser } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

function SingupForm() {
  const navigate = useNavigate();
  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: loginUser,
  });

  const form = useForm<FormUserType>({
    resolver: zodResolver(
      FormUserSchema.pick({ username: true, password: true })
    ),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(
    values: z.infer<typeof requestUserByUsernameAndPasswordSchema>
  ) {
    mutate(values);

    if (isSuccess) {
      navigate("/dashboard");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          label="Username"
          placeholder="Username"
          control={form.control}
          name="username"
        />

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          label="Password"
          placeholder="Password"
          control={form.control}
          name="password"
        />

        <SubmitButton isLoading={isPending}>Login</SubmitButton>
      </form>
    </Form>
  );
}

export default SingupForm;
