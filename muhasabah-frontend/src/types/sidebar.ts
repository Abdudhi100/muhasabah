// src/types/sidebar.ts
export type SidebarIcon = "LayoutDashboard" | "Users" | "Settings";

export interface MenuItem {
  label: string;
  path: string;
  icon: SidebarIcon;
}
