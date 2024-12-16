import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormPatientType,
  FormPatientSchema,
  convertFormPatientToDBPatient,
} from "../types/patient-types";

export const PatientForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormPatientType>({
    resolver: zodResolver(FormPatientSchema),
  });

  const onSubmit = async (formData: FormPatientType) => {
    // Transform form data to match database types
    const patientData = convertFormPatientToDBPatient(formData);

    try {
      const response = await fetch("/api/patients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patientData),
      });

      if (!response.ok) {
        throw new Error("Failed to create patient");
      }

      // Handle success
    } catch (error) {
      // Handle error
      console.error("Error creating patient:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>First Name</label>
        <input {...register("firstName")} />
        {errors.firstName && <span>{errors.firstName.message}</span>}
      </div>

      <div>
        <label>Last Name</label>
        <input {...register("lastName")} />
        {errors.lastName && <span>{errors.lastName.message}</span>}
      </div>

      <div>
        <label>Date of Birth</label>
        <input type="date" {...register("dateOfBirth")} />
        {errors.dateOfBirth && <span>{errors.dateOfBirth.message}</span>}
      </div>

      <div>
        <label>Medical Record Number</label>
        <input {...register("medicalRecordNumber")} />
        {errors.medicalRecordNumber && (
          <span>{errors.medicalRecordNumber.message}</span>
        )}
      </div>

      <div>
        <label>Email</label>
        <input type="email" {...register("email")} />
        {errors.email && <span>{errors.email.message}</span>}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};
