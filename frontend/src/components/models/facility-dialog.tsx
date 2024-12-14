import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FacilityForm from "@/components/froms/facility-form";
import { insertFacilitySchema } from "@server/types";
import { z } from "zod";
interface FacilityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: z.infer<typeof insertFacilitySchema>;
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
