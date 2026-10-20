"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import { Course } from "@/src/types";
import { Clock, Globe, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/src/context/AuthContext";

export default function CourseDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  
  // ✅ جبنا user عشان نعرف مين اللي فاتح الصفحة
  const { isAuthenticated, user } = useAuth(); 

  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolling, setIsEnrolling] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/courses/${id}`);
        setCourse(res.data.data.course);
      } catch (err) {
        console.error("Failed to fetch course", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchCourse();
  }, [id]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      toast.error("Please login first to enroll");
      router.push("/login");
      return;
    }

    setIsEnrolling(true);
    try {
      await api.post(`/courses/${id}/enroll`);
      toast.success("Enrolled successfully!");
      router.push("/my-courses"); 
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to enroll");
    } finally {
      setIsEnrolling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900">Course not found</h2>
        <Link href="/courses" className="text-indigo-600 hover:underline mt-4 inline-block">
          Back to Catalog
        </Link>
      </div>
    );
  }

  // ✅ التحقق لو اليوزر الحالي هو المدرس
  const isInstructor = user?._id === course?.instructor?._id;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* بيانات الكورس (الشمال) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3 text-sm font-medium text-indigo-400">
              <span>{course.category}</span>
              <span>•</span>
              <span>{course.level}</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              {course.title}
            </h1>
            
            <p className="text-lg text-gray-300">{course.description}</p>

            <div className="flex items-center gap-4 pt-4">
              {course.instructor?.avatar ? (
                <img src={course.instructor.avatar} className="w-12 h-12 rounded-full border-2 border-indigo-500 object-cover" alt="instructor" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-xl font-bold">
                  {course.instructor?.firstName?.charAt(0)}
                </div>
              )}
              <div>
                <p className="text-sm text-gray-400">Created by</p>
                <p className="font-semibold text-white">
                  {course.instructor?.firstName} {course.instructor?.lastName}
                </p>
              </div>
            </div>
          </div>

          {/* الكارت بتاع الشراء / التسجيل (اليمين) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 text-gray-900 sticky top-24">
              <img 
                src={course.thumbnail} 
                alt={course.title} 
                className="w-full h-48 object-cover rounded-xl mb-6"
              />
              
              <div className="text-4xl font-bold mb-6">
                {course.price === 0 ? "Free" : `$${course.price}`}
              </div>
              
              {/* ✅ التعديل بتاع زرار المدرس / الطالب */}
              {isInstructor ? (
                <div className="space-y-3 mb-6">
                  <Button className="w-full bg-gray-900 hover:bg-black text-white h-12 text-lg rounded-xl">
                    Edit Course
                  </Button>
                  <p className="text-xs text-center text-gray-500">
                    You are the instructor of this course.
                  </p>
                </div>
              ) : (
                <>
                  <Button 
                    onClick={handleEnroll}
                    disabled={isEnrolling}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12 text-lg rounded-xl mb-4"
                  >
                    {isEnrolling ? "Enrolling..." : "Enroll Now"}
                  </Button>
                  <p className="text-xs text-center text-gray-500 mb-6">
                    30-Day Money-Back Guarantee
                  </p>
                </>
              )}

              {/* مميزات الكورس */}
              <div className="space-y-3 text-sm text-gray-600 mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-indigo-600" />
                  <span>Full lifetime access</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe size={16} className="text-indigo-600" />
                  <span>Access on mobile and TV</span>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck size={16} className="text-indigo-600" />
                  <span>Certificate of completion</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}