import AppointmentTable from "@/components/tables/appointment-table";
import { Button } from "@/components/ui/button";
import AppointmentDialog from "@/components/models/appointment-dialog";
import { useState } from "react";

function Appointments() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Appointments</h2>
        <Button onClick={() => setOpen(true)}>Add</Button>
      </div>
      <AppointmentTable />
      <AppointmentDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}

export default Appointments;
