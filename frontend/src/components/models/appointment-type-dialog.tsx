import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AppointmentTypeForm from "@/components/froms/appointment-type-form";
import { FormAppointmentTypeType } from "@server/types/appointment-type-types";
interface AppointmentTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: FormAppointmentTypeType;
}

function AppointmentTypeDialog({
  open,
  onOpenChange,
  defaultValues,
}: AppointmentTypeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {defaultValues ? "Edit" : "Add"} Appointment Type
          </DialogTitle>
        </DialogHeader>
        <AppointmentTypeForm
          defaultValues={defaultValues}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

export default AppointmentTypeDialog;
