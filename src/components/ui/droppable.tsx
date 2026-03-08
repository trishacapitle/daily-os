import { cn } from "@/lib/utils";
import { useDroppable } from "@dnd-kit/react";

export function Droppable({
  id,
  children,
}: {
  id: string;
  children?: React.ReactNode;
}) {
  const { ref, isDropTarget } = useDroppable({
    id,
  });

  return (
    <div
      ref={ref}
      className={cn(
        "h-full w-full transition-colors",
        isDropTarget && "bg-primary/5 ring-primary/30 ring-2",
      )}
    >
      {children}
    </div>
  );
}
