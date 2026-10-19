"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { createCourseSchema, CreateCourseSchemaType } from "@/src/schema/course.schema";
import { UploadCloud } from "lucide-react";

export default function CreateCoursePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  // ✅ استخدمنا CreateCourseSchemaType عادي (بدون FormInput)
  const form = useForm<CreateCourseSchemaType>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: { level: "Beginner" },
  });

  async function onSubmit(values: CreateCourseSchemaType) {
    if (!thumbnail) {
      toast.error("Please upload a course thumbnail");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("price", values.price.toString()); // هيبقى رقم هنا أصلاً بسبب coerce
      formData.append("category", values.category);
      formData.append("level", values.level);
      formData.append("isPublished", "true");
      formData.append("thumbnail", thumbnail);

      await api.post("/courses", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Course created successfully!");
      router.push("/courses");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create course");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold mb-6">Create New Course</h1>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* Title & Description */}
          <FieldGroup>
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Course Title</FieldLabel>
                  <Input {...field} placeholder="e.g., Complete React Masterclass" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>

          <FieldGroup>
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Description</FieldLabel>
                  <textarea
                    {...field}
                    className="flex min-h-25 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="What will students learn in this course?"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>

          <div className="grid grid-cols-2 gap-4">
            <FieldGroup>
              <Controller
                name="price"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Price ($)</FieldLabel>
                    {/* ✅ بنستخدم value={field.value || ""} عشان ما يظهرش NaN */}
                    <Input 
                      type="number" 
                      {...field}
                      value={field.value || ""}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>

            <FieldGroup>
              <Controller
                name="category"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Category</FieldLabel>
                    <Input {...field} placeholder="e.g., Programming" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>
          </div>

          {/* Level */}
          <FieldGroup>
            <Controller
              name="level"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Course Level</FieldLabel>
                  <select
                    {...field}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>

          {/* Thumbnail */}
          <FieldGroup>
            <FieldLabel>Course Thumbnail</FieldLabel>
            <label className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition">
              <UploadCloud size={32} className="text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">
                {thumbnail ? thumbnail.name : "Click to upload image"}
              </span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
              />
            </label>
          </FieldGroup>

          <Button type="submit" disabled={isLoading} className="w-full bg-indigo-600">
            {isLoading ? "Creating..." : "Create Course"}
          </Button>
        </form>
      </div>
    </div>
  );
}