import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import CustomFormField, { FormFieldType } from "./form";
import SubmitButton from "../submit-button";
import { Form } from "../ui/form";
import {
  createResourceAvailability,
  getResources,
  updateResourceAvailability,
} from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { SelectItem } from "@/components/ui/select";
import { SelectGroup } from "@/components/ui/select";
import { WeekDayOptions } from "@/constants";
import { Button } from "../ui/button";
import {
  FormResourceAvailabilityType,
  FormResourceAvailabilitySchema,
} from "@server/types/resource-availability-types";
import { MultiSelect } from "../ui/multi-select";

interface ResourceAvailabilityFormProps {
  defaultValues?: FormResourceAvailabilityType;
  onSuccess: () => void;
}

function ResourceAvailabilityForm({
  defaultValues,
  onSuccess,
}: ResourceAvailabilityFormProps) {
  console.log("Default Values:", defaultValues);
  const queryClient = useQueryClient();

  const { data: resources } = useQuery({
    queryKey: ["resources"],
    queryFn: () => getResources(),
  });

  const { mutate: createMutate, isPending } = useMutation({
    mutationFn: createResourceAvailability,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resourceAvailability"] });
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
      queryClient.invalidateQueries({ queryKey: ["resourceAvailability"] });
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
    defaultValues: defaultValues,
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
              {resources?.map((resource) => (
                <SelectItem
                  key={resource.id}
                  value={resource.id.toString()}
                  defaultChecked={
                    resource.id == Number(defaultValues?.resourceId)
                  }>
                  {resource.name}
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

        {/* <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            label="Week Days"
            placeholder="Week Days"
            description="Week Days"
            control={form.control}
            name="weekDays">
            <SelectGroup>
              <MultiSelect
                options={WeekDayOptions}
                selected={form.getValues("weekDays").split(",") || []}
                onChange={(selected) =>
                  form.setValue("weekDays", selected.join(","))
                }
              />
            </SelectGroup>
          </CustomFormField>
        </div> */}

        <MultiSelect
          options={WeekDayOptions}
          selected={
            form.getValues("weekDays")
              ? form.getValues("weekDays").split(",")
              : []
          }
          onChange={(selected) => form.setValue("weekDays", selected.join(","))}
          placeholder="Select Week Days"
        />

        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          label="Is Recurring"
          placeholder="Is Recurring"
          description="Is Recurring"
          control={form.control}
          name="isRecurring"
        />

        <SubmitButton isLoading={isPending || isUpdating}>
          {defaultValues?.id ? "Update" : "Add"}
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

export default ResourceAvailabilityForm;
