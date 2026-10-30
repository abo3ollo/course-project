"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UploadCloud, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";
import { useLanguage } from "@/src/context/LanguageContext";

export default function EditSectionPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;
  const sectionId = params.sectionId as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");

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
          setCurrentVideoUrl(section.videoUrl || "");
        }
      } catch (err) {
        toast.error(t("Failed to load section"));
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

      toast.success(t("Section updated successfully!"));
      router.push(`/courses/manage/${courseId}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || t("Failed to update section"));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-copper"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian text-bone font-sans pb-20">
      <div className="w-[80%] max-w-4xl mx-auto py-12">
        
        {/* Header */}
        <div className="flex items-center gap-5 mb-10">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => router.back()} 
            className="border-graphite bg-carbon text-fog hover:text-white hover:bg-graphite rounded-full"
          >
            <ArrowLeft size={18} />
          </Button>
          <div>
            <h1 className="font-serif text-3xl text-white">{t("Edit Section")}</h1>
            <p className="text-fog mt-1">{t("Update the section details or upload a new video.")}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-onyx border border-graphite rounded-[10px] p-8 space-y-8">
          
          <div className="space-y-2">
            <Label className="text-bone text-base">{t("Section Title")} <span className="text-copper">*</span></Label>
            <Input 
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="h-12 text-lg bg-carbon border-graphite text-white placeholder:text-steel focus-visible:ring-copper"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-bone text-base">{t("Learning Objective")}</Label>
            <Textarea 
              value={formData.learningObjective}
              onChange={(e) => setFormData({ ...formData, learningObjective: e.target.value })}
              className="min-h-25 bg-carbon border-graphite text-white placeholder:text-steel focus-visible:ring-copper"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-bone text-base">{t("Duration")}</Label>
            <Input 
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="bg-carbon border-graphite text-white placeholder:text-steel focus-visible:ring-copper"
            />
          </div>

          {/* Current Video */}
          {currentVideoUrl && (
            <div className="border border-graphite rounded-[10px] p-5 bg-carbon">
              <Label className="mb-3 block text-sm font-semibold text-fog">{t("Current Video")}</Label>
              <video 
                src={currentVideoUrl} 
                controls 
                className="w-full max-h-72 object-contain rounded-lg bg-black border border-graphite"
              />
            </div>
          )}

          {/* Upload New Video */}
          <div className="space-y-2">
            <Label className="text-bone text-base">{t("Update Video (Optional)")}</Label>
            <label className="border-2 border-dashed border-graphite rounded-[10px] p-10 flex flex-col items-center justify-center bg-onyx cursor-pointer hover:border-copper/50 transition">
              <div className="bg-carbon p-4 rounded-full mb-4 border border-graphite">
                <UploadCloud size={32} className="text-copper" />
              </div>
              <span className="text-sm font-medium text-white">
                {videoFile ? videoFile.name : t("Click to upload new video (Max 100MB)")}
              </span>
              <input type="file" className="hidden" accept="video/*" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} />
            </label>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-graphite">
            <Button type="button" variant="outline" onClick={() => router.back()} className="border-graphite text-fog hover:text-white rounded-full px-6">
              {t("Cancel")}
            </Button>
            <Button type="submit" disabled={isSaving} className="bg-white text-black hover:bg-gray-200 rounded-full font-medium px-8">
              {isSaving ? t("Saving...") : t("Save Changes")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}