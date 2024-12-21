import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FacilityForm from "@/components/froms/facility-form";
import { FormFacilityType } from "@server/types/facility-types";
interface FacilityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: FormFacilityType;
}

function FacilityDialog({
  open,
  onOpenChange,
  defaultValues,
}: FacilityDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{defaultValues ? "Edit" : "Add"} Facility</DialogTitle>
        </DialogHeader>
        <FacilityForm
          defaultValues={defaultValues}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

export default FacilityDialog;
