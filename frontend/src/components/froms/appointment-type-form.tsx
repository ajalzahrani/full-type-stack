import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import CustomFormField, { FormFieldType } from "./form";
import SubmitButton from "../submit-button";
import { Form } from "../ui/form";

import { createAppointmentType, updateAppointmentType } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { FormAppointmentTypeType } from "@server/types/appointment-type-types";
import { Button } from "../ui/button";

interface AppointmentTypeFormProps {
  defaultValues?: FormAppointmentTypeType;
  onSuccess: () => void;
}

const FormAppointmentTypeSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID must be a numeric string").optional(),
  name: z.string(),
  duration: z
    .string()
    .regex(/^\d+$/, "Duration must be a numeric string")
    .default("5"),
});

function AppointmentTypeForm({
  defaultValues,
  onSuccess,
}: AppointmentTypeFormProps) {
  const queryClient = useQueryClient();

  const { mutate: createMutate, isPending } = useMutation({
    mutationFn: createAppointmentType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointmentTypes"] });

      toast({
        title: "Appointment Type created successfully",
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
    mutationFn: updateAppointmentType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointmentTypes"] });
      toast({ title: "Appointment Type updated" });
      onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: error.message,
        variant: "destructive",
      });
    },
  });

  const form = useForm<FormAppointmentTypeType>({
    resolver: zodResolver(FormAppointmentTypeSchema),
    defaultValues,
  });

  const onSubmit = (values: FormAppointmentTypeType) => {
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
          fieldType={FormFieldType.NUMBER}
          label="Duration"
          placeholder="Duration"
          description="Duration"
          control={form.control}
          name="duration"
          step={5}
        />

        <SubmitButton isLoading={isPending || isUpdating}>
          {defaultValues?.id ? "Update" : "Add"}
        </SubmitButton>

        <Button
          variant="destructive"
          onClick={() => console.log(form.getValues())}>
          Reset
        </Button>
      </form>
    </Form>
  );
}

export default AppointmentTypeForm;
