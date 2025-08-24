// lib/dashboardMenu.ts
import {
  ClipboardList,
  Users,
  CheckSquare,
  FileText,
} from "lucide-react";

/**
 * Dashboard menu configuration.
 * Controls navigation links, icons, and access by user role.
 */
export interface DashboardMenuItem {
  name: string;                 // Label shown in the sidebar
  href: string;                 // Navigation path
  icon: React.ElementType;      // Icon component from lucide-react
  allowedRoles: string[];       // Roles that can access the menu
}

export const dashboardMenu: DashboardMenuItem[] = [
  {
    name: "Sittings",
    href: "/dashboard/sittings",
    icon: Users,
    allowedRoles: ["overall_head", "sitting_head"],
  },
  {
    name: "To-Dos",
    href: "/dashboard/todos",
    icon: ClipboardList,
    allowedRoles: ["overall_head", "sitting_head", "student"],
  },
  {
    name: "Check-Ins",
    href: "/dashboard/checkins",
    icon: CheckSquare,
    allowedRoles: ["student"],
  },
  {
    name: "SWOT Analysis",
    href: "/dashboard/swot",
    icon: FileText,
    allowedRoles: ["student"],
  },
];
