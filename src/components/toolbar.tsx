import {
  Activity,
  Component,
  HomeIcon,
  Mail,
  Package,
  ScrollText,
  SunMoon,
} from "lucide-react";

import { Dock, DockIcon, DockItem, DockLabel } from "@/components/ui/dock";

const data = [
  {
    title: "Home",
    icon: <HomeIcon className="text-foreground h-full w-full" />,
    href: "#",
  },
  {
    title: "Products",
    icon: <Package className="text-foreground h-full w-full" />,
    href: "#",
  },
  {
    title: "Components",
    icon: <Component className="text-foreground h-full w-full" />,
    href: "#",
  },
  {
    title: "Activity",
    icon: <Activity className="text-foreground h-full w-full" />,
    href: "#",
  },
  {
    title: "Change Log",
    icon: <ScrollText className="text-foreground h-full w-full" />,
    href: "#",
  },
  {
    title: "Email",
    icon: <Mail className="text-foreground h-full w-full" />,
    href: "#",
  },
  {
    title: "Theme",
    icon: <SunMoon className="text-foreground h-full w-full" />,
    href: "#",
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
