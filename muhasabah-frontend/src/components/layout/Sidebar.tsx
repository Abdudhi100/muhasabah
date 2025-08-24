// components/layout/Sidebar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutDashboard, Users, Settings } from "lucide-react"; // ✅ Import only what you need

// Map of available icons
const icons = {
  LayoutDashboard,
  Users,
  Settings,
};

import type { MenuItem } from "@/types/sidebar";

interface SidebarProps {
  menu: MenuItem[];
}

function IconRenderer({ name }: { name: keyof typeof icons }) {
  const Icon = icons[name] ?? LayoutDashboard; // fallback if icon not found
  return <Icon className="w-5 h-5" />;
}

// 🔥 Strong typing for menu items


interface SidebarProps {
  menu: MenuItem[];
}

export default function Sidebar({ menu }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`bg-gray-800 text-white transition-all duration-200 ${
        collapsed ? "w-16" : "w-64"
      } min-h-screen border-r`}
    >
      {/* Header / Toggle */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
        {!collapsed && <span className="text-lg font-bold">Muhasabah</span>}
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="text-white hover:text-gray-300"
          title={collapsed ? "Expand" : "Collapse"}
        >
          ☰
        </button>
      </div>

      {/* Menu */}
      <nav className="mt-4">
        <ul className="space-y-1">
          {menu.map((item, idx) => (
            <li key={idx}>
              <Link
                href={item.path}
                className="flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-700 transition-colors"
              >
                <IconRenderer name={item.icon} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            </li>
          ))}

          {menu.length === 0 && (
            <li className="px-4 py-2 text-sm text-gray-400">
              No menu items available
            </li>
          )}
        </ul>
      </nav>
    </aside>
  );
}
