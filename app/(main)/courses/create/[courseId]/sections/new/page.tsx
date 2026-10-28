"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, UploadCloud, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";
import * as tus from "tus-js-client";

export default function AddSectionPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;

  const [isLoading, setIsLoading] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  
  // ✅ States جديدة للرفع على Bunny
  const [uploadProgress, setUploadProgress] = useState(0);
  const [bunnyVideoId, setBunnyVideoId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    learningObjective: "",
    introVideoTitle: "",
    duration: "",
    isFreePreview: false,
    isDraft: true,
  });

  // ✅ دالة رفع الفيديو لـ Bunny
  const uploadVideoToBunny = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    setBunnyVideoId(null);

    try {
      // 1. نطلب التوقيع من الباك إند
      const res = await api.post("/courses/bunny-upload-signature", { title: file.name });
      const { videoId, libraryId, signature, expirationTime } = res.data.data;

      // 2. نبدأ الرفع المباشر
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
          toast.error("Failed to upload video to Bunny");
          setIsUploading(false);
        },
        onProgress: (bytesUploaded, bytesTotal) => {
          const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
          setUploadProgress(Number(percentage));
        },
        onSuccess: () => {
          toast.success("Video uploaded successfully!");
          setBunnyVideoId(videoId);
          setIsUploading(false);
          setUploadProgress(100);
        },
      });

      upload.start();
    } catch (err: any) {
      toast.error("Failed to get upload signature");
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
    if (!formData.title.trim()) {
      toast.error("Section title is required");
      return;
    }
    if (!bunnyVideoId) {
      toast.error("Please wait for the video to finish uploading");
      return;
    }

    setIsLoading(true);
    try {
      // ✅ بنبعت البيانات كـ JSON عادي (مفيش ملفات هنا)
      const payload = {
        title: formData.title,
        learningObjective: formData.learningObjective,
        introVideoTitle: formData.introVideoTitle,
        duration: formData.duration,
        isFreePreview: formData.isFreePreview,
        isDraft: formData.isDraft,
        videoId: bunnyVideoId, // 👈 الباك إند هيبني اللينك منه
      };

      await api.post(`/courses/${courseId}/sections`, payload);

      toast.success("Section added successfully!");
      router.push(`/courses/manage/${courseId}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to add section");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian text-bone font-sans pb-20">
      <div className="max-w-4xl mx-auto py-12 px-4">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <Button variant="outline" size="icon" onClick={() => router.back()} className="border-graphite bg-carbon text-fog hover:text-white hover:bg-graphite rounded-full">
            <ArrowLeft size={18} />
          </Button>
          <div>
            <p className="text-xs font-semibold text-copper tracking-widest uppercase mb-1">
              Curriculum Builder • Section
            </p>
            <h1 className="font-serif text-4xl text-white">Add New Section</h1>
            <p className="text-fog mt-2">Create a curriculum chapter to organize lectures, videos, and quizzes.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-onyx p-8 rounded-[10px] border border-graphite space-y-8">
          
          {/* Section Title */}
          <div className="space-y-2">
            <Label className="text-bone text-base">Section Title <span className="text-copper">*</span></Label>
            <Input 
              placeholder="e.g., Advanced State Management with Redux Toolkit" 
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="h-12 text-lg bg-carbon border-graphite text-white placeholder:text-steel focus-visible:ring-copper"
            />
          </div>

          {/* Learning Objective */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-bone text-base">Learning Objective</Label>
              <span className="text-xs text-fog">Optional</span>
            </div>
            <Textarea 
              placeholder="What key outcomes or skills will students achieve in this section?"
              value={formData.learningObjective}
              onChange={(e) => setFormData({ ...formData, learningObjective: e.target.value })}
              className="min-h-25 bg-carbon border-graphite text-white placeholder:text-steel focus-visible:ring-copper"
            />
          </div>

          {/* Video Section */}
          <div className="border border-graphite rounded-[10px] p-6 bg-carbon">
            <div className="mb-6">
              <h4 className="font-serif text-xl text-white">Section Overview Video</h4>
              <p className="text-sm text-fog mt-1">Attach an introductory clip or first lecture for this chapter.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <Label className="text-sm text-bone">Lecture / Video Title</Label>
                <Input 
                  placeholder="e.g., Section 2 Intro & Overview"
                  value={formData.introVideoTitle}
                  onChange={(e) => setFormData({ ...formData, introVideoTitle: e.target.value })}
                  className="bg-onyx border-graphite text-white placeholder:text-steel"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-bone">Estimated Duration</Label>
                <Input 
                  placeholder="e.g., 12:45 min"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="bg-onyx border-graphite text-white placeholder:text-steel"
                />
              </div>
            </div>

            {/* ✅ مكان رفع الفيديو */}
            {!bunnyVideoId ? (
              <label className="border-2 border-dashed border-graphite rounded-[10px] p-10 flex flex-col items-center justify-center bg-onyx cursor-pointer hover:border-copper/50 transition">
                <div className="bg-carbon p-4 rounded-full mb-4 border border-graphite">
                  <UploadCloud className="w-8 h-8 text-copper" />
                </div>
                <p className="text-base font-medium text-white">
                  {isUploading ? `Uploading... ${uploadProgress}%` : videoFile ? videoFile.name : "Click to upload video file"}
                </p>
                <p className="text-sm text-fog mt-2">Upload directly to Bunny Stream (No size limit)</p>
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
                <CheckCircle2 className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-white font-medium">Video uploaded successfully!</p>
                  <p className="text-sm text-green-500/70">You can now submit the section.</p>
                </div>
              </div>
            )}
          </div>

          {/* Access & Visibility */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-fog tracking-widest uppercase">Access & Visibility</h4>
            
            <label className="flex items-start gap-4 p-5 border border-graphite bg-carbon rounded-xl cursor-pointer hover:border-slate transition">
              <input type="checkbox" className="mt-1 w-5 h-5 rounded border-graphite bg-onyx text-copper focus:ring-copper" 
                checked={formData.isFreePreview} onChange={(e) => setFormData({...formData, isFreePreview: e.target.checked})} />
              <div>
                <p className="text-base font-medium text-white">Free Preview Section</p>
                <p className="text-sm text-fog mt-1">Allow prospective students to watch videos in this section without purchasing the course.</p>
              </div>
            </label>
            
            <label className="flex items-start gap-4 p-5 border border-copper/30 bg-copper/5 rounded-xl cursor-pointer hover:border-copper/60 transition">
              <input type="checkbox" className="mt-1 w-5 h-5 rounded border-copper/50 bg-onyx text-copper focus:ring-copper" 
                checked={formData.isDraft} onChange={(e) => setFormData({...formData, isDraft: e.target.checked})} />
              <div>
                <p className="text-base font-medium text-copper">Keep as Draft</p>
                <p className="text-sm text-copper/70 mt-1">Hide this section from enrolled students until you finish adding all lessons.</p>
              </div>
            </label>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-graphite">
            <Button type="button" variant="outline" onClick={() => router.back()} className="border-graphite text-fog hover:text-white rounded-full px-6">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || isUploading || !bunnyVideoId} className="bg-white text-black hover:bg-gray-200 rounded-full font-medium px-8">
              {isLoading ? "Adding..." : "Add Section"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}