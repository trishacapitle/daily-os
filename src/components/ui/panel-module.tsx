import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export function PanelModule({
  children,
  onRemove,
}: {
  children: React.ReactNode;
  onRemove: () => void;
}) {
  return (
    <div className="relative flex h-full w-full">
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={onRemove}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="h-full w-full">{children}</div>
    </div>
  );
}
