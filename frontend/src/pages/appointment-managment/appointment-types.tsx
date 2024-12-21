import AppointmentTypesTable from "@/components/tables/appointment-types-table";
import { Button } from "@/components/ui/button";
import AppointmentTypeDialog from "@/components/models/appointment-type-dialog";
import { useState } from "react";
function AppointmentTypes() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Appointment Types</h2>
        <Button onClick={() => setOpen(true)}>Add</Button>
      </div>
      <AppointmentTypesTable />
      <AppointmentTypeDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}

export default AppointmentTypes;
