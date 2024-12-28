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
import { FormResourceType } from "@server/types/resource-types";

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
    FormResourceType | undefined
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
          {data?.resources.map((resource) => (
            <TableRow key={resource.Resources.id}>
              <TableCell>{resource.Resources.name}</TableCell>
              <TableCell>{resource.Resources.description}</TableCell>
              <TableCell>{resource.ResourceTypes.name}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingResource({
                      ...resource.Resources,
                      id: resource.Resources.id.toString(),
                      resourceTypeId: resource.ResourceTypes.id.toString(),
                      name: resource.Resources.name,
                      description: resource.Resources.description || "",
                    });
                    setDialogOpen(true);
                  }}>
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    deleteMutate(resource.Resources.id);
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
