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
    <div className="w-full max-w-md bg-onyx border border-graphite rounded-[10px] p-10 text-center relative overflow-hidden">
      
      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-copper/5 rounded-full blur-2xl pointer-events-none"></div>

      <Mail className="w-16 h-16 text-copper mx-auto mb-6" />
      <h1 className="font-serif text-3xl text-white mb-3">Verify Your Email</h1>
      <p className="text-fog mb-8">
        We sent a verification link to{" "}
        <strong className="text-white font-medium">{email || "your email"}</strong>.
        <br />
        Click the link in the email to activate your account.
      </p>

      {sent ? (
        <div className="p-4 bg-green-400/10 border border-green-400/30 rounded-[10px] flex items-center justify-center gap-3 text-green-400">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span className="text-sm font-medium">Email sent! Check your inbox.</span>
        </div>
      ) : (
        <Button
          onClick={handleResend}
          disabled={isResending}
          className="w-full bg-white text-black hover:bg-gray-200 rounded-full font-medium h-11"
        >
          {isResending ? "Sending..." : "Resend Email"}
        </Button>
      )}

      <div className="mt-8 pt-6 border-t border-graphite text-sm text-fog">
        Already verified?{" "}
        <Link href="/login" className="text-copper hover:underline">
          Login
        </Link>
      </div>
    </div>
  );
}

export default function PendingPage() {
  return (
    <div className="min-h-screen bg-obsidian text-bone font-sans flex items-center justify-center px-4 py-20 selection:bg-copper selection:text-white">
      <Suspense fallback={<div className="text-copper animate-pulse font-serif text-xl">Loading...</div>}>
        <PendingContent />
      </Suspense>
    </div>
  );
}