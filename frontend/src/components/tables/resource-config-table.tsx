import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  deleteResourceConfiguration,
  getResourceConfiguration,
} from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { toast } from "@/hooks/use-toast";
import ResourceConfigurationDialog from "@/components/models/resource-config-dialog";
import { formatLocalDateTime } from "@/lib/datetime-format";
import { insertResourceConfigurationSchema } from "@server/types";

import { z } from "zod";

function ResourceConfigurations() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["resource-configurations"],
    queryFn: () => getResourceConfiguration(),
  });

  const { mutate: deleteMutate } = useMutation({
    mutationFn: deleteResourceConfiguration,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resource-configurations"] });
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

  const [editingResourceConfiguration, setEditingResourceConfiguration] =
    useState<z.infer<typeof insertResourceConfigurationSchema> | undefined>(
      undefined
    );
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Resource</TableHead>
            <TableHead>Assigned By</TableHead>
            <TableHead>Estimated Waiting Time</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>End Time</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Week Days</TableHead>
            <TableHead>Status ID</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((resource) => (
            <TableRow key={resource.ResourceConfigurations.id}>
              <TableCell>{resource.Resources?.name}</TableCell>
              <TableCell>
                {resource.ResourceConfigurations.assignedBy}
              </TableCell>
              <TableCell>
                {resource.ResourceConfigurations.estimatedWaitingTime}
              </TableCell>
              <TableCell>{resource.ResourceConfigurations.startTime}</TableCell>
              <TableCell>{resource.ResourceConfigurations.endTime}</TableCell>
              <TableCell>
                {formatLocalDateTime(resource.ResourceConfigurations.startDate)}
              </TableCell>
              <TableCell>
                {formatLocalDateTime(resource.ResourceConfigurations.endDate)}
              </TableCell>
              <TableCell>{resource.ResourceConfigurations.weekDays}</TableCell>
              <TableCell>{resource.ResourceConfigurations.statusId}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingResourceConfiguration({
                      ...resource.ResourceConfigurations,
                      id: resource.ResourceConfigurations.id,
                      resourceId: Number(resource.Resources.id),
                      facilityId: Number(resource.Facilities.id),
                      startDate: resource.ResourceConfigurations.startDate
                        ? new Date(resource.ResourceConfigurations.startDate)
                        : null,
                      endDate: resource.ResourceConfigurations.endDate
                        ? new Date(resource.ResourceConfigurations.endDate)
                        : null,
                      startTime:
                        resource.ResourceConfigurations.startTime || "",
                      endTime: resource.ResourceConfigurations.endTime || "",
                      weekDays: resource.ResourceConfigurations.weekDays || "",
                      statusId: Number(
                        resource.ResourceConfigurations.statusId
                      ),
                      estimatedWaitingTime: Number(
                        resource.ResourceConfigurations.estimatedWaitingTime ||
                          0
                      ),
                      blocked: resource.ResourceConfigurations.blocked ?? false,
                      assignedBy:
                        resource.ResourceConfigurations.assignedBy || null,
                    });
                    setDialogOpen(true);
                  }}>
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    deleteMutate(resource.ResourceConfigurations.id);
                  }}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ResourceConfigurationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        defaultValues={editingResourceConfiguration}
      />
    </>
  );
}

export default ResourceConfigurations;
