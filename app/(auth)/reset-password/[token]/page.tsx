"use client";

import { Button } from "@/components/ui/button";
import {
  Field, FieldError, FieldGroup, FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import api from "@/lib/axios";
import { resetPasswordSchema, ResetPasswordSchemaType } from "@/src/schema/auth.schema";


export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ResetPasswordSchemaType>({
    defaultValues: { password: "", confirmPassword: "" },
    resolver: zodResolver(resetPasswordSchema),
  });

  async function handleSubmit(values: ResetPasswordSchemaType) {
    if (!token) {
      toast.error("Invalid reset link.");
      return;
    }

    setIsLoading(true);

    try {
      // نرسل الباسورد بس، مش محتاجين الـ confirmPassword
      await api.patch(`/auth/reset-password/${token}`, {
        password: values.password,
      });

      toast.success("Password reset successfully! Please log in.", {
        position: "top-center",
      });
      
      // نوجهه لصفحة الدخول
      router.push("/login");
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Invalid or expired token.";
      toast.error(Array.isArray(message) ? message[0]?.msg : message, {
        position: "top-center",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-[90%] md:w-[50%] mx-auto my-20">
      <h2 className="text-center font-bold text-2xl mb-2">
        Reset Your Password
      </h2>
      <p className="text-center text-gray-500 mb-8">
        Enter a new password for your account.
      </p>

      <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
        {/* Password */}
        <FieldGroup>
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>New Password</FieldLabel>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  type="password"
                  placeholder="********"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        {/* Confirm Password */}
        <FieldGroup>
          <Controller
            name="confirmPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Confirm New Password</FieldLabel>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  type="password"
                  placeholder="********"
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
          {isLoading ? "Resetting..." : "Reset Password"}
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