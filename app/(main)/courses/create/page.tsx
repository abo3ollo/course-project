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
      const newCourseId = res.data.data.course._id;
      router.push(`/courses/manage/${newCourseId}`);
      
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create course");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-obsidian text-bone font-sans pb-20">
      <div className="w-[80%] mx-auto py-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4 border-b border-graphite pb-8">
          <div>
            <h1 className="font-serif text-4xl text-white">Create New Course</h1>
            <p className="text-fog mt-2">Fill in the basic details to publish your new course.</p>
          </div>
          <Button 
            onClick={form.handleSubmit(onSubmit)} 
            disabled={isLoading} 
            className="bg-white text-black hover:bg-gray-200 rounded-full font-medium px-8 h-11"
          >
            {isLoading ? "Creating..." : "Create & Continue"}
          </Button>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* ── Step 1: Basic Info ── */}
          <div className="bg-onyx border border-graphite rounded-[10px] p-8">
            <div className="flex justify-between items-center mb-6 border-b border-graphite pb-4">
              <h2 className="font-serif text-2xl text-white">Basic Information</h2>
              <span className="text-sm font-medium text-fog bg-carbon px-3 py-1 rounded-full border border-graphite">Step 1 of 3</span>
            </div>
            
            <div className="space-y-6">
              <FieldGroup>
                <Controller name="title" control={form.control} render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="text-bone">Course Title <span className="text-copper">*</span></FieldLabel>
                    <Input {...field} placeholder="e.g., Complete React Masterclass" className="bg-carbon border-graphite text-white placeholder:text-steel focus-visible:ring-copper" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )} />
              </FieldGroup>
              
              <FieldGroup>
                <Controller name="subtitle" control={form.control} render={({ field }) => (
                  <Field>
                    <FieldLabel className="text-bone">Short Subtitle / Tagline</FieldLabel>
                    <Input {...field} placeholder="e.g., Master React 18, Redux..." className="bg-carbon border-graphite text-white placeholder:text-steel focus-visible:ring-copper" />
                  </Field>
                )} />
              </FieldGroup>
              
              <FieldGroup>
                <Controller name="description" control={form.control} render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="text-bone">Course Description <span className="text-copper">*</span></FieldLabel>
                    <textarea {...field} className="flex min-h-30 w-full rounded-md border border-graphite bg-carbon px-3 py-2 text-sm text-white placeholder:text-steel focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-copper" placeholder="What will students learn?" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )} />
              </FieldGroup>
              
              <div className="grid grid-cols-2 gap-6">
                <FieldGroup>
                  <Controller name="category" control={form.control} render={({ field }) => (
                    <Field>
                      <FieldLabel className="text-bone">Category</FieldLabel>
                      <select {...field} className="flex h-10 w-full rounded-md border border-graphite bg-carbon px-3 py-2 text-sm text-white focus-visible:ring-1 focus-visible:ring-copper">
                        <option value="">Select Category</option>
                        <option value="Programming">Programming</option>
                        <option value="Design">Design</option>
                      </select>
                    </Field>
                  )} />
                </FieldGroup>
                <FieldGroup>
                  <Controller name="language" control={form.control} render={({ field }) => (
                    <Field>
                      <FieldLabel className="text-bone">Language</FieldLabel>
                      <select {...field} className="flex h-10 w-full rounded-md border border-graphite bg-carbon px-3 py-2 text-sm text-white focus-visible:ring-1 focus-visible:ring-copper">
                        <option value="English">English</option>
                        <option value="Arabic">Arabic</option>
                      </select>
                    </Field>
                  )} />
                </FieldGroup>
              </div>
              
              <div>
                <FieldLabel className="mb-3 block text-bone">Course Level</FieldLabel>
                <div className="grid grid-cols-4 gap-3">
                  {["All Levels", "Beginner", "Intermediate", "Advanced"].map((lvl) => (
                    <label key={lvl} className={`flex items-center justify-center p-3 border rounded-xl cursor-pointer text-sm font-medium transition ${form.watch("level") === lvl ? 'border-copper bg-copper/10 text-copper' : 'border-graphite bg-carbon text-fog hover:bg-graphite'}`}>
                      <input type="radio" value={lvl} {...form.register("level")} className="hidden" />
                      {lvl}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Step 2: Media ── */}
          <div className="bg-onyx border border-graphite rounded-[10px] p-8">
            <div className="flex justify-between items-center mb-6 border-b border-graphite pb-4">
              <h2 className="font-serif text-2xl text-white">Course Media & Assets</h2>
              <span className="text-sm font-medium text-fog bg-carbon px-3 py-1 rounded-full border border-graphite">Step 2 of 3</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <FieldLabel className="mb-2 text-bone">Course Thumbnail <span className="text-copper">*</span></FieldLabel>
                <label className="border-2 border-dashed border-graphite rounded-[10px] p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-carbon transition h-52 bg-onyx">
                  <UploadCloud size={32} className="text-fog mb-3" />
                  <span className="text-sm font-medium text-white">Click to upload image</span>
                  {thumbnail && <span className="text-xs text-copper mt-2 font-semibold">{thumbnail.name}</span>}
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => setThumbnail(e.target.files?.[0] || null)} />
                </label>
              </div>
              <div>
                <FieldLabel className="mb-2 text-bone">Promotional Video (Optional)</FieldLabel>
                <Controller name="promoVideo" control={form.control} render={({ field }) => (
                  <Input {...field} placeholder="https://youtube.com/watch?v=..." className="mb-4 bg-carbon border-graphite text-white placeholder:text-steel" />
                )} />
                <div className="border border-graphite rounded-[10px] h-32 bg-carbon flex flex-col items-center justify-center text-steel">
                  <PlayCircle size={32} className="mb-2" />
                  <span className="text-sm">Video Preview Placeholder</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Step 3: Pricing ── */}
          <div className="bg-onyx border border-graphite rounded-[10px] p-8">
            <div className="flex justify-between items-center mb-6 border-b border-graphite pb-4">
              <h2 className="font-serif text-2xl text-white">Pricing & Enrollment</h2>
              <span className="text-sm font-medium text-fog bg-carbon px-3 py-1 rounded-full border border-graphite">Step 3 of 3</span>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <FieldGroup>
                <Controller name="price" control={form.control} render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="text-bone">Price ($) <span className="text-copper">*</span></FieldLabel>
                    <Input type="number" {...field} value={field.value ?? ""} className="bg-carbon border-graphite text-white" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )} />
              </FieldGroup>
              <FieldGroup>
                <Controller name="promotionalPrice" control={form.control} render={({ field }) => (
                  <Field>
                    <FieldLabel className="text-bone">Promotional Price ($)</FieldLabel>
                    <Input type="number" {...field} value={field.value || ""} className="bg-carbon border-graphite text-white" />
                  </Field>
                )} />
              </FieldGroup>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}