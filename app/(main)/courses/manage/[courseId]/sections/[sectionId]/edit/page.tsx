"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UploadCloud, ArrowLeft, Video } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";

export default function EditSectionPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;
  const sectionId = params.sectionId as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [currentVideoUrl, setCurrentVideoUrl] = useState(""); // ✅ لحفظ لينك الفيديو القديم

  const [formData, setFormData] = useState({
    title: "",
    learningObjective: "",
    duration: "",
  });

  useEffect(() => {
    const fetchSection = async () => {
      try {
        const res = await api.get(`/courses/${courseId}`);
        const course = res.data.data.course;
        const section = course.sections.find((s: any) => s._id === sectionId);
        
        if (section) {
          setFormData({
            title: section.title || "",
            learningObjective: section.learningObjective || "",
            duration: section.duration || "",
          });
          setCurrentVideoUrl(section.videoUrl || ""); // ✅ بنحفظ لينك الفيديو الحالي
        }
      } catch (err) {
        toast.error("Failed to load section");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSection();
  }, [courseId, sectionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("learningObjective", formData.learningObjective);
      data.append("duration", formData.duration);
      
      if (videoFile) {
        data.append("video", videoFile);
      }

      await api.patch(`/courses/${courseId}/sections/${sectionId}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Section updated successfully!");
      router.push(`/courses/manage/${courseId}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update section");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="text-center py-20">Loading...</div>;

  return (

    <div className="w-[75%] mx-auto py-10 px-4">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft size={18} />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Section</h1>
          <p className="text-gray-500 mt-1">Update the section details or upload a new video.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border space-y-6">
        <div className="space-y-2">
          <Label>Section Title <span className="text-red-500">*</span></Label>
          <Input 
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="h-12 text-lg"
          />
        </div>

        <div className="space-y-2">
          <Label>Learning Objective</Label>
          <Textarea 
            value={formData.learningObjective}
            onChange={(e) => setFormData({ ...formData, learningObjective: e.target.value })}
            className="min-h-25"
          />
        </div>

        <div className="space-y-2">
          <Label>Duration</Label>
          <Input 
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
          />
        </div>

        {/* ✅ عرض الفيديو الحالي لو موجود */}
        {currentVideoUrl && (
          <div className="border rounded-xl p-4 bg-gray-50">
            <Label className="mb-2 block text-sm font-semibold text-gray-700">Current Video</Label>
            <video 
              src={currentVideoUrl} 
              controls 
              className="w-full max-h-64 object-contain rounded-lg bg-black"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label>Update Video (Optional)</Label>
          <label className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition">
            <UploadCloud size={32} className="text-indigo-500 mb-2" />
            <span className="text-sm font-medium text-indigo-600">
              {videoFile ? videoFile.name : "Click to upload new video (Max 100MB)"}
            </span>
            <input type="file" className="hidden" accept="video/*" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} />
          </label>
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-700 px-8">
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}