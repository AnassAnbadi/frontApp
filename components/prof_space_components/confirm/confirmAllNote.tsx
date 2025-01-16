import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ConfirmAllNoteProps = {
  isOpen: boolean;
  onClose: () => void;
  errorMessage: string;
};

export function ConfirmALL({
  isOpen,
  onClose,
  errorMessage,
}: ConfirmAllNoteProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Validation des Note</DialogTitle>
          <DialogDescription>{errorMessage}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            OK
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
