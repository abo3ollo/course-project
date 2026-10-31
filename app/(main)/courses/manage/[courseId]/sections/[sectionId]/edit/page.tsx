"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, UploadCloud, Video } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";
import { useLanguage } from "@/src/context/LanguageContext";
import * as tus from "tus-js-client"; // ✅ استيراد مكتبة الرفع

export default function EditSectionPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;
  const sectionId = params.sectionId as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // ✅ States للفيديو الجديد
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [newVideoId, setNewVideoId] = useState<string | null>(null);

  // ✅ State للفيديو الحالي
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);

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
          // ✅ بنحفظ الـ videoId الحالي عشان نعرضه
          setCurrentVideoId(section.videoId || null);
        }
      } catch (err) {
        toast.error(t("Failed to load section"));
      } finally {
        setIsLoading(false);
      }
    };
    fetchSection();
  }, [courseId, sectionId, t]);

  // ✅ دالة رفع الفيديو لـ Bunny
  const uploadVideoToBunny = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    setNewVideoId(null);

    try {
      const res = await api.post("/courses/bunny-upload-signature", { title: file.name });
      const { videoId, libraryId, signature, expirationTime } = res.data.data;

      const upload = new tus.Upload(file, {
        endpoint: "https://video.bunnycdn.com/tusupload",
        retryDelays: [0, 3000, 5000, 10000],
        headers: {
          AuthorizationSignature: signature,
          AuthorizationExpire: expirationTime.toString(),
          VideoId: videoId,
          LibraryId: libraryId,
        },
        metadata: {
          filetype: file.type,
          title: file.name,
        },
        onError: (error) => {
          console.error("Upload failed:", error);
          toast.error(t("Failed to upload video to Bunny"));
          setIsUploading(false);
        },
        onProgress: (bytesUploaded, bytesTotal) => {
          const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
          setUploadProgress(Number(percentage));
        },
        onSuccess: () => {
          toast.success(t("Video uploaded successfully!"));
          setNewVideoId(videoId);
          setIsUploading(false);
          setUploadProgress(100);
        },
      });

      upload.start();
    } catch (err: any) {
      toast.error(t("Failed to get upload signature"));
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      uploadVideoToBunny(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // ✅ بنبعت البيانات كـ JSON (مفيش ملفات هنا لأن الرفع اتعمل مباشرة لـ Bunny)
      const payload: any = {
        title: formData.title,
        learningObjective: formData.learningObjective,
        duration: formData.duration,
      };

      // لو فيه فيديو جديد اترفع، بنبعت الـ videoId الجديد
      if (newVideoId) {
        payload.videoId = newVideoId;
      }

      await api.patch(`/courses/${courseId}/sections/${sectionId}`, payload);

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

          {/* ✅ عرض الفيديو الحالي (لو موجود ومفيش فيديو جديد اترفع) */}
          {currentVideoId && !newVideoId && (
            <div className="border border-graphite rounded-[10px] p-5 bg-carbon">
              <Label className="mb-3 block text-sm font-semibold text-fog">{t("Current Video")}</Label>
              <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
                <iframe
                  src={`https://iframe.mediadelivery.net/embed/${process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID}/${currentVideoId}`}
                  loading="lazy"
                  className="absolute top-0 left-0 w-full h-full"
                  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}

          {/* ✅ مكان رفع الفيديو الجديد */}
          <div className="space-y-2">
            <Label className="text-bone text-base">{t("Update Video (Optional)")}</Label>
            
            {!newVideoId ? (
              <label className="border-2 border-dashed border-graphite rounded-[10px] p-10 flex flex-col items-center justify-center bg-onyx cursor-pointer hover:border-copper/50 transition">
                <div className="bg-carbon p-4 rounded-full mb-4 border border-graphite">
                  <UploadCloud className="w-8 h-8 text-copper" />
                </div>
                <p className="text-base font-medium text-white">
                  {isUploading ? `${t("Uploading...")} ${uploadProgress}%` : videoFile ? videoFile.name : t("Click to upload new video")}
                </p>
                <p className="text-sm text-fog mt-2">{t("Upload directly to Bunny Stream")}</p>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="video/*" 
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
                
                {/* شريط التقدم */}
                {isUploading && (
                  <div className="w-full max-w-md bg-graphite h-2 rounded-full mt-4 overflow-hidden">
                    <div 
                      className="bg-copper h-full transition-all duration-300" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                )}
              </label>
            ) : (
              <div className="border border-green-500/30 bg-green-500/10 rounded-[10px] p-6 flex items-center gap-4">
                <Video className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-white font-medium">{t("New video uploaded successfully!")}</p>
                  <p className="text-sm text-green-500/70">{t("It will replace the old video when you save.")}</p>
                </div>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-graphite">
            <Button type="button" variant="outline" onClick={() => router.back()} className="border-graphite text-fog hover:text-white rounded-full px-6">
              {t("Cancel")}
            </Button>
            <Button type="submit" disabled={isSaving || isUploading} className="bg-white text-black hover:bg-gray-200 rounded-full font-medium px-8">
              {isSaving ? t("Saving...") : t("Save Changes")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}