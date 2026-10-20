"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { UploadCloud, CheckCircle2, ChevronRight, PlayCircle } from "lucide-react";
import { createCourseSchema, CreateCourseSchemaType } from "@/src/schema/course.schema";

export default function CreateCoursePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const form = useForm<CreateCourseSchemaType>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: { level: "Beginner", language: "English", price: 0 },
  });

  async function onSubmit(values: CreateCourseSchemaType) {
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
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Course</h1>
          <p className="text-gray-500 mt-1">Fill in the details to publish your new course.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">Save Draft</Button>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isLoading} className="bg-indigo-600">
            {isLoading ? "Publishing..." : "Publish Course"}
          </Button>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        
        {/* ── Step 1: Basic Info ── */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Basic Information</h2>
            <span className="text-sm text-gray-400 bg-gray-50 px-3 py-1 rounded-full">Step 1 of 4</span>
          </div>

          <div className="space-y-5">
            <FieldGroup>
              <Controller name="title" control={form.control} render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Course Title <span className="text-red-500">*</span></FieldLabel>
                  <Input {...field} placeholder="e.g., Complete React Masterclass: From Zero to Full-Stack" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )} />
            </FieldGroup>

            <FieldGroup>
              <Controller name="subtitle" control={form.control} render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Short Subtitle / Tagline</FieldLabel>
                  <Input {...field} placeholder="e.g., Master React 18, Redux Toolkit, Tailwind CSS..." />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )} />
            </FieldGroup>

            <FieldGroup>
              <Controller name="description" control={form.control} render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Course Description <span className="text-red-500">*</span></FieldLabel>
                  <textarea {...field} className="flex min-h-30 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="What will students learn in this course?" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )} />
            </FieldGroup>

            <div className="grid grid-cols-2 gap-4">
              <FieldGroup>
                <Controller name="category" control={form.control} render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Category <span className="text-red-500">*</span></FieldLabel>
                    <select {...field} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option value="">Select Category</option>
                      <option value="Programming">Programming</option>
                      <option value="Design">Design</option>
                      <option value="Business">Business</option>
                    </select>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )} />
              </FieldGroup>

              <FieldGroup>
                <Controller name="language" control={form.control} render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Language</FieldLabel>
                    <select {...field} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option value="English">English</option>
                      <option value="Arabic">Arabic</option>
                    </select>
                  </Field>
                )} />
              </FieldGroup>
            </div>

            {/* Level Radios */}
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
            <span className="text-sm text-gray-400 bg-gray-50 px-3 py-1 rounded-full">Step 2 of 4</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <FieldLabel className="mb-2">Course Thumbnail <span className="text-red-500">*</span></FieldLabel>
              <label className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition h-48">
                <UploadCloud size={32} className="text-gray-400 mb-2" />
                <span className="text-sm font-medium text-gray-700">Click to upload image</span>
                <span className="text-xs text-gray-500 mt-1">16:9 ratio • Min 1280x720 • Max 5MB</span>
                {thumbnail && <span className="text-xs text-indigo-600 mt-2 font-semibold">{thumbnail.name}</span>}
                <input type="file" className="hidden" accept="image/*" onChange={(e) => setThumbnail(e.target.files?.[0] || null)} />
              </label>
            </div>

            <div>
              <FieldLabel className="mb-2">Promotional Video (Optional)</FieldLabel>
              <Controller name="promoVideo" control={form.control} render={({ field }) => (
                <Input {...field} placeholder="https://youtube.com/watch?v=... or Vimeo" className="mb-4" />
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
            <span className="text-sm text-gray-400 bg-gray-50 px-3 py-1 rounded-full">Step 3 of 4</span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <FieldGroup>
              <Controller name="price" control={form.control} render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Price ($) <span className="text-red-500">*</span></FieldLabel>
                  <Input type="number" {...field} value={field.value || ""} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )} />
            </FieldGroup>

            <FieldGroup>
              <Controller name="promotionalPrice" control={form.control} render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Promotional Price ($)</FieldLabel>
                  <Input type="number" {...field} value={field.value || ""} />
                  <span className="text-xs text-gray-400">Optional temporary launch pricing.</span>
                </Field>
              )} />
            </FieldGroup>
          </div>

          <div className="p-4 border rounded-xl flex items-start gap-3 bg-indigo-50/50">
            <input type="checkbox" className="mt-1 w-4 h-4 text-indigo-600 rounded" />
            <div>
              <p className="text-sm font-semibold text-gray-900">Certificate of Completion</p>
              <p className="text-xs text-gray-500">Auto-generate verified certificate for graduates.</p>
            </div>
          </div>
        </div>

        {/* ── Step 4: Curriculum ── */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold">Curriculum Structure Preview</h2>
              <p className="text-sm text-gray-500">Organize your course into structured sections and lectures.</p>
            </div>
            <Button type="button" variant="outline" className="text-indigo-600 border-indigo-200">+ Add Section</Button>
          </div>

          {/* Mockup Section */}
          <div className="border rounded-xl p-4 bg-gray-50 flex justify-between items-center mb-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white border rounded flex items-center justify-center font-bold text-sm">1</div>
              <div>
                <p className="font-semibold text-sm">Section 1: Course Introduction & Environment Setup</p>
                <p className="text-xs text-gray-500">3 lectures • 24 minutes total</p>
              </div>
            </div>
          </div>
          
          <button type="button" className="w-full py-4 border-2 border-dashed rounded-xl text-sm text-gray-500 hover:bg-gray-50 flex justify-center items-center gap-2">
            + Add new section or module
          </button>
        </div>

      </form>
    </div>
  );
}