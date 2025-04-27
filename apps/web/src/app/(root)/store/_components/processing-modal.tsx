import { Loader2 } from "lucide-react";
import { ModalView } from "@/components/common/modal-view";

interface ProcessingModalProps {
  isOpen: boolean;
  isProcessing: boolean;
}

export const ProcessingModal: React.FC<ProcessingModalProps> = ({ isOpen, isProcessing }) => (
  <ModalView open={isOpen} onClose={() => {}} className="bg-background/80">
    {isProcessing ? (
      <div className="flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin size-10" />
        <div>
          <p className="text-muted-foreground">Please wait, your payment is being processed.</p>
        </div>
      </div>
    ) : (
      <div className="flex flex-col gap-4 p-2">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4"></div>
      </div>
    )}
  </ModalView>
);
