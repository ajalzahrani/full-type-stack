import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import CustomFormField, { FormFieldType } from "./form";

import SubmitButton from "../submit-button";

import { Form } from "../ui/form";
import {
  FormFacilitySchema,
  FormFacilityType,
} from "@server/types/facility-types";
import { createFacility, updateFacility } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface FacilityFormProps {
  defaultValues?: FormFacilityType;
  onSuccess: () => void;
}

function FacilityForm({ defaultValues, onSuccess }: FacilityFormProps) {
  const queryClient = useQueryClient();

  const { mutate: createMutate, isPending } = useMutation({
    mutationFn: createFacility,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["facilities"] });

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
    mutationFn: updateFacility,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["facilities"] });
      toast({ title: "Facility updated" });
      onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: error.message,
        variant: "destructive",
      });
    },
  });

  const form = useForm<FormFacilityType>({
    resolver: zodResolver(FormFacilitySchema),
    defaultValues,
  });

  const onSubmit = (values: FormFacilityType) => {
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
          description="Facility Description"
          control={form.control}
          name="description"
        />

        <SubmitButton isLoading={isPending || isUpdating}>
          {defaultValues?.id ? "Update" : "Add"}
        </SubmitButton>
      </form>
    </Form>
  );
}

export default FacilityForm;
