import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { deleteFacility, getFacilities } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { toast } from "@/hooks/use-toast";
import FacilityDialog from "@/components/models/facility-dialog";
import { FormFacilityType } from "@server/types/facility-types";
import ConfirmDialog from "@/components/models/confirm-dialog";
function FacilityTable() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["facilities"],
    queryFn: () => getFacilities(),
  });

  const { mutate: deleteMutate } = useMutation({
    mutationFn: deleteFacility,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["facilities"] });
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

  const [editingFacility, setEditingFacility] = useState<
    FormFacilityType | undefined
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
            <TableHead>Description</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.facilities.map((facility) => (
            <TableRow key={facility.id}>
              <TableCell>{facility.name}</TableCell>
              <TableCell>{facility.description}</TableCell>
              <TableCell className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingFacility({
                      ...facility,
                      id: facility.id.toString(),
                      description: facility.description || "",
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
                      option: { id: facility.id },
                    });
                  }}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <FacilityDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        defaultValues={editingFacility}
      />

      <ConfirmDialog
        open={deleteConfirmDialogOpen.open}
        onOpenChange={(open) =>
          setDeleteConfirmDialogOpen({ ...deleteConfirmDialogOpen, open })
        }
        title="Are you sure you want to delete this facility?"
        description="This action will delete the facility from the system."
        onConfirm={() => {
          deleteMutate(deleteConfirmDialogOpen.option.id);
        }}
      />
    </>
  );
}

export default FacilityTable;
