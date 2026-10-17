"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import api from "@/lib/axios";

function PendingContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [isResending, setIsResending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleResend() {
    if (!email) {
      toast.error("Email is missing");
      return;
    }

    setIsResending(true);
    try {
      await api.post("/auth/resend-verification", { email });
      setSent(true);
      toast.success("Verification email sent!");
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to send";
      toast.error(Array.isArray(msg) ? msg[0]?.msg : msg);
    } finally {
      setIsResending(false);
    }
  }

  return (
    <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 text-center">
      <Mail className="w-16 h-16 text-blue-500 mx-auto mb-4" />
      <h1 className="text-2xl font-bold mb-2">Verify Your Email</h1>
      <p className="text-gray-600 mb-6">
        We sent a verification link to{" "}
        <strong>{email || "your email"}</strong>.
        <br />
        Click the link in the email to activate your account.
      </p>

      {sent ? (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-800">
          <CheckCircle className="w-5 h-5" />
          <span className="text-sm">Email sent! Check your inbox.</span>
        </div>
      ) : (
        <Button
          onClick={handleResend}
          disabled={isResending}
          className="w-full"
        >
          {isResending ? "Sending..." : "Resend Email"}
        </Button>
      )}

      <div className="mt-6 text-sm text-gray-500">
        Already verified?{" "}
        <Link href="/login" className="text-blue-600 hover:underline">
          Login
        </Link>
      </div>
    </div>
  );
}

export default function PendingPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <Suspense fallback={<div className="text-gray-500">Loading...</div>}>
        <PendingContent />
      </Suspense>
    </div>
  );
}