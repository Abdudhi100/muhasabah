// components/LogoutButton.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/lib/logout";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const logout = useLogout();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    if (!confirm("Are you sure you want to log out?")) return;
    try {
      setLoading(true);
      await logout();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleLogout}
      variant="destructive"
      className="flex items-center gap-2"
      disabled={loading}
      aria-label="Log out"
    >
      <LogOut size={16} />
      {loading ? "Logging out..." : "Logout"}
    </Button>
  );
}
