"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import { Course } from "@/src/types";
import { BookOpen, PlayCircle, Clock, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const res = await api.get("/courses/my-courses");
        setCourses(res.data.data.courses);
      } catch (err) {
        console.error("Failed to fetch my courses", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">My Learning</h1>
        <p className="text-gray-500 mt-2">Continue your learning journey and achieve your goals.</p>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">You don't have any courses yet</h3>
          <p className="text-gray-500 mt-1 mb-6">Explore our catalog and start learning today.</p>
          <Link href="/courses">
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              Browse Catalog
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((course) => (
            <div 
              key={course._id}
              className="group flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              {/* Thumbnail */}
              <div className="relative h-48 w-full bg-gray-200 overflow-hidden">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Link href={`/courses/${course._id}/learn`}>
                    <Button className="bg-white text-gray-900 hover:bg-gray-100 font-bold rounded-full">
                      <PlayCircle className="mr-2 h-5 w-5" /> Continue
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-3">
                  <Tag size={14} />
                  <span>{course.category}</span>
                </div>

                <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                  {course.title}
                </h2>
                
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                  <img 
                    src={course.instructor?.avatar || "/default-avatar.png"} 
                    alt="Instructor"
                    className="w-6 h-6 rounded-full object-cover" 
                  />
                  <span>{course.instructor?.firstName} {course.instructor?.lastName}</span>
                </div>

                <div className="mt-auto pt-5">
                  <Link href={`/courses/${course._id}/learn`}>
                    <Button className="w-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold">
                      Continue Learning
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}