import React from "react";
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
import {
  FormAppointmentType,
  FormAppointmentSchema,
} from "@server/types/appointment-types";
import { Button } from "../ui/button";

interface AppointmentFormProps {
  defaultValues?: FormAppointmentType;
  onSuccess: () => void;
}

function AppointmentForm({ defaultValues, onSuccess }: AppointmentFormProps) {
  const queryClient = useQueryClient();
  const [selectedTimeSlot, setSelectedTimeSlot] = React.useState<{
    startTime: string;
    endTime: string;
  } | null>(null);

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
            {resources?.map((resource) => (
              <SelectItem key={resource.id} value={resource.id.toString()}>
                {resource.name}
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
            name="patientId"
          />

          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="typeId"
            label="Appointment Type"
            placeholder="Select appointment type"
            description="Select the type of appointment">
            <SelectGroup>
              {appointmentTypes?.map((type) => (
                <SelectItem key={type.id} value={type.id.toString()}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </CustomFormField>
        </div>

        {/* <CustomFormField
          fieldType={FormFieldType.DATE_PICKER}
          label="Appointment Date"
          placeholder="Select appointment date"
          description="Choose the date for the appointment"
          control={form.control}
          name="appointmentDate"
        /> */}

        {/* <TimeSlotPicker
          availableSlots={Array.from({ length: 5 }, (_, i) => ({
            startTime: `${i}:00`,
            endTime: `${i + 1}:00`,
          }))}
          selectedSlot={selectedTimeSlot}
          onSelectSlot={(slot) => {
            setSelectedTimeSlot(slot);
            form.setValue("startTime", slot.startTime);
            form.setValue("endTime", slot.endTime);
          }}
        /> */}

        {/* {form.watch("appointmentDate") &&
          form.watch("resourceId") &&
          availableSlots && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Available Time Slots</h3>
              <TimeSlotPicker
                availableSlots={availableSlots.map((slot) => ({
                  startTime: slot.startTime,
                  endTime: slot.endTime,
                }))}
                selectedSlot={selectedTimeSlot}
                onSelectSlot={(slot) => {
                  setSelectedTimeSlot(slot);
                  form.setValue("startTime", slot.startTime);
                  form.setValue("endTime", slot.endTime);
                }}
              />
            </div>
          )} */}

        <CustomFormField
          fieldType={FormFieldType.DATE_PICKER_CUSTOM}
          label="Appointment Date & Time"
          placeholder="Select appointment date and time"
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
                {availableSlots.map((slot) => (
                  <Button
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
