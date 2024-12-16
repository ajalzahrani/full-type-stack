import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import CustomFormField, { FormFieldType } from "./form";
import SubmitButton from "../submit-button";
import { Form } from "../ui/form";
import { insertResourceConfigurationSchema } from "@server/types";
import {
  createResourceConfiguration,
  getFacilities,
  getResources,
  updateResourceConfiguration,
} from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { SelectItem } from "@/components/ui/select";
import { SelectGroup } from "@/components/ui/select";
import { ResourceConfigurationStatus, WeekDays } from "@/constants";
import { Button } from "../ui/button";
import {
  ResourceConfigurationFormValues,
  convertFormValuesToAPI,
} from "@/types/forms/resource-config-type";

interface ResourceConfigurationFormProps {
  defaultValues?: z.infer<typeof insertResourceConfigurationSchema>;
  onSuccess: () => void;
}

function ResourceConfigurationForm({
  defaultValues,
  onSuccess,
}: ResourceConfigurationFormProps) {
  console.log("Default Values:", defaultValues);
  const queryClient = useQueryClient();

  const { data: resources } = useQuery({
    queryKey: ["resources"],
    queryFn: () => getResources(),
  });

  const { data: facilities } = useQuery({
    queryKey: ["facilities"],
    queryFn: () => getFacilities(),
  });

  const { mutate: createMutate, isPending } = useMutation({
    mutationFn: createResourceConfiguration,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resourceConfigurations"] });
      toast({
        title: "Resource configuration created successfully",
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
    mutationFn: updateResourceConfiguration,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resourceConfigurations"] });
      toast({ title: "Resource configuration updated" });
      onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: error.message,
        variant: "destructive",
      });
    },
  });

  const form = useForm<ResourceConfigurationFormValues>({
    resolver: zodResolver(insertResourceConfigurationSchema),
    defaultValues: defaultValues
      ? {
          ...defaultValues,
          resourceId: defaultValues.resourceId.toString(),
          facilityId: defaultValues.facilityId.toString(),
          statusId: defaultValues.statusId.toString(),
          estimatedWaitingTime: defaultValues.estimatedWaitingTime.toString(),
          startDate: defaultValues.startDate
            ? new Date(defaultValues.startDate).toISOString().split("T")[0]
            : null,
          endDate: defaultValues.endDate
            ? new Date(defaultValues.endDate).toISOString().split("T")[0]
            : null,
        }
      : undefined,
  });

  const onSubmit = (values: ResourceConfigurationFormValues) => {
    const processedValues = convertFormValuesToAPI(values);

    if (defaultValues?.id) {
      updateMutate({ ...processedValues, id: defaultValues.id });
    } else {
      createMutate(processedValues);
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

          <CustomFormField
            fieldType={FormFieldType.SELECT}
            label="Facility"
            placeholder="Facility"
            description="Facility"
            control={form.control}
            name="facilityId">
            <SelectGroup>
              {facilities?.map((facility) => (
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

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          label="Estimated Waiting Time"
          placeholder="Estimated Waiting Time"
          control={form.control}
          name="estimatedWaitingTime"
        />

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
            fieldType={FormFieldType.SELECT}
            label="Week Days"
            placeholder="Week Days"
            description="Week Days"
            control={form.control}
            name="weekDays">
            <SelectGroup>
              {WeekDays.map((weekDay) => (
                <SelectItem key={weekDay.id} value={weekDay.name}>
                  {weekDay.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </CustomFormField>

          <CustomFormField
            fieldType={FormFieldType.SELECT}
            label="Status"
            placeholder="Status"
            description="Status"
            control={form.control}
            name="statusId">
            <SelectGroup>
              {ResourceConfigurationStatus.map((status) => (
                <SelectItem
                  key={status.id}
                  value={status.id.toString()}
                  defaultChecked={status.id == Number(defaultValues?.statusId)}>
                  {status.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </CustomFormField>
        </div>

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

export default ResourceConfigurationForm;
