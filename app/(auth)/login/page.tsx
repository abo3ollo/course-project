"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
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
      const message = err?.response?.data?.message || "Something went wrong.";

      if (status === 403) {
        setNeedsVerification(true);
        setUnverifiedEmail(values.email);
        toast.error("Please verify your email first", { position: "top-center" });
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
    <div className="min-h-screen bg-obsidian text-bone font-sans flex items-center justify-center py-20 px-4 selection:bg-copper selection:text-white">
      <div className="w-full max-w-md bg-onyx border border-graphite rounded-[10px] p-8 md:p-10 relative overflow-hidden">
        
        {/* Decorative Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-copper/5 rounded-bl-full pointer-events-none"></div>

        <div className="text-center mb-8">
          <h2 className="font-serif text-3xl text-white mb-2">Log in</h2>
          <p className="text-sm text-fog">Welcome back. Enter your details to continue.</p>
        </div>

        <form className="space-y-5" onSubmit={form.handleSubmit(handleLogin)}>
          {/* Email */}
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="text-bone">Email</FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                    type="email"
                    placeholder="ahmed@example.com"
                    className="bg-carbon border-graphite text-white placeholder:text-steel focus-visible:ring-copper"
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
                    <FieldLabel className="text-bone">Password</FieldLabel>
                    <Link href="/forgot-password" className="text-xs text-copper hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    type="password"
                    placeholder="********"
                    className="bg-carbon border-graphite text-white placeholder:text-steel focus-visible:ring-copper"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>

          {/* Resend Verification */}
          {needsVerification && (
            <div className="p-4 bg-copper/10 border border-copper/30 rounded-[10px]">
              <p className="text-sm text-copper mb-3">
                Your email is not verified. Check your inbox for the verification link.
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={handleResendVerification}
                disabled={isResending}
                className="w-full border-copper/50 text-copper hover:bg-copper/20 hover:text-copper rounded-full"
              >
                {isResending ? "Sending..." : "Resend Verification Email"}
              </Button>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-black hover:bg-gray-200 rounded-full font-medium h-11 mt-2"
          >
            {isLoading ? "Logging in..." : "Log In"}
          </Button>

          <p className="text-center text-sm text-fog mt-4">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-copper hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}