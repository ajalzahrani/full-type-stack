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
import { insertAppointmentSchema } from "@server/types";
import { z } from "zod";

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
    z.infer<typeof insertAppointmentSchema> | undefined
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
            <TableRow key={appointment.id}>
              <TableCell>{appointment.name}</TableCell>
              <TableCell>{appointment.description}</TableCell>
              <TableCell>{appointment.resourceType}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingAppointment(appointment);
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
