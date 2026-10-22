"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { UploadCloud, PlayCircle, ArrowLeft } from "lucide-react";
import { createCourseSchema } from "@/src/schema/course.schema";
import Link from "next/link";

export default function EditCoursePage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [currentThumbnailUrl, setCurrentThumbnailUrl] = useState("");

  const form = useForm<any>({
    resolver: zodResolver(createCourseSchema),
  });

  // جلب بيانات الكورس القديمة
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/courses/${courseId}`);
        const course = res.data.data.course;
        
        // نملأ الفورم بالبيانات القديمة
        form.reset({
          title: course.title,
          subtitle: course.subtitle || "",
          description: course.description,
          category: course.category,
          level: course.level,
          language: course.language || "English",
          price: course.price,
          promoVideo: course.promoVideo || "",
          promotionalPrice: course.promotionalPrice || "",
        });
        setCurrentThumbnailUrl(course.thumbnail);
      } catch (err) {
        toast.error("Failed to load course");
        router.push("/courses");
      } finally {
        setIsLoading(false);
      }
    };

    if (courseId) fetchCourse();
  }, [courseId, form, router]);

  async function onSubmit(values: any) {
    setIsSaving(true);
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      // لو فيه صورة جديدة، نبعتها
      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }

      await api.patch(`/courses/${courseId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Course updated successfully!");
      router.push(`/courses/manage/${courseId}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update course");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) return <div className="text-center py-20">Loading course data...</div>;

  return (
    <div className="w-[80%] mx-auto py-10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft size={18} />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Course</h1>
          <p className="text-gray-500 mt-1">Update your course details and media.</p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Basic Info */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-6">Basic Information</h2>
          <div className="space-y-5">
            <FieldGroup>
              <Controller name="title" control={form.control} render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Course Title <span className="text-red-500">*</span></FieldLabel>
                  <Input {...field} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )} />
            </FieldGroup>
            <FieldGroup>
              <Controller name="description" control={form.control} render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Course Description <span className="text-red-500">*</span></FieldLabel>
                  <textarea {...field} className="flex min-h-30 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )} />
            </FieldGroup>
            <div className="grid grid-cols-2 gap-4">
              <FieldGroup>
                <Controller name="category" control={form.control} render={({ field }) => (
                  <Field><FieldLabel>Category</FieldLabel>
                    <select {...field} className="flex h-10 w-full rounded-md border px-3 py-2 text-sm">
                      <option value="Programming">Programming</option>
                      <option value="Design">Design</option>
                    </select>
                  </Field>
                )} />
              </FieldGroup>
              <FieldGroup>
                <Controller name="price" control={form.control} render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Price ($) <span className="text-red-500">*</span></FieldLabel>
                    <Input type="number" {...field} value={field.value ?? ""} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )} />
              </FieldGroup>
            </div>
          </div>
        </div>

        {/* Media Update */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-6">Course Thumbnail</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <FieldLabel className="mb-2">Current Thumbnail</FieldLabel>
              <img src={currentThumbnailUrl} alt="Thumbnail" className="w-full h-48 object-cover rounded-xl border" />
            </div>
            <div>
              <FieldLabel className="mb-2">Upload New (Optional)</FieldLabel>
              <label className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition h-48">
                <UploadCloud size={32} className="text-gray-400 mb-2" />
                <span className="text-sm font-medium text-gray-700">Click to change image</span>
                {thumbnail && <span className="text-xs text-indigo-600 mt-2 font-semibold">{thumbnail.name}</span>}
                <input type="file" className="hidden" accept="image/*" onChange={(e) => setThumbnail(e.target.files?.[0] || null)} />
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={isSaving} className="bg-indigo-600 px-8">
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}