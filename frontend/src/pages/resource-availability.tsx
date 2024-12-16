import ResourceAvailabilityTable from "@/components/tables/resource-availability-table";
import { Button } from "@/components/ui/button";
import ResourceAvailabilityDialog from "@/components/models/resource-availability-dialog";
import { useState } from "react";

function ResourceAvailability() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Resource Availability</h2>
        <Button onClick={() => setOpen(true)}>Add</Button>
      </div>
      <ResourceAvailabilityTable />
      <ResourceAvailabilityDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}

export default ResourceAvailability;
