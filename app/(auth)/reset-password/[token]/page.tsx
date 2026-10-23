"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
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
      await api.patch(`/auth/reset-password/${token}`, { password: values.password });
      toast.success("Password reset successfully! Please log in.", { position: "top-center" });
      router.push("/login");
    } catch (err: any) {
      const message = err?.response?.data?.message || "Invalid or expired token.";
      toast.error(Array.isArray(message) ? message[0]?.msg : message, { position: "top-center" });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-obsidian text-bone font-sans flex items-center justify-center py-20 px-4 selection:bg-copper selection:text-white">
      <div className="w-full max-w-md bg-onyx border border-graphite rounded-[10px] p-8 md:p-10 relative overflow-hidden">
        
        <div className="absolute top-0 right-0 w-32 h-32 bg-copper/5 rounded-bl-full pointer-events-none"></div>

        <div className="text-center mb-8">
          <h2 className="font-serif text-3xl text-white mb-2">Reset Password</h2>
          <p className="text-sm text-fog">Enter a new password for your account.</p>
        </div>

        <form className="space-y-5" onSubmit={form.handleSubmit(handleSubmit)}>
          <FieldGroup>
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="text-bone">New Password</FieldLabel>
                  <Input {...field} type="password" placeholder="********" className="bg-carbon border-graphite text-white placeholder:text-steel focus-visible:ring-copper" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>

          <FieldGroup>
            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="text-bone">Confirm New Password</FieldLabel>
                  <Input {...field} type="password" placeholder="********" className="bg-carbon border-graphite text-white placeholder:text-steel focus-visible:ring-copper" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>

          <Button type="submit" disabled={isLoading} className="w-full bg-white text-black hover:bg-gray-200 rounded-full font-medium h-11 mt-2">
            {isLoading ? "Resetting..." : "Reset Password"}
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