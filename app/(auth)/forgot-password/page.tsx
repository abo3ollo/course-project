"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Link from "next/link";
import { useState } from "react";
import { MailCheck } from "lucide-react";
import api from "@/lib/axios";
import { forgotPasswordSchema, ForgotPasswordSchemaType } from "@/src/schema/auth.schema";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const form = useForm<ForgotPasswordSchemaType>({
    defaultValues: { email: "" },
    resolver: zodResolver(forgotPasswordSchema),
  });

  async function handleSubmit(values: ForgotPasswordSchemaType) {
    setIsLoading(true);
    try {
      await api.post("/auth/forgot-password", values);
      setIsSent(true);
    } catch (err: any) {
      const message = err?.response?.data?.message || "Something went wrong. Try again.";
      toast.error(Array.isArray(message) ? message[0]?.msg : message);
    } finally {
      setIsLoading(false);
    }
  }

  if (isSent) {
    return (
      <div className="min-h-screen bg-obsidian text-bone flex items-center justify-center py-20 px-4">
        <div className="w-full max-w-md bg-onyx border border-graphite rounded-[10px] p-10 text-center">
          <MailCheck className="w-16 h-16 text-copper mx-auto mb-6" />
          <h2 className="font-serif text-3xl text-white mb-4">Check Your Email</h2>
          <p className="text-fog mb-8">
            If that email exists, we sent a password reset link.
            <br />Check your inbox (and spam folder).
          </p>
          <Link href="/login">
            <Button variant="outline" className="w-full border-graphite text-white hover:bg-carbon rounded-full">
              Back to Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian text-bone font-sans flex items-center justify-center py-20 px-4 selection:bg-copper selection:text-white">
      <div className="w-full max-w-md bg-onyx border border-graphite rounded-[10px] p-8 md:p-10">
        <div className="text-center mb-8">
          <h2 className="font-serif text-3xl text-white mb-2">Forgot Password</h2>
          <p className="text-sm text-fog">Enter your email and we'll send you a reset link.</p>
        </div>

        <form className="space-y-5" onSubmit={form.handleSubmit(handleSubmit)}>
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="text-bone">Email</FieldLabel>
                  <Input {...field} type="email" placeholder="ahmed@example.com" className="bg-carbon border-graphite text-white placeholder:text-steel focus-visible:ring-copper" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>

          <Button type="submit" disabled={isLoading} className="w-full bg-white text-black hover:bg-gray-200 rounded-full font-medium h-11 mt-2">
            {isLoading ? "Sending..." : "Send Reset Link"}
          </Button>

          <p className="text-center text-sm text-fog mt-4">
            Remember your password?{" "}
            <Link href="/login" className="text-copper hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}