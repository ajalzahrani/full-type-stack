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
import { insertFacilitySchema } from "@server/types";
import { z } from "zod";

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
    z.infer<typeof insertFacilitySchema> | undefined
  >(undefined);
  const [dialogOpen, setDialogOpen] = useState(false);

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
          {data?.map((facility) => (
            <TableRow key={facility.id}>
              <TableCell>{facility.name}</TableCell>
              <TableCell>{facility.description}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingFacility(facility);
                    setDialogOpen(true);
                  }}>
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    deleteMutate(facility.id);
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
    </>
  );
}

export default FacilityTable;
