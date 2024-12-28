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
import ConfirmDialog from "@/components/models/confirm-dialog";
function AppointmentTable() {
  const queryClient = useQueryClient();

  const { data } = useQuery({
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

  const [deleteConfirmDialogOpen, setDeleteConfirmDialogOpen] = useState<{
    open: boolean;
    option: {
      id: number;
    };
  }>({ open: false, option: { id: 0 } });

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead>Appointment Date</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>End Time</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.appointments.map((appointment) => (
            <TableRow key={appointment.Resources?.name}>
              <TableCell>{appointment.Patients?.firstName}</TableCell>
              <TableCell>
                {formatDateForInput(appointment.Appointments.appointmentDate)}
              </TableCell>
              <TableCell>
                {formatTimeForInput(appointment.Appointments.startTime)}
              </TableCell>
              <TableCell>
                {formatTimeForInput(appointment.Appointments.endTime)}
              </TableCell>
              <TableCell className="flex gap-2">
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
                      patientMrn:
                        appointment.Patients?.medicalRecordNumber.toString() ||
                        "",
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
                    setDeleteConfirmDialogOpen({
                      open: true,
                      option: { id: appointment.Appointments.id },
                    });
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

      <ConfirmDialog
        open={deleteConfirmDialogOpen.open}
        onOpenChange={(open) =>
          setDeleteConfirmDialogOpen({ ...deleteConfirmDialogOpen, open })
        }
        title="Are you sure you want to delete this appointment?"
        description="This action will delete the appointment from the system."
        onConfirm={() => {
          deleteMutate(deleteConfirmDialogOpen.option.id);
        }}
      />
    </>
  );
}

export default AppointmentTable;
