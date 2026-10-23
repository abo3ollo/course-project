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
import { UploadCloud, ArrowLeft } from "lucide-react";
import { createCourseSchema } from "@/src/schema/course.schema";

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

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/courses/${courseId}`);
        const course = res.data.data.course;
        
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-copper"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian text-bone font-sans pb-20">
      <div className="w-[80%] mx-auto py-12">
        
        {/* Header */}
        <div className="flex items-center gap-5 mb-10 border-b border-graphite pb-8">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => router.back()} 
            className="border-graphite bg-carbon text-fog hover:text-white hover:bg-graphite rounded-full"
          >
            <ArrowLeft size={18} />
          </Button>
          <div>
            <h1 className="font-serif text-4xl text-white">Edit Course</h1>
            <p className="text-fog mt-2">Update your course details and media.</p>
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Basic Info */}
          <div className="bg-onyx border border-graphite rounded-[10px] p-8">
            <h2 className="font-serif text-2xl text-white mb-6 border-b border-graphite pb-4">Basic Information</h2>
            <div className="space-y-6">
              
              <FieldGroup>
                <Controller name="title" control={form.control} render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="text-bone">Course Title <span className="text-copper">*</span></FieldLabel>
                    <Input {...field} className="bg-carbon border-graphite text-white placeholder:text-steel focus-visible:ring-copper" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )} />
              </FieldGroup>

              <FieldGroup>
                <Controller name="description" control={form.control} render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="text-bone">Course Description <span className="text-copper">*</span></FieldLabel>
                    <textarea {...field} className="flex min-h-30 w-full rounded-md border border-graphite bg-carbon px-3 py-2 text-sm text-white placeholder:text-steel focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-copper" />
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
                        <option value="Programming">Programming</option>
                        <option value="Design">Design</option>
                      </select>
                    </Field>
                  )} />
                </FieldGroup>
                <FieldGroup>
                  <Controller name="price" control={form.control} render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="text-bone">Price ($) <span className="text-copper">*</span></FieldLabel>
                      <Input type="number" {...field} value={field.value ?? ""} className="bg-carbon border-graphite text-white" />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )} />
                </FieldGroup>
              </div>
            </div>
          </div>

          {/* Media Update */}
          <div className="bg-onyx border border-graphite rounded-[10px] p-8">
            <h2 className="font-serif text-2xl text-white mb-6 border-b border-graphite pb-4">Course Thumbnail</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div>
                <FieldLabel className="mb-3 text-fog">Current Thumbnail</FieldLabel>
                <img 
                  src={currentThumbnailUrl} 
                  alt="Thumbnail" 
                  className="w-full h-52 object-cover rounded-[10px] border border-graphite" 
                />
              </div>
              
              <div>
                <FieldLabel className="mb-3 text-bone">Upload New (Optional)</FieldLabel>
                <label className="border-2 border-dashed border-graphite rounded-[10px] p-8 flex flex-col items-center justify-center cursor-pointer hover:border-copper/50 hover:bg-carbon transition h-52 bg-onyx">
                  <UploadCloud size={32} className="text-copper mb-3" />
                  <span className="text-sm font-medium text-white">Click to change image</span>
                  {thumbnail && <span className="text-xs text-copper mt-2 font-semibold">{thumbnail.name}</span>}
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => setThumbnail(e.target.files?.[0] || null)} />
                </label>
              </div>

            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => router.back()} className="border-graphite text-fog hover:text-white rounded-full px-6">
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving} className="bg-white text-black hover:bg-gray-200 rounded-full font-medium px-8">
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}