import {
  HouseHeart,
  ListTodo,
  NotepadText,
  SmilePlus,
  SquareChartGantt,
} from "lucide-react";

import { Dock, DockIcon, DockItem, DockLabel } from "@/components/ui/dock";

const data = [
  {
    title: "Tasks",
    icon: <ListTodo className="text-foreground h-full w-full" />,
    component: "#",
  },
  {
    title: "Time Blocks",
    icon: <SquareChartGantt className="text-foreground h-full w-full" />,
    component: "#",
  },
  {
    title: "Notes",
    icon: <NotepadText className="text-foreground h-full w-full" />,
    component: "#",
  },
  {
    title: "Mood",
    icon: <SmilePlus className="text-foreground h-full w-full" />,
    component: "#",
  },
  {
    title: "Habits",
    icon: <HouseHeart className="text-foreground h-full w-full" />,
    component: "#",
  },
];

export function Toolbar() {
  return (
    <div className="absolute bottom-4 left-1/2 max-w-full -translate-x-1/2">
      <Dock className="items-end pb-3">
        {data.map((item, idx) => (
          <DockItem key={idx} className="aspect-square">
            <DockLabel>{item.title}</DockLabel>
            <DockIcon>{item.icon}</DockIcon>
          </DockItem>
        ))}
      </Dock>
    </div>
  );
}
