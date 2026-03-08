import FloatingActionMenu from "@/components/ui/floating-action-menu";
import { Settings, User, LogOut, LogIn } from "lucide-react";

export default function Menu() {
  return (
    <FloatingActionMenu
      options={[
        {
          label: "Account",
          Icon: <User className="h-4 w-4" />,
          onClick: () => console.log("Account clicked"),
        },
        {
          label: "Settings",
          Icon: <Settings className="h-4 w-4" />,
          onClick: () => console.log("Settings clicked"),
        },
        {
          label: "Logout",
          Icon: <LogOut className="h-4 w-4" />,
          onClick: () => console.log("Logout clicked"),
        },
        {
          label: "Login",
          Icon: <LogIn className="h-4 w-4" />,
          onClick: () => console.log("Login clicked"),
        },
      ]}
    />
  );
}
