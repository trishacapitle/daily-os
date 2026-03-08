import { useDroppable } from "@dnd-kit/react";

export function Droppable({
  id,
  children,
}: {
  id: string;
  children?: React.ReactNode;
}) {
  const { ref } = useDroppable({
    id,
  });

  return (
    <div ref={ref} className="h-full w-full">
      {children}
    </div>
  );
}
