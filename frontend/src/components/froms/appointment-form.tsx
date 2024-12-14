import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import CustomFormField, { FormFieldType } from "./form";

import SubmitButton from "../submit-button";

import { Form } from "../ui/form";
import { insertAppointmentSchema } from "@server/types";
import {
  createAppointment,
  getResourceConfiguration,
  updateAppointment,
} from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { SelectItem } from "@/components/ui/select";
import { SelectGroup } from "@/components/ui/select";
import { AppointmentTypes } from "@/constants";

interface AppointmentFormProps {
  defaultValues?: z.infer<typeof insertAppointmentSchema>;
  onSuccess: () => void;
}

function AppointmentForm({ defaultValues, onSuccess }: AppointmentFormProps) {
  const queryClient = useQueryClient();

  const { data: resourceConfigurations } = useQuery({
    queryKey: ["resource-configurations"],
    queryFn: () => getResourceConfiguration(),
  });

  const { mutate: createMutate, isPending } = useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });

      toast({
        title: "Appointment created successfully",
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
    mutationFn: updateAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast({ title: "Appointment updated" });
      onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: error.message,
        variant: "destructive",
      });
    },
  });

  const form = useForm<z.infer<typeof insertAppointmentSchema>>({
    resolver: zodResolver(insertAppointmentSchema),
    defaultValues,
  });

  const onSubmit = (values: z.infer<typeof insertAppointmentSchema>) => {
    if (defaultValues?.id) {
      updateMutate({ ...values, id: defaultValues.id });
    } else {
      createMutate(values);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="resourceConfigId"
            label="Resource"
            placeholder="Resource"
            description="Resource can be a doctor, nurse, etc.">
            <SelectGroup>
              {resourceConfigurations?.map((resourceConfig) => (
                <SelectItem
                  key={resourceConfig.ResourceConfigurations.id}
                  value={resourceConfig.ResourceConfigurations.id.toString()}>
                  {resourceConfig.Resources.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </CustomFormField>
        </div>

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          label="Patient MRN"
          placeholder="Patient MRN"
          control={form.control}
          name="patientId"
        />

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.TIME_PICKER}
            label="Appointment Time"
            placeholder="Appointment Time"
            description="Appointment Time"
            control={form.control}
            name="appointmentTime"
          />

          <CustomFormField
            fieldType={FormFieldType.DATE_PICKER}
            label="Appointment Date"
            placeholder="Appointment Date"
            description="Appointment Date"
            control={form.control}
            name="appointmentDate"
          />
        </div>

        <CustomFormField
          fieldType={FormFieldType.SELECT}
          label="Appointment Type"
          placeholder="Appointment Type"
          description="Appointment Type"
          control={form.control}
          name="typeId">
          <SelectGroup>
            {AppointmentTypes.map((type) => (
              <SelectItem key={type.id} value={type.id.toString()}>
                {type.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </CustomFormField>

        <SubmitButton isLoading={isPending || isUpdating}>
          {defaultValues?.id ? "Update" : "Add"}
        </SubmitButton>
      </form>
    </Form>
  );
}

export default AppointmentForm;
