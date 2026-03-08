"use client";

import { useParams } from "next/navigation";
import { format } from "date-fns";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { DragDropProvider } from "@dnd-kit/react";
import { Droppable } from "@/components/ui/droppable";
import { useState } from "react";
import { Toolbar } from "@/components/toolbar";
import Menu from "@/components/menu";
import { DayViewParams } from "@/types/dashboard-params";

type ModuleType = "tasks" | "timeBlocks" | "notes" | "mood" | "habits";

type LayoutState = {
  A: ModuleType | null;
  B: ModuleType | null;
  C: ModuleType | null;
};

export default function DayView() {
  const params = useParams();

  const { year, month, day } = params as DayViewParams;

  const date = new Date(`${year}-${month}-${day}`);

  const [layout, setLayout] = useState<LayoutState>({
    A: null,
    B: null,
    C: null,
  });

  function renderModule(module: ModuleType | null) {
    if (!module) return null;

    switch (module) {
      case "tasks":
        return <div>Tasks Module</div>;
      case "timeBlocks":
        return <div>Time Blocks Module</div>;
      case "notes":
        return <div>Notes Module</div>;
      case "mood":
        return <div>Mood Module</div>;
      case "habits":
        return <div>Habits Module</div>;
      default:
        return null;
    }
  }

  return (
    <DragDropProvider
      onDragEnd={(event) => {
        if (event.canceled) return;

        const moduleType = event.operation.source?.data?.module as
          | ModuleType
          | undefined;

        const dropId = event.operation.target?.id as keyof LayoutState;

        if (!moduleType || !dropId) return;

        setLayout((prev) => ({
          ...prev,
          [dropId]: moduleType,
        }));
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
                <Droppable id="A">{renderModule(layout.A)}</Droppable>
              </div>
            </ResizablePanel>

            <ResizableHandle />

            <ResizablePanel defaultSize={50}>
              <ResizablePanelGroup orientation="vertical">
                <ResizablePanel defaultSize={50}>
                  <div className="flex h-full items-center justify-center">
                    <Droppable id="B">{renderModule(layout.B)}</Droppable>
                  </div>
                </ResizablePanel>

                <ResizableHandle />

                <ResizablePanel defaultSize={50}>
                  <div className="flex h-full items-center justify-center">
                    <Droppable id="C">{renderModule(layout.C)}</Droppable>
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
