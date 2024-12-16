import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AppointmentForm from "@/components/froms/appointment-form";
import { FormAppointmentType } from "@server/types/appointment-types";
interface AppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: FormAppointmentType;
}

function AppointmentDialog({
  open,
  onOpenChange,
  defaultValues,
}: AppointmentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-screen-sm">
        <DialogHeader>
          <DialogTitle>
            {defaultValues ? "Edit" : "Add"} Appointment
          </DialogTitle>
        </DialogHeader>
        <AppointmentForm
          defaultValues={defaultValues}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

export default AppointmentDialog;
