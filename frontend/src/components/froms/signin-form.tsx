import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import CustomFormField, { FormFieldType } from "./form";

import SubmitButton from "../submit-button";

import { Form } from "../ui/form";
import { loginUser } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import z from "node_modules/zod/lib";

const FormLoginUserSchema = z.object({
  username: z.string(),
  password: z.string(),
});

function SingupForm() {
  const navigate = useNavigate();
  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: loginUser,
    onError: (error: Error) => {
      console.log({ error });
      toast({
        title: error.message,
        variant: "destructive",
      });
    },
  });

  const form = useForm<z.infer<typeof FormLoginUserSchema>>({
    resolver: zodResolver(FormLoginUserSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof FormLoginUserSchema>) {
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

        <div className="flex justify-evenly items-center gap-4">
          <SubmitButton isLoading={isPending}>Login</SubmitButton>
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
