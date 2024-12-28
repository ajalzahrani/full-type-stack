import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import CustomFormField, { FormFieldType } from "./form";

import SubmitButton from "../submit-button";

import { Form } from "../ui/form";
import { createUser } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const FormUserSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID must be a numeric string").optional(),
  name: z.string().min(3, "Name must be at least 3 characters"),
  age: z.string().regex(/^\d+$/, "Age must be a numeric string"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(2, "Password must be at least 2 characters"),
});

function SingupForm() {
  const navigate = useNavigate();
  const { mutate, isPending } = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      toast({
        title: "User created successfully",
        variant: "default",
      });
      navigate("/signin");
    },
    onError: (error: Error) => {
      toast({
        title: error.message,
        variant: "destructive",
      });
    },
  });

  const form = useForm<z.infer<typeof FormUserSchema>>({
    resolver: zodResolver(FormUserSchema),
    defaultValues: {
      username: "",
      password: "",
      name: "",
      age: "",
    },
  });

  async function onSubmit(values: z.infer<typeof FormUserSchema>) {
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

        <div className="flex justify-evenly items-center gap-4">
          <SubmitButton isLoading={isPending}>Signup</SubmitButton>
          <button
            type="button"
            className="bg-blue-500 text-white px-4 py-2 rounded-md">
            <Link to="/">Cancel</Link>
          </button>
        </div>
      </form>
    </Form>
  );
}

export default SingupForm;
