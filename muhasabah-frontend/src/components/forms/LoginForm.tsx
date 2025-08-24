"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { setTokens } from "@/lib/auth";
import { loginUser, resendVerificationEmail } from "@/lib/api";

interface LoginFormState {
  email: string;
  password: string;
  remember: boolean;
}

export default function LoginForm() {
  const router = useRouter();

  const [form, setForm] = useState<LoginFormState>({
    email: "",
    password: "",
    remember: false,
  });
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, type, value, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setShowForgot(false);

    try {
      // loginUser expects (email, password)
      const { access, refresh } = await loginUser(form.email, form.password);

      setTokens(access, refresh, form.remember);

      const payload = JSON.parse(atob(access.split(".")[1]));
      const role: string = payload.role || "student";

      toast.success("Login successful");

      switch (role) {
        case "student":
          router.push("/dashboard/student");
          break;
        case "sitting_head":
          router.push("/dashboard/head");
          break;
        case "overall_head":
          router.push("/dashboard/admin");
          break;
        default:
          router.push("/");
      }
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? (err as { message: string }).message
          : "Login failed";

      if (
        msg.toLowerCase().includes("invalid email or password") ||
        msg.toLowerCase().includes("invalid credentials")
      ) {
        setShowForgot(true);
      }

      if (msg.toLowerCase().includes("not verified")) {
        toast.error("Please verify your email before logging in.");
        toast("Resend verification email?", {
          action: {
            label: "Resend",
            onClick: async () => {
              try {
                await resendVerificationEmail(form.email);
                toast.success("Verification email sent.");
              } catch {
                toast.error("Failed to resend verification.");
              }
            },
          },
        });
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-md mx-auto p-6 border rounded-xl shadow-lg"
    >
      <h2 className="text-2xl font-bold">Login</h2>

      <Input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
      />

      <Input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        required
      />

      {showForgot && (
        <div className="text-right">
          <Link
            href="/reset-password"
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot password?
          </Link>
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Checkbox
          id="remember"
          name="remember"
          checked={form.remember}
          onCheckedChange={(checked) =>
            setForm((prev) => ({ ...prev, remember: !!checked }))
          }
        />
        <label htmlFor="remember" className="text-sm">
          Remember me
        </label>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
}
