"use client";

import { AuthProvider } from "@/context/AuthContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
// This file wraps the application with the AuthProvider context
// allowing access to authentication state throughout the app.