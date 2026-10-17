"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import api from "@/lib/axios";
import { registerSchema, RegisterSchemaType } from "@/src/schema/register.schema";


export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterSchemaType>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "USER",
    },
    resolver: zodResolver(registerSchema),
  });

  const { handleSubmit } = form;

  async function handleRegister(values: RegisterSchemaType) {
    setIsLoading(true);

    try {
      await api.post("/auth/register", values);

      toast.success("Account created! Check your email to verify.", {
        position: "top-center",
      });

      router.push(
      `/verify-email/pending?email=${encodeURIComponent(values.email)}`
    );
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Something went wrong. Try again.";

      const displayMessage = Array.isArray(message)
        ? message[0]?.msg
        : message;

      toast.error(displayMessage, { position: "top-center" });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      className={cn("flex flex-col gap-6 w-full max-w-md mx-auto my-10")}
      onSubmit={handleSubmit(handleRegister)}
    >
      <FieldGroup>
        {/* Header */}
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Fill in the form below to create your account
          </p>
        </div>

        {/* First Name */}
        <Controller
          name="firstName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="firstName">First Name</FieldLabel>
              <Input
                {...field}
                id="firstName"
                type="text"
                placeholder="Ahmed"
                autoComplete="off"
                aria-invalid={fieldState.invalid}
                className="bg-background"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        {/* Last Name */}
        <Controller
          name="lastName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
              <Input
                {...field}
                id="lastName"
                type="text"
                placeholder="Ali"
                autoComplete="off"
                aria-invalid={fieldState.invalid}
                className="bg-background"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        {/* Email */}
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                {...field}
                id="email"
                type="email"
                placeholder="m@example.com"
                autoComplete="off"
                aria-invalid={fieldState.invalid}
                className="bg-background"
              />
              <p className="text-sm text-muted-foreground">
                We&apos;ll use this to contact you.
              </p>
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        {/* Password */}
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                {...field}
                id="password"
                type="password"
                aria-invalid={fieldState.invalid}
                className="bg-background"
              />
              <p className="text-sm text-muted-foreground">
                Must be at least 8 characters long and contain a number.
              </p>
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        {/* Role — Native select (بديل شغال) */}
        <Controller
          name="role"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="role">I am a</FieldLabel>
              <select
                {...field}
                id="role"
                aria-invalid={fieldState.invalid}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="USER">Student</option>
                <option value="INSTRUCTOR">Instructor</option>
              </select>
              <p className="text-sm text-muted-foreground">
                Choose how you want to use the platform.
              </p>
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        {/* Submit */}
        <Field>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>
        </Field>

        {/* Login Link */}
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </FieldGroup>
    </form>
  );
}