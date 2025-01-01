import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ResourceAvailabilityForm from "@/components/froms/resource-availability-form";
import { FormResourceAvailabilityType } from "@server/types/resource-availability-types";

interface ResourceAvailabilityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: FormResourceAvailabilityType;
}

function ResourceAvailabilityDialog({
  open,
  onOpenChange,
  defaultValues,
}: ResourceAvailabilityDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-screen-sm max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{defaultValues ? "Edit" : "Add"} Resource</DialogTitle>
        </DialogHeader>
        <ResourceAvailabilityForm
          defaultValues={defaultValues}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

export default ResourceAvailabilityDialog;
