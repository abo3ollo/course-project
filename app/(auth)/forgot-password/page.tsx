"use client";

import { Button } from "@/components/ui/button";
import {
  Field, FieldError, FieldGroup, FieldLabel,
} from "@/components/ui/field";
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
      const message =
        err?.response?.data?.message || "Something went wrong. Try again.";
      toast.error(Array.isArray(message) ? message[0]?.msg : message);
    } finally {
      setIsLoading(false);
    }
  }

  // ✅ صفحة النجاح بعد إرسال الإيميل
  if (isSent) {
    return (
      <div className="w-[90%] md:w-[50%] mx-auto my-20 text-center">
        <MailCheck className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Check Your Email</h2>
        <p className="text-gray-600 mb-8">
          If that email exists, we sent a password reset link.
          <br />
          Check your inbox (and spam folder).
        </p>
        <Link href="/login">
          <Button variant="outline" className="w-full md:w-auto">
            Back to Login
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-[90%] md:w-[50%] mx-auto my-20">
      <h2 className="text-center font-bold text-2xl mb-2">
        Forgot Password?
      </h2>
      <p className="text-center text-gray-500 mb-8">
        Enter your email and we'll send you a link to reset your password.
      </p>

      <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
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
                  type="email"
                  placeholder="ahmed@example.com"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-black text-white"
        >
          {isLoading ? "Sending..." : "Send Reset Link"}
        </Button>

        <p className="text-center text-sm">
          Remember your password?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}