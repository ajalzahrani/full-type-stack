import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { Form } from "@/components/ui/form";
import { SelectItem, SelectGroup } from "@/components/ui/select";
import CustomFormField, { FormFieldType } from "@/components/froms/form";
import SubmitButton from "@/components/submit-button";
import "react-datepicker/dist/react-datepicker.css";
import { createPatient, getGenders, updatePatient } from "@/lib/api";
import {
  FormPatientType,
  FormPatientSchema,
} from "@server/types/patient-types";
import { Button } from "@/components/ui/button";

interface PatientRegistrationFormProps {
  defaultValues?: FormPatientType;
  onSuccess: () => void;
}

function PatientRegistrationForm({
  defaultValues,
  onSuccess,
}: PatientRegistrationFormProps) {
  const queryClient = useQueryClient();

  const form = useForm<FormPatientType>({
    resolver: zodResolver(FormPatientSchema),
    defaultValues: defaultValues,
  });

  const { data: genders } = useQuery({
    queryKey: ["genders"],
    queryFn: getGenders,
  });

  const { mutate: createMutate, isPending: isCreating } = useMutation({
    mutationFn: createPatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      toast({
        title: "Patient created successfully",
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
    mutationFn: updatePatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      toast({ title: "Patient updated successfully" });
      onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: FormPatientType) => {
    console.log({ onsubmit: values });
    if (values.id) {
      updateMutate(values);
    } else {
      createMutate(values);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-2 gap-4">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              label="Patient MRN"
              placeholder="Patient MRN"
              description="patient's medical record number"
              control={form.control}
              name="medicalRecordNumber"
              // onKeyDown={handleKeyPress}
            />
            <span className="text-sm text-gray-500">{form.getValues().id}</span>
          </div>

          <section>
            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                label="First Name"
                placeholder="First Name"
                description="patient's first name"
                control={form.control}
                name="firstName"
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                label="Last Name"
                placeholder="Last Name"
                description="patient's last name"
                control={form.control}
                name="lastName"
              />
            </div>

            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldType.DATE_PICKER}
                label="Date of Birth"
                placeholder="Select patient's date of birth"
                description="Choose the date of birth for the patient"
                control={form.control}
                name="dateOfBirth"
              />

              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="genderId"
                label="Gender"
                placeholder="Select a gender"
                description="Select the gender for the patient">
                <SelectGroup>
                  {genders?.map((gender) => (
                    <SelectItem
                      key={gender.id}
                      value={gender.id?.toString() || ""}>
                      {gender.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </CustomFormField>
            </div>
          </section>

          <section>
            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                label="Email"
                placeholder="Email"
                description="patient's email"
                control={form.control}
                name="email"
              />

              <CustomFormField
                fieldType={FormFieldType.INPUT}
                label="Phone"
                placeholder="Phone"
                description="Enter patient's phone"
                control={form.control}
                name="phone"
              />

              <CustomFormField
                fieldType={FormFieldType.INPUT}
                label="Address"
                placeholder="Address"
                description="patient's address"
                control={form.control}
                name="address"
              />
            </div>
          </section>

          <div className="grid grid-cols-3 gap-4">
            <SubmitButton isLoading={isCreating || isUpdating}>
              {defaultValues?.id ? "Update Patient" : "Create Patient"}
            </SubmitButton>

            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset({})}>
              Clear
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => console.log(form.getValues())}>
              Console
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default PatientRegistrationForm;
