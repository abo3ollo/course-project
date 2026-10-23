"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import { Course } from "@/src/types";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ArrowLeft, CheckCircle, Edit, Video } from "lucide-react";
import { toast } from "sonner";

export default function ManageCoursePage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const router = useRouter();

  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCourse = async () => {
    try {
      const res = await api.get(`/courses/${courseId}`);
      setCourse(res.data.data.course);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) fetchCourse();
  }, [courseId]);

  const handleDeleteSection = async (sectionId: string) => {
    if (!confirm("Are you sure you want to delete this section?")) return;

    try {
      await api.delete(`/courses/${courseId}/sections/${sectionId}`);
      toast.success("Section deleted successfully");
      fetchCourse();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete section");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-copper"></div>
      </div>
    );
  }
  
  if (!course) {
    return <div className="min-h-screen bg-obsidian text-white text-center py-20">Course not found.</div>;
  }

  return (
    <div className="min-h-screen bg-obsidian text-bone font-sans pb-20">
      <div className="w-[80%] mx-auto py-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-graphite pb-8">
          <div>
            <Link href="/courses" className="text-sm text-fog hover:text-white flex items-center gap-1 mb-3 transition-colors">
              <ArrowLeft size={14} /> Back to Catalog
            </Link>
            <h1 className="font-serif text-4xl text-white">Manage: {course.title}</h1>
            <p className="text-fog mt-2">Build your curriculum by adding sections and lessons.</p>
          </div>
          <Button 
            onClick={() => router.push(`/courses/${courseId}`)} 
            className="bg-white text-black hover:bg-gray-200 rounded-full font-medium px-6 h-11"
          >
            <CheckCircle size={18} className="mr-2" /> Finish & View Course
          </Button>
        </div>

        {/* Sections List */}
        <div className="space-y-4 mb-8">
          {course.sections && course.sections.length > 0 ? (
            course.sections.map((section: any, index) => (
              <div key={section._id || index} className="border border-graphite rounded-[10px] bg-onyx p-6 hover:border-slate transition-colors">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-carbon text-copper border border-graphite rounded-xl flex items-center justify-center font-serif text-xl">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-serif text-xl text-white mb-1">{section.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-fog">
                        <span className="flex items-center gap-1">
                          <Video size={14} className={section.videoUrl ? "text-copper" : "text-steel"} />
                          {section.videoUrl ? "Video attached" : "No video"}
                        </span>
                        <span>•</span>
                        <span>{section.duration || "0 min"}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 w-full md:w-auto">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 md:flex-none border-graphite bg-carbon text-white hover:bg-graphite hover:border-slate rounded-full px-5"
                      onClick={() => router.push(`/courses/manage/${courseId}/sections/${section._id}/edit`)}
                    >
                      <Edit size={14} className="mr-2" /> Edit
                    </Button>

                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-steel hover:text-red-400 hover:bg-red-400/10 rounded-full px-4"
                      onClick={() => handleDeleteSection(section._id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-onyx rounded-[10px] border border-graphite border-dashed">
              <p className="text-fog">No sections added yet. Start building your course!</p>
            </div>
          )}
        </div>

        {/* Add Section Button */}
        <Button 
          onClick={() => router.push(`/courses/create/${courseId}/sections/new`)}
          className="w-full py-8 border-2 border-dashed border-graphite bg-carbon/50 text-fog hover:bg-carbon hover:text-copper hover:border-copper/50 transition-all rounded-[10px]"
          variant="outline"
        >
          <Plus size={20} className="mr-2" /> Add New Section
        </Button>
      </div>
    </div>
  );
}