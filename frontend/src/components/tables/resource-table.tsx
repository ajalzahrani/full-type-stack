import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { deleteResource, getResources } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { toast } from "@/hooks/use-toast";
import ResourceDialog from "@/components/models/resource-dialog";
import { insertResourceSchema } from "@server/types";
import { z } from "zod";

function ResourceTable() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["resources"],
    queryFn: () => getResources(),
  });

  const { mutate: deleteMutate } = useMutation({
    mutationFn: deleteResource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
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

  const [editingResource, setEditingResource] = useState<
    z.infer<typeof insertResourceSchema> | undefined
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
          {data?.map((resource) => (
            <TableRow key={resource.id}>
              <TableCell>{resource.name}</TableCell>
              <TableCell>{resource.description}</TableCell>
              <TableCell>{resource.resourceType}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingResource(resource);
                    setDialogOpen(true);
                  }}>
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    deleteMutate(resource.id);
                  }}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ResourceDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        defaultValues={editingResource}
      />
    </>
  );
}

export default ResourceTable;
