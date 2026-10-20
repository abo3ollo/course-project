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
import { UploadCloud, PlayCircle } from "lucide-react";
import { createCourseSchema } from "@/src/schema/course.schema";

export default function CreateCoursePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const form = useForm<any>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      description: "",
      category: "",
      level: "Beginner",
      language: "English",
      price: "",
      promoVideo: "",
      promotionalPrice: "",
    },
  });

  async function onSubmit(values: any) {
    if (!thumbnail) {
      toast.error("Please upload a course thumbnail");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });
      
      formData.append("isPublished", "true");
      formData.append("thumbnail", thumbnail);

      const res = await api.post("/courses", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Course created! Let's add sections.");
      
      // ✅ بنوجهه لصفحة إدارة الكورس عشان يضيف أقسام
      const newCourseId = res.data.data.course._id;
      router.push(`/courses/manage/${newCourseId}`);
      
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create course");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-[75%] mx-auto py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Course</h1>
          <p className="text-gray-500 mt-1">Fill in the basic details to publish your new course.</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isLoading} className="bg-indigo-600">
            {isLoading ? "Creating..." : "Create & Continue"}
          </Button>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* ── Step 1: Basic Info ── */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Basic Information</h2>
            <span className="text-sm text-gray-400 bg-gray-50 px-3 py-1 rounded-full">Step 1 of 3</span>
          </div>
          <div className="space-y-5">
            <FieldGroup>
              <Controller name="title" control={form.control} render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Course Title <span className="text-red-500">*</span></FieldLabel>
                  <Input {...field} placeholder="e.g., Complete React Masterclass" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )} />
            </FieldGroup>
            <FieldGroup>
              <Controller name="subtitle" control={form.control} render={({ field }) => (
                <Field><FieldLabel>Short Subtitle / Tagline</FieldLabel><Input {...field} placeholder="e.g., Master React 18, Redux..." /></Field>
              )} />
            </FieldGroup>
            <FieldGroup>
              <Controller name="description" control={form.control} render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Course Description <span className="text-red-500">*</span></FieldLabel>
                  <textarea {...field} className="flex min-h-25 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="What will students learn?" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )} />
            </FieldGroup>
            <div className="grid grid-cols-2 gap-4">
              <FieldGroup>
                <Controller name="category" control={form.control} render={({ field }) => (
                  <Field><FieldLabel>Category</FieldLabel>
                    <select {...field} className="flex h-10 w-full rounded-md border px-3 py-2 text-sm">
                      <option value="">Select Category</option>
                      <option value="Programming">Programming</option>
                      <option value="Design">Design</option>
                    </select>
                  </Field>
                )} />
              </FieldGroup>
              <FieldGroup>
                <Controller name="language" control={form.control} render={({ field }) => (
                  <Field><FieldLabel>Language</FieldLabel>
                    <select {...field} className="flex h-10 w-full rounded-md border px-3 py-2 text-sm">
                      <option value="English">English</option>
                      <option value="Arabic">Arabic</option>
                    </select>
                  </Field>
                )} />
              </FieldGroup>
            </div>
            <div>
              <FieldLabel className="mb-3 block">Course Level</FieldLabel>
              <div className="grid grid-cols-4 gap-3">
                {["All Levels", "Beginner", "Intermediate", "Advanced"].map((lvl) => (
                  <label key={lvl} className={`flex items-center justify-center p-3 border rounded-xl cursor-pointer text-sm font-medium transition ${form.watch("level") === lvl ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <input type="radio" value={lvl} {...form.register("level")} className="hidden" />
                    {lvl}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Step 2: Media ── */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Course Media & Assets</h2>
            <span className="text-sm text-gray-400 bg-gray-50 px-3 py-1 rounded-full">Step 2 of 3</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <FieldLabel className="mb-2">Course Thumbnail <span className="text-red-500">*</span></FieldLabel>
              <label className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition h-48">
                <UploadCloud size={32} className="text-gray-400 mb-2" />
                <span className="text-sm font-medium text-gray-700">Click to upload image</span>
                {thumbnail && <span className="text-xs text-indigo-600 mt-2 font-semibold">{thumbnail.name}</span>}
                <input type="file" className="hidden" accept="image/*" onChange={(e) => setThumbnail(e.target.files?.[0] || null)} />
              </label>
            </div>
            <div>
              <FieldLabel className="mb-2">Promotional Video (Optional)</FieldLabel>
              <Controller name="promoVideo" control={form.control} render={({ field }) => (
                <Input {...field} placeholder="https://youtube.com/watch?v=..." className="mb-4" />
              )} />
              <div className="border rounded-xl h-32 bg-gray-50 flex flex-col items-center justify-center text-gray-400">
                <PlayCircle size={32} className="mb-2" />
                <span className="text-sm">Video Preview Placeholder</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Step 3: Pricing ── */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Pricing & Enrollment</h2>
            <span className="text-sm text-gray-400 bg-gray-50 px-3 py-1 rounded-full">Step 3 of 3</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FieldGroup>
              <Controller name="price" control={form.control} render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Price ($) <span className="text-red-500">*</span></FieldLabel>
                  <Input type="number" {...field} value={field.value ?? ""} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )} />
            </FieldGroup>
            <FieldGroup>
              <Controller name="promotionalPrice" control={form.control} render={({ field }) => (
                <Field><FieldLabel>Promotional Price ($)</FieldLabel><Input type="number" {...field} value={field.value || ""} /></Field>
              )} />
            </FieldGroup>
          </div>
        </div>

      </form>
    </div>
  );
}