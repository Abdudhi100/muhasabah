// app/verify-email/[uid]/[token]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

type Props = {
  params: {
    uid: string;
    token: string;
  };
};

export default function VerifyEmailPage({ params }: Props) {
  const { uid, token } = params;
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    async function verifyEmail() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/accounts/verify-email/?uid=${uid}&token=${token}`
        );

        const data = await res.json();

        if (res.ok) {
          toast.success("Email verified successfully!");
          setStatus("success");

          // Redirect after short delay
          setTimeout(() => {
            router.push("/login");
          }, 3000);
        } else {
          toast.error(data?.error || "Verification failed.");
          setStatus("error");
        }
      } catch (err) {
        console.error("Verification error:", err);
        toast.error("Network error. Please try again.");
        setStatus("error");
      }
    }

    verifyEmail();
  }, [uid, token, router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center space-y-4 bg-gray-50 px-4">
      {status === "loading" && (
        <>
          <Loader2 className="animate-spin h-10 w-10 text-blue-500" />
          <p className="text-gray-700">Verifying your email...</p>
        </>
      )}

      {status === "success" && (
        <>
          <CheckCircle className="h-10 w-10 text-green-500" />
          <p className="text-green-600 font-medium">
            Email verified! Redirecting to login...
          </p>
        </>
      )}

      {status === "error" && (
        <>
          <XCircle className="h-10 w-10 text-red-500" />
          <p className="text-red-600 font-medium">
            Verification failed. Token may be invalid or expired.
          </p>
        </>
      )}
    </main>
  );
}
