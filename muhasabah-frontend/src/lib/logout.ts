// lib/logout.ts
"use client";

import { clearTokens } from "./auth";
import { logoutUser } from "./api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

/**
 * Hook to handle user logout.
 * Clears stored tokens, calls backend logout endpoint,
 * and redirects to /login.
 */
export const useLogout = () => {
  const router = useRouter();

  const logout = async () => {
    try {
      // Attempt to log out on the server
      await logoutUser();
      toast.success("Logged out successfully");
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Logout failed. You have been signed out locally.");
    } finally {
      // Always clear local tokens and redirect
      clearTokens();
      router.push("/login");
    }
  };

  return logout;
};
