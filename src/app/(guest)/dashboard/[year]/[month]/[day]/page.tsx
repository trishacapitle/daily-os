"use client";

import { useParams } from "next/navigation";
import { format } from "date-fns";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { DragDropProvider } from "@dnd-kit/react";
import { Draggable } from "@/components/ui/draggable";
import { Droppable } from "@/components/ui/droppable";
import { useState } from "react";
import { Toolbar } from "@/components/toolbar";
import Menu from "@/components/menu";

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
      <Menu />
      <div className="relative flex min-h-screen flex-col">
        {/* Header */}
        <header className="flex flex-col items-center justify-center px-6 pt-6">
          <h2 className="text-5xl font-bold uppercase">
            {format(date, "MMMM")}
            <span className="text-primary"> {format(date, "d")} </span>
          </h2>
          <p className="text-muted-foreground">{format(date, "EEEE, yyyy")}</p>
        </header>

        {/* Workspace */}
        <div className="flex w-full px-6 pt-4">
          <ResizablePanelGroup
            orientation="horizontal"
            className="h-full rounded-lg border"
          >
            <ResizablePanel defaultSize={50}>
              <div className="flex h-[calc(100vh-132px)] items-center justify-center">
                <Droppable id="A">{target === "A" && <Draggable />}</Droppable>
              </div>
            </ResizablePanel>

            <ResizableHandle />

            <ResizablePanel defaultSize={50}>
              <ResizablePanelGroup orientation="vertical">
                <ResizablePanel defaultSize={50}>
                  <div className="flex h-full items-center justify-center">
                    <Droppable id="B">
                      {target === "B" && <Draggable />}
                    </Droppable>
                  </div>
                </ResizablePanel>

                <ResizableHandle />

                <ResizablePanel defaultSize={50}>
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
        <Toolbar />
      </div>
    </DragDropProvider>
  );
}
