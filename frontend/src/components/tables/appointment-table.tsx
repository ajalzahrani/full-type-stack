import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { deleteAppointment, getAppointments } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { toast } from "@/hooks/use-toast";
import AppointmentDialog from "@/components/models/appointment-dialog";
import { FormAppointmentType } from "@server/types/appointment-types";
import { formatDateForInput, formatTimeForInput } from "@/lib/datetime-format";

function AppointmentTable() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["appointments"],
    queryFn: () => getAppointments(),
  });

  const { mutate: deleteMutate } = useMutation({
    mutationFn: deleteAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast({
        title: "Appointment deleted",
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

  const [editingAppointment, setEditingAppointment] = useState<
    FormAppointmentType | undefined
  >(undefined);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Resource Type</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((appointment) => (
            <TableRow key={appointment.Resources?.name}>
              <TableCell>{appointment.Facilities?.name}</TableCell>
              <TableCell>{appointment.Appointments.startTime}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingAppointment({
                      ...appointment.Appointments,
                      id: appointment.Appointments.id.toString(),
                      resourceId: appointment.Resources?.id.toString() || "",
                      appointmentDate: formatDateForInput(
                        appointment.Appointments.appointmentDate
                      ),
                      startTime: formatTimeForInput(
                        appointment.Appointments.startTime
                      ),
                      endTime: formatTimeForInput(
                        appointment.Appointments.endTime
                      ),
                      facilityId: appointment.Facilities?.id.toString() || "",
                      patientId: appointment.Patients?.id.toString() || "",
                      typeId: appointment.AppointmentTypes?.id.toString() || "",
                      notes: appointment.Appointments.notes || "",
                    });
                    setDialogOpen(true);
                  }}>
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    deleteMutate(appointment.id);
                  }}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AppointmentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        defaultValues={editingAppointment}
      />
    </>
  );
}

export default AppointmentTable;
