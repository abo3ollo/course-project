"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useLanguage } from "@/src/context/LanguageContext";

type Status = "loading" | "success" | "error";

export default function VerifyEmailPage() {
  const { t } = useLanguage();
  const params = useParams();
  const token = params.token as string;

  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage(t("Verification token is missing."));
      return;
    }

    const verify = async () => {
      try {
        const res = await api.get(`/auth/verify-email/${token}`);
        setStatus("success");
        setMessage(res.data.message || t("Email verified successfully!"));
      } catch (err: any) {
        const msg =
          err?.response?.data?.message ||
          t("Verification failed. The link may be invalid or expired.");
        setStatus("error");
        setMessage(Array.isArray(msg) ? msg[0]?.msg : msg);
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-screen bg-obsidian text-bone font-sans flex items-center justify-center px-4 py-20 selection:bg-copper selection:text-white">
      <div className="w-full max-w-md bg-onyx border border-graphite rounded-[10px] p-10 text-center relative overflow-hidden">
        
        {/* Decorative Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-copper/5 rounded-full blur-2xl pointer-events-none"></div>

        {status === "loading" && (
          <>
            <Loader2 className="w-16 h-16 text-copper mx-auto mb-6 animate-spin" />
            <h1 className="font-serif text-3xl text-white mb-2">{t("Verifying Email")}</h1>
            <p className="text-fog">{t("Please wait while we verify your account...")}</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-6" />
            <h1 className="font-serif text-3xl text-white mb-3">{t("Email Verified!")}</h1>
            <p className="text-fog mb-8">{message}</p>
            <Link href="/login">
              <Button className="w-full bg-white text-black hover:bg-gray-200 rounded-full font-medium h-11">
                {t("Go to Login")}
              </Button>
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="w-16 h-16 text-red-400 mx-auto mb-6" />
            <h1 className="font-serif text-3xl text-white mb-3">{t("Verification Failed")}</h1>
            <p className="text-fog mb-8">{message}</p>
            <div className="flex flex-col gap-3">
              <Link href="/register">
                <Button variant="outline" className="w-full border-graphite text-bone hover:bg-carbon rounded-full h-11">
                  {t("Register Again")}
                </Button>
              </Link>
              <Link href="/">
                <Button variant="ghost" className="w-full text-fog hover:text-white rounded-full h-11">
                  {t("Go Home")}
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}