import { ModuleType } from "@/types/dashboard-params";
import { useDraggable } from "@dnd-kit/react";

export function Draggable({
  module,
  children,
}: {
  module: ModuleType;
  children: React.ReactNode;
}) {
  const { ref } = useDraggable({
    id: module,
    data: { module },
  });

  return <div ref={ref}>{children}</div>;
}
