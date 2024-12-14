import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ResourceConfigurationForm from "@/components/froms/resource-configuration-form";
import { insertResourceConfigurationSchema } from "@server/types";
import { z } from "zod";
interface ResourceConfigurationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: z.infer<typeof insertResourceConfigurationSchema>;
}

function ResourceConfigurationDialog({
  open,
  onOpenChange,
  defaultValues,
}: ResourceConfigurationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-screen-sm">
        <DialogHeader>
          <DialogTitle>{defaultValues ? "Edit" : "Add"} Resource</DialogTitle>
        </DialogHeader>
        <ResourceConfigurationForm
          defaultValues={defaultValues}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

export default ResourceConfigurationDialog;
