import { z } from "zod";
import { insertResourceAvailabilitySchema } from "@server/types";

// Base form field types for string/number conversions
export type FormFieldValue = string | number;
export type FormDateValue = string | null;

// Resource Configuration Form Values
export type ResourceAvailabilityFormValues = Omit<
  z.infer<typeof insertResourceAvailabilitySchema>,
  "resourceId" | "startDate" | "endDate"
> & {
  resourceId: FormFieldValue;
  startDate: string;
  endDate: FormDateValue;
};

// Helper functions for form value conversion
export const convertFormValuesToAPI = (
  values: ResourceAvailabilityFormValues
) => ({
  ...values,
  resourceId: Number(values.resourceId),
  startDate: new Date(values.startDate),
  endDate: values.endDate ? new Date(values.endDate) : null,
});
