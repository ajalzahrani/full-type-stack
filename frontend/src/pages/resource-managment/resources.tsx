import ResourceTable from "@/components/tables/resource-table";
import { Button } from "@/components/ui/button";
import ResourceDialog from "@/components/models/resource-dialog";
import { useState } from "react";

function Resources() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Resources</h2>
        <Button onClick={() => setOpen(true)}>Add</Button>
      </div>
      <ResourceTable />
      <ResourceDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}

export default Resources;
