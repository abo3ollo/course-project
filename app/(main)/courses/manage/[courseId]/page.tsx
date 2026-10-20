"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import { Course } from "@/src/types";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ArrowLeft, CheckCircle } from "lucide-react";
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

  if (isLoading) return <div className="text-center py-20">Loading...</div>;
  if (!course) return <div className="text-center py-20">Course not found.</div>;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <Link href="/courses" className="text-sm text-gray-500 hover:text-black flex items-center gap-1 mb-2">
            <ArrowLeft size={14} /> Back to Catalog
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Manage: {course.title}</h1>
          <p className="text-gray-500 mt-1">Build your curriculum by adding sections and lessons.</p>
        </div>
        <Button onClick={() => router.push(`/courses/${courseId}`)} className="bg-gray-900 text-white w-full md:w-auto">
          <CheckCircle size={16} className="mr-2" /> Finish & View Course
        </Button>
      </div>

      {/* Sections List */}
      <div className="space-y-4 mb-8">
        {course.sections && course.sections.length > 0 ? (
          course.sections.map((section, index) => (
            <div key={index} className="border rounded-xl bg-white p-5 shadow-sm hover:shadow-md transition">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{section.title}</h3>
                    <p className="text-sm text-gray-500">{section.lessons?.length || 0} lectures</p>
                  </div>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  {/* ملاحظة: زرار إضافة الدرس هيتفعل في الخطوة الجاية */}
                  <Button variant="outline" size="sm" className="flex-1 md:flex-none">Add Lesson</Button>
                  <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50">
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed">
            <p className="text-gray-500">No sections added yet. Start building your course!</p>
          </div>
        )}
      </div>

      {/* Add Section Button */}
      <Button 
        onClick={() => router.push(`/courses/create/${courseId}/sections/new`)}
        className="w-full py-6 border-2 border-dashed border-indigo-200 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 shadow-none"
        variant="outline"
      >
        <Plus size={20} className="mr-2" /> Add New Section
      </Button>
    </div>
  );
}