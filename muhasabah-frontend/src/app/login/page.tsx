// src/app/login/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/app/store/auth";
import axios, { AxiosError } from "axios";

const schema = z.object({
  identifier: z.string().min(3, "Enter your email or username"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormValues = z.infer<typeof schema>;

// Backend error response shape (adjust to your API)
interface AuthErrorResponse {
  detail?: string;
  non_field_errors?: string[];
}

// Optional: central role → route mapping
const roleRedirects: Record<string, string> = {
  "student": "/dashboard/",
  "sitting_head": "/dashboard/",
  "overall_head": "/dashboard/",
};

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuth(((s) => s.setAuth));

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { identifier: "", password: "" },
  });

  // Throttle lock UI (after 429)
  const [lockUntil, setLockUntil] = useState<number>(0);
  const [now, setNow] = useState<number>(Date.now());

  const secondsLeft = useMemo(() => {
    const diff = Math.ceil((lockUntil - now) / 1000);
    return diff > 0 ? diff : 0;
  }, [lockUntil, now]);

  useEffect(() => {
    if (!lockUntil) return;
    const t = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(t);
  }, [lockUntil]);

  const onSubmit = async (values: FormValues) => {
    if (secondsLeft > 0) return;

    try {
      // POST /api/auth/login/ -> sets HttpOnly cookies and returns { user, tokens }
      const res = await api.post("/auth/login/", values);

      const { user, tokens } = res.data ?? {};
      setAuth(user ?? null, tokens ?? null); // tokens optional (cookies are primary)

      toast.success("Welcome back 👋");

      // ✅ Role-based redirect via mapping with fallback
      const target = user?.role ? roleRedirects[user.role] : undefined;
      router.push(target ?? "/dashboard");
    } catch (error: unknown) {
      if (axios.isAxiosError<AuthErrorResponse>(error)) {
        const status = error.response?.status;

        // Handle throttling (HTTP 429)
        if (status === 429) {
          const retryHeader = error.response?.headers?.["retry-after"];
          const retrySeconds = Number(retryHeader) || 30;
          setLockUntil(Date.now() + retrySeconds * 1000);
          toast.error(`Too many attempts. Try again in ${retrySeconds}s.`);
          return;
        }

        // Common auth errors
        const detail =
          error.response?.data?.detail ||
          error.response?.data?.non_field_errors?.[0] ||
          "Invalid credentials";
        toast.error(detail);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    }
  };

  return (
    <div className="min-h-svh flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md rounded-2xl border bg-card p-6 shadow">
        <h1 className="text-2xl font-bold mb-1">Sign in</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Use your email or username and password
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              {...register("identifier")}
              placeholder="Email or username"
              autoComplete="username"
              disabled={isSubmitting || secondsLeft > 0}
            />
            {errors.identifier && (
              <p className="mt-1 text-sm text-red-600">
                {errors.identifier.message}
              </p>
            )}
          </div>

          <div>
            <Input
              {...register("password")}
              placeholder="Password"
              type="password"
              autoComplete="current-password"
              disabled={isSubmitting || secondsLeft > 0}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || secondsLeft > 0}
          >
            {secondsLeft > 0
              ? `Try again in ${secondsLeft}s`
              : isSubmitting
              ? "Signing in..."
              : "Sign in"}
          </Button>

          <div className="text-center text-sm mt-2">
            New user?{" "}
            <Link
              href="/register"
              className="underline hover:no-underline font-medium"
            >
              Create an account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
