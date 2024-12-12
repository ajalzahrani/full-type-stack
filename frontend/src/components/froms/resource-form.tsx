import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import CustomFormField, { FormFieldType } from "./form";

import SubmitButton from "../submit-button";

import { Form } from "../ui/form";
import { insertResourceSchema } from "@server/types";
import { createResource, updateResource } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface ResourceFormProps {
  defaultValues?: z.infer<typeof insertResourceSchema>;
  onSuccess: () => void;
}

function ResourceForm({ defaultValues, onSuccess }: ResourceFormProps) {
  const queryClient = useQueryClient();

  const { mutate: createMutate, isPending } = useMutation({
    mutationFn: createResource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });

      toast({
        title: "Resource created successfully",
        variant: "default",
      });
      form.reset();
      onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: error.message,
        variant: "destructive",
      });
    },
  });

  const { mutate: updateMutate, isPending: isUpdating } = useMutation({
    mutationFn: updateResource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      toast({ title: "Resource updated" });
      onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: error.message,
        variant: "destructive",
      });
    },
  });

  const form = useForm<z.infer<typeof insertResourceSchema>>({
    resolver: zodResolver(insertResourceSchema),
    defaultValues,
  });

  const onSubmit = (values: z.infer<typeof insertResourceSchema>) => {
    if (defaultValues?.id) {
      updateMutate({ ...values, id: defaultValues.id });
    } else {
      createMutate(values);
    }
  };

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
          label="Desc"
          placeholder="Description"
          description="Resource Description"
          control={form.control}
          name="description"
        />

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          label="Resource Type"
          placeholder="Resource Type"
          description="Resource Type"
          control={form.control}
          name="resourceType"
        />

        <SubmitButton isLoading={isPending || isUpdating}>
          {defaultValues?.id ? "Update" : "Add"}
        </SubmitButton>
      </form>
    </Form>
  );
}

export default ResourceForm;
