import { z } from "zod";

export const createCourseSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  subtitle: z.string().optional(),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.string().min(2, "Category is required"),
  level: z.enum(["All Levels", "Beginner", "Intermediate", "Advanced"]),
  price: z.number({ error: "Price is required" }).min(0, "Price must be positive"),
  promotionalPrice: z.number().min(0, "Price must be positive").optional(),
  language: z.string().min(1, "Language is required"),
  promoVideo: z.string().optional(),
});

export type CreateCourseSchemaType = z.infer<typeof createCourseSchema>;