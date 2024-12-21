import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { blockPatient, getPatients } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { toast } from "@/hooks/use-toast";
import PatientRegistrationDialog from "@/components/models/patient-registration-dialog";
import { FormPatientType } from "@server/types/patient-types";
import { formatDateForInput } from "@/lib/datetime-format";

function PatientRegistrationTable() {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["patients"],
    queryFn: () => getPatients(),
  });

  const { mutate: blockMutate } = useMutation({
    mutationFn: blockPatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      toast({
        title: "Patient blocked",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: error.message,
        variant: "destructive",
      });
    },
  });

  const [editingPatient, setEditingPatient] = useState<
    FormPatientType | undefined
  >(undefined);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead>MRN</TableHead>
            <TableHead>Date of Birth</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((patient) => (
            <TableRow key={patient.Patients.id}>
              <TableCell>{patient.Patients.firstName}</TableCell>
              <TableCell>{patient.Patients.medicalRecordNumber}</TableCell>
              <TableCell>
                {formatDateForInput(patient.Patients.dateOfBirth)}
              </TableCell>
              <TableCell>{patient.Genders.name}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingPatient({
                      ...patient,
                      id: patient.Patients.id.toString(),
                      blocked: patient.Patients.blocked || false,
                      firstName: patient.Patients.firstName,
                      lastName: patient.Patients.lastName,
                      dateOfBirth: formatDateForInput(
                        patient.Patients.dateOfBirth
                      ),
                      genderId: patient.Patients.genderId?.toString() || "",
                      email: patient.Patients.email || "",
                      phone: patient.Patients.phone || "",
                      address: patient.Patients.address || "",
                      medicalRecordNumber: patient.Patients.medicalRecordNumber,
                    });
                    setDialogOpen(true);
                  }}>
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    blockMutate({
                      id: patient.Patients.id,
                      blocked: !patient.Patients.blocked,
                    });
                  }}>
                  {patient.Patients.blocked ? "Unblock" : "Block"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <PatientRegistrationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        defaultValues={editingPatient}
      />
    </>
  );
}

export default PatientRegistrationTable;
