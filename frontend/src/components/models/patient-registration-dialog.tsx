import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PatientRegistrationForm from "@/components/froms/patient-registration-form";
import { FormPatientType } from "@server/types/patient-types";
interface PatientRegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: FormPatientType;
}

function PatientRegistrationDialog({
  open,
  onOpenChange,
  defaultValues,
}: PatientRegistrationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-screen-sm max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {defaultValues ? "Edit" : "Add"} Patient Registration
          </DialogTitle>
        </DialogHeader>
        <PatientRegistrationForm
          defaultValues={defaultValues}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

export default PatientRegistrationDialog;
