import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ResourceForm from "@/components/froms/resource-form";
import { FormResourceType } from "@server/types/resource-types";

interface ResourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: FormResourceType;
}

function ResourceDialog({
  open,
  onOpenChange,
  defaultValues,
}: ResourceDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{defaultValues ? "Edit" : "Add"} Resource</DialogTitle>
        </DialogHeader>
        <ResourceForm
          defaultValues={defaultValues}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

export default ResourceDialog;
