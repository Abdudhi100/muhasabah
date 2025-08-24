"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { loginUser, logoutUser, getProfile } from "@/lib/api";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  email: string;
  username: string;
  role: string;
  location?: string;
  whatsapp?: string;
  is_verified: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (loginInput: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

interface Profile {
  id: number;
  username: string;
  role: string;
  email?: string;
  is_verified?: boolean;
  location?: string;
  whatsapp?: string;
}

// Type guard for Profile -> User
function profileToUser(profile: Profile): User {
  return {
    id: profile.id,
    username: profile.username,
    role: profile.role,
    email: profile.email ?? "",
    is_verified: profile.is_verified ?? false,
    location: profile.location,
    whatsapp: profile.whatsapp,
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const profile = await getProfile();
        setUser(profileToUser(profile));
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (loginInput: string, password: string) => {
    setLoading(true);
    try {
      await loginUser(loginInput, password);
      const profile = await getProfile();
      const userObj = profileToUser(profile);
      setUser(userObj);

      switch (userObj.role) {
        case "student":
          router.push("/dashboard/student");
          break;
        case "sitting_head":
          router.push("/dashboard/head");
          break;
        case "overall_head":
          router.push("/dashboard/overall_head");
          break;
        default:
          router.push("/");
      }
    } catch (err: unknown) {
      // Properly typed error
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Login failed. Please try again.";
      console.error("Login failed:", errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err: unknown) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
