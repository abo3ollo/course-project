"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

type Status = "loading" | "success" | "error";

export default function VerifyEmailPage() {
    const params = useParams();
    const token = params.token as string;

    const [status, setStatus] = useState<Status>("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("Verification token is missing.");
            return;
        }

        const verify = async () => {
            try {
                const res = await api.get(`/auth/verify-email/${token}`);
                setStatus("success");
                setMessage(res.data.message || "Email verified successfully!");
            } catch (err: any) {
                const msg =
                    err?.response?.data?.message ||
                    "Verification failed. The link may be invalid or expired.";
                setStatus("error");
                setMessage(Array.isArray(msg) ? msg[0]?.msg : msg);
            }
        };

        verify();
    }, [token]);

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 text-center">
                {status === "loading" && (
                    <>
                        <Loader2 className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-spin" />
                        <h1 className="text-2xl font-bold mb-2">Verifying your email</h1>
                        <p className="text-gray-500">Please wait...</p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold mb-2">Email Verified!</h1>
                        <p className="text-gray-600 mb-6">{message}</p>
                        <Link href="/login">
                            <Button className="w-full bg-black text-white">
                                Go to Login
                            </Button>
                        </Link>
                    </>
                )}

                {status === "error" && (
                    <>
                        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold mb-2">Verification Failed</h1>
                        <p className="text-gray-600 mb-6">{message}</p>
                        <div className="flex flex-col gap-2">
                            <Link href="/register">
                                <Button variant="outline" className="w-full">
                                    Register Again
                                </Button>
                            </Link>
                            <Link href="/">
                                <Button variant="ghost" className="w-full">
                                    Go Home
                                </Button>
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}