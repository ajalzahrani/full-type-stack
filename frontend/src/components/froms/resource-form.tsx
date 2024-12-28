import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import CustomFormField, { FormFieldType } from "./form";

import SubmitButton from "../submit-button";

import { Form } from "../ui/form";

import { createResource, getResourceTypes, updateResource } from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { SelectItem } from "@/components/ui/select";
import { SelectGroup } from "@/components/ui/select";
import { FormResourceType } from "@server/types/resource-types";
import { Button } from "../ui/button";

interface ResourceFormProps {
  defaultValues?: FormResourceType;
  onSuccess: () => void;
}

const FormResourceSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID must be a numeric string").optional(),
  name: z.string(),
  resourceTypeId: z.string(),
  description: z.string().optional(),
});

function ResourceForm({ defaultValues, onSuccess }: ResourceFormProps) {
  const queryClient = useQueryClient();

  const { data: resourceTypes } = useQuery({
    queryKey: ["resourceTypes"],
    queryFn: getResourceTypes,
  });

  const { mutate: createMutate, isPending } = useMutation({
    mutationFn: createResource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });

      toast({
        title: "Resource created successfully",
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
    mutationFn: updateResource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      toast({ title: "Resource updated" });
      onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: error.message,
        variant: "destructive",
      });
    },
  });

  const form = useForm<FormResourceType>({
    resolver: zodResolver(FormResourceSchema),
    defaultValues,
  });

  const onSubmit = (values: FormResourceType) => {
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
          fieldType={FormFieldType.INPUT}
          label="Desc"
          placeholder="Description"
          description="Resource Description"
          control={form.control}
          name="description"
        />

        <section className="space-y-6">
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="resourceTypeId"
            label="Resource Type"
            placeholder="Resource Type"
            description="Resource Type">
            <SelectGroup>
              {resourceTypes?.resourceTypes.map((resourceType) => (
                <SelectItem
                  key={resourceType.id}
                  value={resourceType.id.toString()}>
                  {resourceType.name.toUpperCase()}
                </SelectItem>
              ))}
            </SelectGroup>
          </CustomFormField>
        </section>

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

export default ResourceForm;
