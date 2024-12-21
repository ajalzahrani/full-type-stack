import { Button } from "@/components/ui/button";
import PatientRegistrationDialog from "@/components/models/patient-registration-dialog";
import { useState } from "react";
import PatientRegistrationTable from "@/components/tables/patient-registration-table";
function PatientRegistration() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Patient Registration</h2>
        <Button onClick={() => setOpen(true)}>Add</Button>
      </div>
      <PatientRegistrationTable />
      <PatientRegistrationDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}

export default PatientRegistration;
