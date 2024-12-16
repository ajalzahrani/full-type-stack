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
import { formatTimeForInput } from "@/lib/datetime-format";
import { TimeSlotPicker } from "../time-slot-picker";
import {
  createAppointment,
  updateAppointment,
  getResources,
  getFacilities,
  getAppointmentTypes,
  getResourceAvailabilityByResourceIdAndDate,
} from "@/lib/api";
import {
  FormAppointmentType,
  FormAppointmentSchema,
} from "@server/types/appointment-types";

interface AppointmentFormProps {
  defaultValues?: FormAppointmentType;
  onSuccess: () => void;
}

function AppointmentForm({ defaultValues, onSuccess }: AppointmentFormProps) {
  const queryClient = useQueryClient();
  // const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = React.useState<{
    startTime: string;
    endTime: string;
  } | null>(null);

  const { data: resources } = useQuery({
    queryKey: ["resources"],
    queryFn: getResources,
  });

  const { data: facilities } = useQuery({
    queryKey: ["facilities"],
    queryFn: getFacilities,
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
          name="facilityId"
          label="Facility"
          placeholder="Select a facility"
          description="Select the facility for the appointment">
          <SelectGroup>
            {facilities?.map((facility) => (
              <SelectItem key={facility.id} value={facility.id.toString()}>
                {facility.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </CustomFormField>

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

        <CustomFormField
          fieldType={FormFieldType.DATE_PICKER}
          label="Appointment Date"
          placeholder="Select appointment date"
          description="Choose the date for the appointment"
          control={form.control}
          name="appointmentDate"
          // onChange={(date: Date) => setSelectedDate(date)}
        />

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

        {form.watch("appointmentDate") &&
          form.watch("resourceId") &&
          availableSlots && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Available Time Slots</h3>
              <TimeSlotPicker
                availableSlots={availableSlots.map((slot) => ({
                  startTime: formatTimeForInput(slot.startTime),
                  endTime: formatTimeForInput(slot.endTime),
                }))}
                selectedSlot={selectedTimeSlot}
                onSelectSlot={(slot) => {
                  setSelectedTimeSlot(slot);
                  form.setValue("startTime", slot.startTime);
                  form.setValue("endTime", slot.endTime);
                }}
              />
            </div>
          )}

        <CustomFormField
          fieldType={FormFieldType.TEXTAREA}
          label="Notes"
          placeholder="Enter any additional notes"
          control={form.control}
          name="notes"
        />

        <SubmitButton isLoading={isCreating || isUpdating}>
          {defaultValues?.id ? "Update Appointment" : "Create Appointment"}
        </SubmitButton>
      </form>
    </Form>
  );
}

export default AppointmentForm;
