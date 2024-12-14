import FacilityTable from "@/components/tables/facilities-table";
import FacilityDialog from "@/components/models/facility-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

function Facilities() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Facilities</h2>
        <Button onClick={() => setOpen(true)}>Add</Button>
      </div>
      <FacilityTable />
      <FacilityDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}

export default Facilities;
