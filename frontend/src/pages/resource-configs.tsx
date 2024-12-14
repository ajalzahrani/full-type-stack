import ResourceConfigurationsTable from "@/components/tables/resource-config-table";
import { Button } from "@/components/ui/button";
import ResourceConfigurationDialog from "@/components/models/resource-config-dialog";
import { useState } from "react";

function ResourceConfigurations() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Resource Configurations</h2>
        <Button onClick={() => setOpen(true)}>Add</Button>
      </div>
      <ResourceConfigurationsTable />
      <ResourceConfigurationDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}

export default ResourceConfigurations;
