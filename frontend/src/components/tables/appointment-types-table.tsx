import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { deleteAppointmentType, getAppointmentTypes } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { toast } from "@/hooks/use-toast";
import AppointmentTypeDialog from "@/components/models/appointment-type-dialog";
import { FormAppointmentTypeType } from "@server/types/appointment-type-types";
import ConfirmDialog from "@/components/models/confirm-dialog";

function AppointmentTypesTable() {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["appointmentTypes"],
    queryFn: () => getAppointmentTypes(),
  });

  const { mutate: deleteMutate } = useMutation({
    mutationFn: deleteAppointmentType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointmentTypes"] });
      toast({
        title: "Resource deleted",
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

  const [editingAppointmentType, setEditingAppointmentType] = useState<
    FormAppointmentTypeType | undefined
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
            <TableHead>Name</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.appointmentTypes.map((appointmentType) => (
            <TableRow key={appointmentType.id}>
              <TableCell>{appointmentType.name}</TableCell>
              <TableCell>{appointmentType.duration}</TableCell>
              <TableCell className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingAppointmentType({
                      ...appointmentType,
                      id: appointmentType.id.toString(),
                      duration: appointmentType.duration.toString(),
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
                      option: { id: appointmentType.id },
                    });
                  }}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AppointmentTypeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        defaultValues={editingAppointmentType}
      />

      <ConfirmDialog
        open={deleteConfirmDialogOpen.open}
        onOpenChange={(open) =>
          setDeleteConfirmDialogOpen({ ...deleteConfirmDialogOpen, open })
        }
        title="Are you sure you want to delete this appointment type?"
        description="This action will delete the appointment type from the system."
        onConfirm={() => {
          deleteMutate(deleteConfirmDialogOpen.option.id);
        }}
      />
    </>
  );
}

export default AppointmentTypesTable;
