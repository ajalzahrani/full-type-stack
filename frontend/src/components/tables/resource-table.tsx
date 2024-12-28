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
import ConfirmDialog from "@/components/models/confirm-dialog";

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
              <TableCell className="flex gap-2">
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
                    setDeleteConfirmDialogOpen({
                      open: true,
                      option: { id: resource.Resources.id },
                    });
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

      <ConfirmDialog
        open={deleteConfirmDialogOpen.open}
        onOpenChange={(open) =>
          setDeleteConfirmDialogOpen({ ...deleteConfirmDialogOpen, open })
        }
        title="Are you sure you want to delete this resource?"
        description="This action will delete the resource from the system."
        onConfirm={() => {
          deleteMutate(deleteConfirmDialogOpen.option.id);
        }}
      />
    </>
  );
}

export default ResourceTable;
