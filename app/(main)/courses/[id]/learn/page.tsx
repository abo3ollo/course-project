"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { Course } from "@/src/types";
import { PlayCircle, ArrowRight, Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LearnPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<any>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/courses/${id}`);
        const courseData = res.data.data.course;
        setCourse(courseData);

        // نختار أول فيديو يتشغل أوتوماتيك
        if (courseData.sections && courseData.sections.length > 0) {
          const firstSectionWithVideo = courseData.sections.find((s: any) => s.videoUrl);
          if (firstSectionWithVideo) {
            setActiveVideo(firstSectionWithVideo);
          }
        }
      } catch (err) {
        router.push(`/courses/${id}`); // لو مش مصرح له يرجعه
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchCourse();
  }, [id, router]);

  if (isLoading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!course) return <div className="text-center py-20">Course not found or Unauthorized.</div>;

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col md:flex-row overflow-hidden">
      
      {/* ── Sidebar (الأقسام) ── */}
      <div className="w-full md:w-80 bg-gray-950 border-r border-gray-800 flex flex-col h-full order-2 md:order-1">
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-lg">Course Content</h2>
            <p className="text-xs text-gray-400 mt-1">{course.title}</p>
          </div>
          <Link href={`/courses/${id}`}>
            <Button variant="ghost" size="icon" className="text-white hover:bg-gray-800">
              <ArrowRight size={18} />
            </Button>
          </Link>
        </div>

        <div className="overflow-y-auto flex-1 p-2 space-y-2">
          {course.sections?.map((section: any, index) => (
            <div key={section._id || index} className="mb-4">
              <h3 className="text-sm font-bold text-indigo-400 p-2">
                Section {index + 1}: {section.title}
              </h3>
              <div className="space-y-1">
                {section.videoUrl ? (
                  <button
                    onClick={() => setActiveVideo(section)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition ${
                      activeVideo?._id === section._id 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    <PlayCircle size={16} className={activeVideo?._id === section._id ? "text-white" : "text-gray-500"} />
                    <span className="line-clamp-1">{section.introVideoTitle || section.title}</span>
                  </button>
                ) : (
                  <div className="px-3 py-2 text-sm text-gray-500 italic">
                    No video available.
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Video Player (المشاهدة) ── */}
      <div className="flex-1 flex flex-col h-full order-1 md:order-2 overflow-y-auto bg-black">
        {activeVideo ? (
          <div className="w-full aspect-video bg-black flex items-center justify-center">
            <video 
              key={activeVideo._id}
              src={activeVideo.videoUrl} 
              controls 
              autoPlay
              className="w-full max-h-[80vh]"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
            <PlayCircle size={64} className="mb-4 opacity-50" />
            <p>Select a video from the sidebar to start learning.</p>
          </div>
        )}

        {/* تفاصيل الفيديو */}
        {activeVideo && (
          <div className="p-6 border-t border-gray-800 bg-gray-900">
            <h1 className="text-2xl font-bold">{activeVideo.introVideoTitle || activeVideo.title}</h1>
            <p className="text-gray-400 mt-2">{activeVideo.learningObjective}</p>
            <div className="text-sm text-gray-500 mt-4">
              Duration: {activeVideo.duration || "N/A"}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}