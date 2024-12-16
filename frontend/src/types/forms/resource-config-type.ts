import { z } from "zod";
import { insertResourceConfigurationSchema } from "@server/types";

// Base form field types for string/number conversions
export type FormFieldValue = string | number;
export type FormDateValue = string | null;

// Resource Configuration Form Values
export type ResourceConfigurationFormValues = Omit<
  z.infer<typeof insertResourceConfigurationSchema>,
  | "resourceId"
  | "facilityId"
  | "statusId"
  | "estimatedWaitingTime"
  | "startDate"
  | "endDate"
> & {
  resourceId: FormFieldValue;
  facilityId: FormFieldValue;
  statusId: FormFieldValue;
  estimatedWaitingTime: FormFieldValue;
  startDate: FormDateValue;
  endDate: FormDateValue;
};

// Helper functions for form value conversion
export const convertFormValuesToAPI = (
  values: ResourceConfigurationFormValues
) => ({
  ...values,
  resourceId: Number(values.resourceId),
  facilityId: Number(values.facilityId),
  statusId: Number(values.statusId),
  estimatedWaitingTime: Number(values.estimatedWaitingTime),
  startDate: values.startDate ? new Date(values.startDate) : null,
  endDate: values.endDate ? new Date(values.endDate) : null,
});
