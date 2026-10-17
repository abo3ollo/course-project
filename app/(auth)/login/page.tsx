"use client";

import { Button } from "@/components/ui/button";
import {
  Field, FieldError, FieldGroup, FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import api from "@/lib/axios";
import { useAuth } from "@/src/context/AuthContext";
import { loginSchema, loginSchemaType } from "@/src/schema/login.schema";


export default function LoginPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // ✅ حالة "الإيميل مش متحقق"
  const [needsVerification, setNeedsVerification] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState("");
  const [isResending, setIsResending] = useState(false);

  const form = useForm<loginSchemaType>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(loginSchema),
  });

  async function handleLogin(values: loginSchemaType) {
    setIsLoading(true);
    setNeedsVerification(false);

    try {
      await api.post("/auth/login", values);
      await refresh();

      toast.success("Logged In Successfully");
      router.push("/");
    } catch (err: any) {
      const status = err?.response?.status;
      const message =
        err?.response?.data?.message || "Something went wrong.";

      if (status === 403) {
        // ✅ الإيميل مش متحقق
        setNeedsVerification(true);
        setUnverifiedEmail(values.email);
        toast.error("Please verify your email first", {
          position: "top-center",
        });
      } else {
        const displayMessage = Array.isArray(message) ? message[0]?.msg : message;
        toast.error(displayMessage, { position: "top-center" });
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResendVerification() {
    setIsResending(true);
    try {
      await api.post("/auth/resend-verification", { email: unverifiedEmail });
      toast.success("Verification email sent! Check your inbox.");
    } catch {
      toast.error("Failed to resend. Try again later.");
    } finally {
      setIsResending(false);
    }
  }

  return (
    <div className="w-[90%] md:w-[50%] mx-auto my-20">
      <h2 className="text-center font-bold text-2xl mb-8">Log in Now!</h2>

      <form className="space-y-6" onSubmit={form.handleSubmit(handleLogin)}>
        {/* Email */}
        <FieldGroup>
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Email</FieldLabel>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  autoComplete="off"
                  type="email"
                  placeholder="ahmed@example.com"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>

        {/* Password */}
        <FieldGroup>
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className="flex items-center justify-between mb-1">
                  <FieldLabel>Password</FieldLabel>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  type="password"
                  placeholder="********"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>

        {/* ✅ لو الإيميل مش متحقق — اعرض زر Resend */}
        {needsVerification && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800 mb-3">
              Your email is not verified. Check your inbox for the verification link.
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={handleResendVerification}
              disabled={isResending}
              className="w-full"
            >
              {isResending ? "Sending..." : "Resend Verification Email"}
            </Button>
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-black text-white"
        >
          {isLoading ? "Logging in..." : "Log In"}
        </Button>

        <p className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}