import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { Form } from "@/components/ui/form";
import { SelectItem, SelectGroup } from "@/components/ui/select";
import CustomFormField, { FormFieldType } from "./form";
import SubmitButton from "../submit-button";
import "react-datepicker/dist/react-datepicker.css";
import { format, parse } from "date-fns";
import {
  createAppointment,
  updateAppointment,
  getResources,
  getAppointmentTypes,
  getResourceAvailabilityByResourceIdAndDate,
} from "@/lib/api";
import { FormAppointmentType } from "@server/types/appointment-types";
import { Button } from "../ui/button";

interface AppointmentFormProps {
  defaultValues?: FormAppointmentType;
  onSuccess: () => void;
}

const FormAppointmentSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID must be a numeric string").optional(),
  resourceId: z.string().regex(/^\d+$/, "Resource ID must be a numeric string"),
  patientMrn: z.string().regex(/^\d+$/, "Patient ID must be a numeric string"),
  typeId: z.string().regex(/^\d+$/, "Type ID must be a numeric string"),
  appointmentDate: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  status: z.string().default("scheduled"),
  notes: z.string().optional(),
});

function AppointmentForm({ defaultValues, onSuccess }: AppointmentFormProps) {
  const queryClient = useQueryClient();
  const [selectedTimeSlot, setSelectedTimeSlot] = React.useState<{
    startTime: string;
    endTime: string;
  } | null>(
    defaultValues?.startTime && defaultValues?.endTime
      ? {
          startTime: defaultValues.startTime,
          endTime: defaultValues.endTime,
        }
      : null
  );

  const { data: resources } = useQuery({
    queryKey: ["resources"],
    queryFn: getResources,
  });

  const { data: appointmentTypes } = useQuery({
    queryKey: ["appointmentTypes"],
    queryFn: getAppointmentTypes,
  });

  const form = useForm<FormAppointmentType>({
    resolver: zodResolver(FormAppointmentSchema),
    defaultValues,
  });

  const { data: availableSlots, refetch: refetchAvailableSlots } = useQuery({
    queryKey: [
      "resourceAvailability",
      form.watch("appointmentDate"),
      form.watch("resourceId"),
    ],
    queryFn: () =>
      getResourceAvailabilityByResourceIdAndDate(
        Number(form.watch("resourceId")),
        form.watch("appointmentDate")
      ),
    enabled: !!form.watch("appointmentDate") && !!form.watch("resourceId"),
  });

  const { mutate: createMutate, isPending: isCreating } = useMutation({
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

  const onSubmit = (values: FormAppointmentType) => {
    console.log({ onsubmit: values });
    if (values.id) {
      updateMutate(values);
    } else {
      createMutate(values);
    }
  };

  React.useEffect(() => {
    console.log({
      selectedDate: form.watch("appointmentDate"),
      resourceId: form.watch("resourceId"),
    });
    if (form.watch("appointmentDate") && form.watch("resourceId")) {
      refetchAvailableSlots();
    }
  }, [
    form.watch("appointmentDate"),
    form.watch("resourceId"),
    refetchAvailableSlots,
  ]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="resourceId"
          label="Resource"
          placeholder="Select a resource"
          description="Select a doctor, nurse, or room">
          <SelectGroup>
            {resources?.resources.map((resource) => (
              <SelectItem
                key={resource.Resources.id}
                value={resource.Resources.id.toString()}>
                {resource.Resources.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </CustomFormField>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            label="Patient MRN"
            placeholder="Enter patient's Medical Record Number"
            control={form.control}
            name="patientMrn"
          />

          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="typeId"
            label="Appointment Type"
            placeholder="Select appointment type"
            description="Select the type of appointment">
            <SelectGroup>
              {appointmentTypes?.appointmentTypes.map((type) => (
                <SelectItem key={type.id} value={type.id.toString()}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </CustomFormField>
        </div>

        <CustomFormField
          fieldType={FormFieldType.DATE_PICKER_CUSTOM}
          label="Appointment Date & Time"
          placeholder="Appointment date"
          description="Choose the date and time for the appointment"
          control={form.control}
          name="appointmentDate"
          showTimeSelect={false} // We'll handle time selection separately
        />

        {form.watch("appointmentDate") &&
          form.watch("resourceId") &&
          availableSlots && (
            <div className="mt-4 space-y-4">
              <h3 className="text-lg font-semibold">Available Time Slots</h3>
              <div className="grid grid-cols-4 gap-2">
                {availableSlots.timeSlots.map((slot) => (
                  <Button
                    type="button"
                    key={`${slot.startTime}-${slot.endTime}`}
                    variant={
                      selectedTimeSlot?.startTime === slot.startTime
                        ? "default"
                        : "outline"
                    }
                    onClick={() => {
                      setSelectedTimeSlot(slot);
                      form.setValue("startTime", slot.startTime);
                      form.setValue("endTime", slot.endTime);
                    }}
                    className="w-full">
                    {format(
                      parse(slot.startTime, "HH:mm", new Date()),
                      "h:mm a"
                    )}
                  </Button>
                ))}
              </div>
            </div>
          )}

        {/* <CustomFormField
          fieldType={FormFieldType.TEXTAREA}
          label="Notes"
          placeholder="Enter any additional notes"
          control={form.control}
          name="notes"
        /> */}

        <SubmitButton isLoading={isCreating || isUpdating}>
          {defaultValues?.id ? "Update Appointment" : "Create Appointment"}
        </SubmitButton>

        <Button
          type="button"
          variant="outline"
          onClick={() => console.log(form.getValues())}>
          Console
        </Button>
      </form>
    </Form>
  );
}

export default AppointmentForm;
