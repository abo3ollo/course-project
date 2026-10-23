"use client";

import { cn } from "@/lib/utils";
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
import { registerSchema, RegisterSchemaType } from "@/src/schema/register.schema";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterSchemaType>({
    defaultValues: { firstName: "", lastName: "", email: "", password: "", role: "USER" },
    resolver: zodResolver(registerSchema),
  });

  async function handleRegister(values: RegisterSchemaType) {
    setIsLoading(true);
    try {
      await api.post("/auth/register", values);
      toast.success("Account created! Check your email to verify.", { position: "top-center" });
      router.push(`/verify-email/pending?email=${encodeURIComponent(values.email)}`);
    } catch (err: any) {
      const message = err?.response?.data?.message || "Something went wrong. Try again.";
      const displayMessage = Array.isArray(message) ? message[0]?.msg : message;
      toast.error(displayMessage, { position: "top-center" });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-obsidian text-bone font-sans flex items-center justify-center py-20 px-4 selection:bg-copper selection:text-white">
      <div className="w-full max-w-md bg-onyx border border-graphite rounded-[10px] p-8 md:p-10 relative overflow-hidden">
        
        <div className="absolute top-0 right-0 w-32 h-32 bg-copper/5 rounded-bl-full pointer-events-none"></div>

        <div className="text-center mb-8">
          <h2 className="font-serif text-3xl text-white mb-2">Create Account</h2>
          <p className="text-sm text-fog">Join the platform to start learning.</p>
        </div>

        <form className="space-y-5" onSubmit={form.handleSubmit(handleRegister)}>
          <div className="grid grid-cols-2 gap-4">
            <FieldGroup>
              <Controller
                name="firstName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="text-bone">First Name</FieldLabel>
                    <Input {...field} placeholder="Ahmed" className="bg-carbon border-graphite text-white placeholder:text-steel focus-visible:ring-copper" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>
            <FieldGroup>
              <Controller
                name="lastName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="text-bone">Last Name</FieldLabel>
                    <Input {...field} placeholder="Ali" className="bg-carbon border-graphite text-white placeholder:text-steel focus-visible:ring-copper" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>
          </div>

          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="text-bone">Email</FieldLabel>
                  <Input {...field} type="email" placeholder="m@example.com" className="bg-carbon border-graphite text-white placeholder:text-steel focus-visible:ring-copper" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>

          <FieldGroup>
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="text-bone">Password</FieldLabel>
                  <Input {...field} type="password" placeholder="********" className="bg-carbon border-graphite text-white placeholder:text-steel focus-visible:ring-copper" />
                  <p className="text-xs text-fog mt-1">Must be at least 8 characters and contain a number.</p>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>

          <FieldGroup>
            <Controller
              name="role"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="text-bone">I am a</FieldLabel>
                  <select {...field} className="w-full h-10 rounded-md border border-graphite bg-carbon px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-copper">
                    <option value="USER">Student</option>
                    <option value="INSTRUCTOR">Instructor</option>
                  </select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>

          <Button type="submit" disabled={isLoading} className="w-full bg-white text-black hover:bg-gray-200 rounded-full font-medium h-11 mt-4">
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>

          <p className="text-center text-sm text-fog mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-copper hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}