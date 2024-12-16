import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { deleteResourceAvailability, getResourceAvailability } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { toast } from "@/hooks/use-toast";
import ResourceAvailabilityDialog from "@/components/models/resource-availability-dialog";
import {
  formatDateForInput,
  formatLocalDateTime,
  formatTimeForInput,
} from "@/lib/datetime-format";
import { FormResourceAvailabilityType } from "@server/types/resource-availability-types";

function ResourceAvailabilityTable() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["resource-availabilities"],
    queryFn: () => getResourceAvailability(),
  });

  const { mutate: deleteMutate } = useMutation({
    mutationFn: deleteResourceAvailability,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resource-availabilities"] });
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

  const [editingResourceAvailability, setEditingResourceAvailability] =
    useState<FormResourceAvailabilityType | undefined>(undefined);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Resource</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>End Time</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Week Days</TableHead>
            <TableHead>Is Recurring</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((resource) => (
            <TableRow key={resource.ResourceAvailability.id}>
              <TableCell>{resource.Resources.name}</TableCell>
              <TableCell>
                {new Date(
                  resource.ResourceAvailability.startTime
                ).toLocaleTimeString()}
              </TableCell>
              <TableCell>
                {new Date(
                  resource.ResourceAvailability.endTime
                ).toLocaleTimeString()}
              </TableCell>
              <TableCell>
                {new Date(
                  resource.ResourceAvailability.startDate
                ).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {resource.ResourceAvailability.endDate
                  ? new Date(
                      resource.ResourceAvailability.endDate
                    ).toLocaleDateString()
                  : ""}
              </TableCell>
              <TableCell>{resource.ResourceAvailability.weekDays}</TableCell>
              <TableCell>
                {resource.ResourceAvailability.isRecurring ? "Yes" : "No"}
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingResourceAvailability({
                      ...resource,
                      id: resource.ResourceAvailability.id.toString(),
                      resourceId: resource.Resources.id.toString(),
                      startDate: formatDateForInput(
                        resource.ResourceAvailability.startDate
                      ),
                      endDate: resource.ResourceAvailability.endDate
                        ? formatDateForInput(
                            resource.ResourceAvailability.endDate
                          )
                        : null,
                      startTime: formatTimeForInput(
                        resource.ResourceAvailability.startTime
                      ),
                      endTime: formatTimeForInput(
                        resource.ResourceAvailability.endTime
                      ),
                      weekDays: resource.ResourceAvailability.weekDays || "",
                      isRecurring: resource.ResourceAvailability.isRecurring,
                    });
                    setDialogOpen(true);
                  }}>
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    deleteMutate(resource.ResourceAvailability.id);
                  }}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ResourceAvailabilityDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        defaultValues={editingResourceAvailability}
      />
    </>
  );
}

export default ResourceAvailabilityTable;
