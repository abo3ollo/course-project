import { z } from "zod";

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters")
      .max(20, "First name must be at most 20 characters"),

    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters")
      .max(20, "Last name must be at most 20 characters"),

    email: z.string().email("Please enter a valid email"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/\d/, "Password must contain at least one number"),


    role: z.enum(["USER", "INSTRUCTOR"]), 
  })

export type RegisterSchemaType = z.infer<typeof registerSchema>;