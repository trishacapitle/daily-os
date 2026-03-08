"use client";

import { useParams } from "next/navigation";
import { format } from "date-fns";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { DragDropProvider } from "@dnd-kit/react";
import { Draggable } from "@/components/draggable";
import { Droppable } from "@/components/droppable";
import { useState } from "react";

export default function DayView() {
  const params = useParams();
  const [target, setTarget] = useState<string | null>(null);

  const { year, month, day } = params as {
    year: string;
    month: string;
    day: string;
  };

  const date = new Date(`${year}-${month}-${day}`);

  return (
    <DragDropProvider
      onDragEnd={(event) => {
        if (event.canceled) return;

        const dropId = event.operation.target?.id as string | undefined;

        if (dropId) {
          setTarget(dropId);
        }
      }}
    >
      <div className="flex min-h-screen flex-col">
        {/* Header */}
        <header className="px-6 py-6">
          <h2 className="text-5xl font-bold uppercase">
            {format(date, "MMMM")}
            <span className="text-primary"> {format(date, "d")} </span>
          </h2>
          <p className="text-muted-foreground">{format(date, "EEEE, yyyy")}</p>
        </header>

        {/* Workspace */}

        <div className="flex w-full p-4">
          <ResizablePanelGroup
            orientation="horizontal"
            className="rounded-lg border"
          >
            <ResizablePanel defaultSize={50}>
              <div className="flex h-150 items-center justify-center">
                <Droppable id="A">{target === "A" && <Draggable />}</Droppable>
              </div>
            </ResizablePanel>

            <ResizableHandle />

            <ResizablePanel defaultSize={50}>
              <ResizablePanelGroup orientation="vertical">
                <ResizablePanel defaultSize={25}>
                  <div className="flex h-full items-center justify-center">
                    <Droppable id="B">
                      {target === "B" && <Draggable />}
                    </Droppable>
                  </div>
                </ResizablePanel>

                <ResizableHandle />

                <ResizablePanel defaultSize={75}>
                  <div className="flex h-full items-center justify-center">
                    {" "}
                    <Droppable id="C">
                      {target === "C" && <Draggable />}
                    </Droppable>
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
        {!target && <Draggable />}
      </div>
    </DragDropProvider>
  );
}
