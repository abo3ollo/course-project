import { z } from "zod";


export const sectionSchema = z.object({
  title: z.string().min(3, "Section title is required"),
  learningObjective: z.string().optional(),
  introVideoTitle: z.string().optional(),
  duration: z.string().optional(),
  videoUrl: z.string().optional(),
  isFreePreview: z.boolean().default(false),
  isDraft: z.boolean().default(true),
  lessons: z.array(z.any()).optional(),
});

export const createCourseSchema = z.object({
  title: z.string().min(5, "Title is too short"),
  subtitle: z.string().optional(),
  description: z.string().min(20, "Description is too short"),
  category: z.string().min(2, "Category is required"),
  level: z.enum(["All Levels", "Beginner", "Intermediate", "Advanced"]),
  
  // ✅ الحل: نحول القيمة لرقم الأول (سواء جت string أو number)
  price: z.preprocess(
    (val) => Number(val),
    z.number().min(0, "Price is required")
  ),
  promotionalPrice: z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : Number(val)),
    z.number().optional()
  ),
  
  language: z.string().min(1, "Language is required"),
  promoVideo: z.string().optional(),
  sections: z.array(sectionSchema).optional()
});

export type CreateCourseSchemaType = z.infer<typeof createCourseSchema>;