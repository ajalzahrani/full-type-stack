import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import CustomFormField, { FormFieldType } from "./form";

import SubmitButton from "../submit-button";

import { Form } from "../ui/form";
import { insertUserSchema } from "@server/types";
import { createUser } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

function SingupForm() {
  const { mutate, isPending } = useMutation({
    mutationFn: createUser,
  });

  const form = useForm<z.infer<typeof insertUserSchema>>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: "",
      password: "",
      name: "",
      age: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof insertUserSchema>) {
    mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          label="Name"
          placeholder="Name"
          control={form.control}
          name="name"
        />

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          label="Username"
          placeholder="Username"
          description="This is your public display name."
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

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          label="Age"
          placeholder="Age"
          control={form.control}
          name="age"
        />

        <SubmitButton isLoading={isPending}>Signup</SubmitButton>
      </form>
    </Form>
  );
}

export default SingupForm;
