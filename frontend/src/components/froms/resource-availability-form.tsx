import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import CustomFormField, { FormFieldType } from "./form";
import SubmitButton from "../submit-button";
import { Form } from "../ui/form";
import {
  createResourceAvailability,
  getFacilities,
  getResources,
  updateResourceAvailability,
} from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { SelectItem } from "@/components/ui/select";
import { SelectGroup } from "@/components/ui/select";
import { WeekDayOptions } from "@/constants";
import { FormResourceAvailabilityType } from "@server/types/resource-availability-types";
import { MultiSelect } from "@/components/ui/multi-select";
import { Button } from "../ui/button";

interface ResourceAvailabilityFormProps {
  defaultValues?: FormResourceAvailabilityType;
  onSuccess: () => void;
}

const FormResourceAvailabilitySchema = z.object({
  id: z.string().regex(/^\d+$/, "ID must be a numeric string").optional(),
  resourceId: z.string().regex(/^\d+$/, "Resource ID must be a numeric string"),
  startTime: z.string(),
  endTime: z.string(),
  startDate: z.string(),
  endDate: z.string().nullable(),
  facilityId: z.string().regex(/^\d+$/, "Facility ID must be a numeric string"),
  consultationDuration: z
    .string()
    .regex(/^\d+$/, "Consultation Duration must be a numeric string"),
  followupDuration: z
    .string()
    .regex(/^\d+$/, "Followup Duration must be a numeric string"),
  weekDays: z.string(),
  isRecurring: z.boolean().optional(),
});

function ResourceAvailabilityForm({
  defaultValues,
  onSuccess,
}: ResourceAvailabilityFormProps) {
  const queryClient = useQueryClient();

  const { data: resources } = useQuery({
    queryKey: ["resources"],
    queryFn: () => getResources(),
  });

  const { data: facilities } = useQuery({
    queryKey: ["facilities"],
    queryFn: getFacilities,
  });

  const { mutate: createMutate, isPending } = useMutation({
    mutationFn: createResourceAvailability,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resource-availabilities"] });
      toast({
        title: "Resource availability created successfully",
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
    mutationFn: updateResourceAvailability,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resource-availabilities"] });
      toast({ title: "Resource availability updated" });
      onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: error.message,
        variant: "destructive",
      });
    },
  });

  const form = useForm<FormResourceAvailabilityType>({
    resolver: zodResolver(FormResourceAvailabilitySchema),
    defaultValues: {
      ...defaultValues,
      weekDays: defaultValues?.weekDays || "",
    },
  });

  const onSubmit = (values: FormResourceAvailabilityType) => {
    console.log("Values:", values);
    if (defaultValues?.id) {
      updateMutate(values);
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
            name="resourceId"
            label="Resource Type"
            placeholder="Resource Type"
            description="Resource Type">
            <SelectGroup>
              {resources?.resources.map((resource) => (
                <SelectItem
                  key={resource.Resources.id}
                  value={resource.Resources.id.toString()}
                  defaultChecked={
                    resource.Resources.id == Number(defaultValues?.resourceId)
                  }>
                  {resource.Resources.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </CustomFormField>

          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="facilityId"
            label="Facility"
            placeholder="Select a facility"
            description="Select the facility for the appointment">
            <SelectGroup>
              {facilities?.facilities.map((facility) => (
                <SelectItem
                  key={facility.id}
                  value={facility.id.toString()}
                  defaultChecked={
                    facility.id == Number(defaultValues?.facilityId)
                  }>
                  {facility.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </CustomFormField>
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.TIME_PICKER}
            label="Start Time"
            placeholder="Start Time"
            description="Start Time"
            control={form.control}
            name="startTime"
          />

          <CustomFormField
            fieldType={FormFieldType.TIME_PICKER}
            label="End Time"
            placeholder="End Time"
            description="End Time"
            control={form.control}
            name="endTime"
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.DATE_PICKER}
            label="Start Date"
            placeholder="Start Date"
            description="Start Date"
            control={form.control}
            name="startDate"
          />

          <CustomFormField
            fieldType={FormFieldType.DATE_PICKER}
            label="End Date"
            placeholder="End Date"
            description="End Date"
            control={form.control}
            name="endDate"
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.MULTI_SELECT}
            options={WeekDayOptions}
            control={form.control}
            onMultiSelectChange={(selected) => {
              console.log("Selected Week Days:", selected);
              const weekDaysString = selected.join(",");
              form.setValue("weekDays", weekDaysString, {
                shouldValidate: true,
              });
            }}
            name="weekDays"
            label="Week Days"
            placeholder="Select Week Days"
            selected={
              form.getValues("weekDays")
                ? form.getValues("weekDays").split(",").filter(Boolean)
                : defaultValues?.weekDays
                ? defaultValues.weekDays.split(",")
                : []
            }
          />

          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            label="Is Recurring"
            placeholder="Is Recurring"
            description="Is Recurring"
            control={form.control}
            name="isRecurring"
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.NUMBER}
            label="Consultation Duration"
            placeholder="Consultation Duration"
            description="Consultation Duration"
            control={form.control}
            name="consultationDuration"
            step={5}
          />

          <CustomFormField
            fieldType={FormFieldType.NUMBER}
            label="Followup Duration"
            placeholder="Followup Duration"
            description="Followup Duration"
            control={form.control}
            name="followupDuration"
            step={5}
          />
        </div>

        <SubmitButton isLoading={isPending || isUpdating}>
          {defaultValues?.id ? "Update" : "Add"}
        </SubmitButton>

        <Button
          type="button"
          variant="outline"
          onClick={() => console.log(form.getValues("weekDays"))}>
          Console week days
        </Button>
      </form>
    </Form>
  );
}

export default ResourceAvailabilityForm;
