import {
  HouseHeart,
  ListTodo,
  NotepadText,
  SmilePlus,
  SquareChartGantt,
} from "lucide-react";

import { Dock, DockIcon, DockItem, DockLabel } from "@/components/ui/dock";
import { ModuleType } from "@/types/dashboard-params";
import { Draggable } from "./ui/draggable";

const data: {
  title: string;
  icon: React.ReactNode;
  module: ModuleType;
}[] = [
  {
    title: "Tasks",
    icon: <ListTodo className="text-foreground h-full w-full" />,
    module: "tasks",
  },
  {
    title: "Time Blocks",
    icon: <SquareChartGantt className="text-foreground h-full w-full" />,
    module: "timeBlocks",
  },
  {
    title: "Notes",
    icon: <NotepadText className="text-foreground h-full w-full" />,
    module: "notes",
  },
  {
    title: "Mood",
    icon: <SmilePlus className="text-foreground h-full w-full" />,
    module: "mood",
  },
  {
    title: "Habits",
    icon: <HouseHeart className="text-foreground h-full w-full" />,
    module: "habits",
  },
];

export function Toolbar() {
  return (
    <div className="absolute bottom-4 left-1/2 max-w-full -translate-x-1/2">
      <Dock className="items-end pb-3">
        {data.map((item, idx) => (
          <Draggable key={item.module} module={item.module}>
            <DockItem key={idx} className="aspect-square">
              <DockLabel>{item.title}</DockLabel>
              <DockIcon>{item.icon}</DockIcon>
            </DockItem>
          </Draggable>
        ))}
      </Dock>
    </div>
  );
}
