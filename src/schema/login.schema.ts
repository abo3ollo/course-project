import { z } from "zod";

export const loginSchema = z.object({

  email: z.string().email("Please enter  your email"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/\d/, "Password must contain at least one number"),

});

export type loginSchemaType = z.infer<typeof loginSchema>;