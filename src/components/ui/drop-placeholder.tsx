import { Box } from "lucide-react";

export function DropPlaceholder() {
  return (
    <div className="text-muted-foreground flex h-full w-full flex-col items-center justify-center gap-2 text-sm">
      <Box className="h-5 w-5 opacity-40" />
      <p>Drag module a here from the toolbar below</p>
    </div>
  );
}
