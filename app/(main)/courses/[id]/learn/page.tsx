"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { Course } from "@/src/types";
import { PlayCircle, ArrowRight, Lock, BookOpen, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function LearnPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<any>(null);

  // ✅ States لحفظ الأقسام المكتملة
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ States خاصة بالفيديو الآمن
  const [signedVideoUrl, setSignedVideoUrl] = useState<string | null>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(false);

  // دالة جلب اللينك الموقع من الباك إند
  const loadSecureVideo = async (section: any) => {
    if (!section.videoId) return; // لو الفيديو مش مرفوع

    setIsVideoLoading(true);
    setSignedVideoUrl(null);

    try {
      const res = await api.get(`/courses/signed-video/${section.videoId}`);
      setSignedVideoUrl(res.data.data.signedUrl);
    } catch (err: any) {
      toast.error("Failed to load secure video");
    } finally {
      setIsVideoLoading(false);
    }
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/courses/${id}`);

        const courseData = res.data.data.course;
        const userCompletedSections = res.data.data.completedSections || [];

        setCourse(courseData);
        setCompletedSections(userCompletedSections);

        // نختار أول فيديو يتشغل أوتوماتيك
        if (courseData.sections && courseData.sections.length > 0) {
          const firstUncompleted = courseData.sections.find(
            (s: any) => s.videoId && !userCompletedSections.includes(s._id)
          );
          const firstSectionWithVideo = courseData.sections.find((s: any) => s.videoId);

          const initialVideo = firstUncompleted || firstSectionWithVideo;

          if (initialVideo) {
            setActiveVideo(initialVideo);
            // ✅ بنجيب اللينك الآمن لأول فيديو
            loadSecureVideo(initialVideo);
          }
        }
      } catch (err) {
        router.push(`/courses/${id}`);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchCourse();
  }, [id, router]);

  // ✅ دالة تعليم القسم كمكتمل
  const markAsCompleted = async () => {
    if (!activeVideo || completedSections.includes(activeVideo._id) || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await api.post(`/courses/${id}/sections/${activeVideo._id}/complete`);
      setCompletedSections((prev) => [...prev, activeVideo._id]);
      toast.success("Marked as completed!");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to mark as completed");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ دالة اختيار فيديو جديد
  const handleVideoSelect = (section: any) => {
    setActiveVideo(section);
    loadSecureVideo(section);
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-obsidian flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-copper"></div>
      </div>
    );
  }

  if (!course) return <div className="h-screen bg-obsidian text-white flex items-center justify-center">Course not found or Unauthorized.</div>;

  return (
    <div className="h-screen bg-obsidian text-bone font-sans flex flex-col md:flex-row overflow-hidden selection:bg-copper selection:text-white">

      {/* ── Sidebar (الأقسام) ── */}
      <div className="w-full md:w-80 bg-onyx border-r border-graphite flex flex-col h-full order-2 md:order-1 shrink-0">

        {/* Sidebar Header */}
        <div className="p-5 border-b border-graphite flex items-start justify-between bg-carbon">
          <div>
            <h2 className="font-serif text-xl text-white">Course Content</h2>
            <p className="text-xs text-fog mt-2 line-clamp-2 leading-relaxed">{course.title}</p>
          </div>
          <Link href={`/courses/${id}`}>
            <Button variant="ghost" size="icon" className="text-fog hover:text-white hover:bg-graphite rounded-full shrink-0 cursor-pointer">
              <ArrowRight size={18} />
            </Button>
          </Link>
        </div>

        {/* Sidebar List */}
        <div className="overflow-y-auto flex-1 p-3 space-y-4 custom-scrollbar">
          {course.sections?.map((section: any, index) => {
            const isCompleted = completedSections.includes(section._id);

            return (
              <div key={section._id || index} className="mb-2">
                <h3 className="text-xs font-bold text-copper p-2 uppercase tracking-widest">
                  Section {index + 1}: {section.title}
                </h3>
                <div className="space-y-1 mt-1">
                  {section.videoId ? (
                    <button
                      onClick={() => handleVideoSelect(section)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center justify-between gap-3 transition-colors cursor-pointer ${activeVideo?._id === section._id
                          ? 'bg-copper/10 text-copper border-l-2 border-copper'
                          : 'text-bone hover:bg-graphite border-l-2 border-transparent'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        {isCompleted ? (
                          <CheckCircle2 size={16} className="text-green-500" />
                        ) : (
                          <PlayCircle size={16} className={activeVideo?._id === section._id ? "text-copper" : "text-steel"} />
                        )}
                        <span className="line-clamp-1">{section.introVideoTitle || section.title}</span>
                      </div>
                    </button>
                  ) : (
                    <div className="px-3 py-2 text-sm text-steel italic flex items-center gap-2">
                      <Lock size={14} /> No video available.
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Video Player (المشاهدة) ── */}
      <div className="flex-1 flex flex-col h-full order-1 md:order-2 overflow-y-auto bg-obsidian">
        {activeVideo ? (
          <div className="w-full aspect-video bg-black flex items-center justify-center border-b border-graphite relative">
            
            {/* ✅ مشغل Bunny Stream الآمن */}
            {isVideoLoading ? (
              <div className="flex flex-col items-center gap-3 text-fog">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-copper"></div>
                <p className="text-sm">Securing video stream...</p>
              </div>
            ) : signedVideoUrl ? (
              <iframe
                src={signedVideoUrl}
                loading="lazy"
                className="absolute top-0 left-0 w-full h-full"
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                allowFullScreen
              ></iframe>
            ) : (
              <p className="text-red-400">Failed to load video. Please try again later.</p>
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-steel bg-obsidian border-b border-graphite">
            <BookOpen size={64} className="mb-4 opacity-30" />
            <p className="font-serif text-xl text-fog">Select a video to start learning.</p>
          </div>
        )}

        {/* تفاصيل الفيديو */}
        {activeVideo && (
          <div className="p-8 md:p-10 max-w-4xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <h1 className="font-serif text-3xl md:text-4xl text-white">
                {activeVideo.introVideoTitle || activeVideo.title}
              </h1>

              <Button
                onClick={markAsCompleted}
                disabled={completedSections.includes(activeVideo._id) || isSubmitting}
                className={`rounded-full px-6 transition-all ${completedSections.includes(activeVideo._id)
                    ? 'bg-green-500/20 text-green-500 border border-green-500/30 cursor-default'
                    : 'bg-white text-black hover:bg-gray-200'
                  }`}
              >
                {completedSections.includes(activeVideo._id) ? (
                  <><CheckCircle2 className="w-4 h-4 mr-2" /> Completed</>
                ) : (
                  "Mark as Complete"
                )}
              </Button>
            </div>

            <p className="text-fog text-lg leading-relaxed mb-6">
              {activeVideo.learningObjective}
            </p>

            <div className="inline-flex items-center gap-2 text-sm text-copper bg-copper/10 px-4 py-2 rounded-full border border-copper/20">
              <span className="font-semibold tracking-wider uppercase text-xs">Duration</span>
              <span className="w-1 h-1 rounded-full bg-copper/50"></span>
              <span>{activeVideo.duration || "N/A"}</span>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}