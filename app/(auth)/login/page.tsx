"use client";

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
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import Link from "next/link";
import { useState } from "react";
import { loginSchema, loginSchemaType } from "@/src/schema/login.schema";
import { useAuth } from "@/src/context/AuthContext";


export default function LoginPage() {
  const router = useRouter();
  const { setAuthenticatedUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<loginSchemaType>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  const { handleSubmit } = form;

  async function handleLogin(values: loginSchemaType) {
    setIsLoading(true);

    // نشيل rePassword قبل ما نبعتها للـ Backend
    const { ...payload } = values;

    try {
      const res = await api.post("/auth/login", payload);

      const { user } = res.data.data;
      setAuthenticatedUser(user);

      toast.success("Logged In Successfully ", {
        position: "top-center",
      });
      router.push("/");
      router.refresh(); 
      
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Something went wrong. Try again.";

      // لو الـ message array (زي الـ validators)، ناخد أول واحدة
      const displayMessage = Array.isArray(message) ? message[0]?.msg : message;

      toast.error(displayMessage, { position: "top-center" });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-[90%] md:w-[50%] mx-auto my-20">
      <h2 className="text-center font-bold text-2xl mb-8">Log in Now!</h2>

      <form className="space-y-6" onSubmit={handleSubmit(handleLogin)}>
        
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
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
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
                <FieldLabel>Password</FieldLabel>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  autoComplete="off"
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
          {isLoading ? "Creating account..." : "Log In "}
        </Button>

        <p className="text-center text-sm">
          Don't have an account?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            SignUp
          </Link>
        </p>
      </form>
    </div>
  );
}