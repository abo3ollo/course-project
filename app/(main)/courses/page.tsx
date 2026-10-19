"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";

import { BookOpen, Tag, User } from "lucide-react";
import { Course } from "@/src/types";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/courses");
        // بنفلتر الكورسات عشان نعرض بس اللي اتنشرت (isPublished: true)
        const publishedCourses = res.data.data.courses.filter(
          (course: Course) => course.isPublished
        );
        setCourses(publishedCourses);
      } catch (err) {
        console.error("Failed to fetch courses", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
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
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl font-bold text-gray-900">Browse Catalog</h1>
        <p className="text-gray-500 mt-2">
          Discover new skills and expand your knowledge with our top-rated courses.
        </p>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No courses available</h3>
          <p className="text-gray-500 mt-1">Check back later for new content.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((course) => (
            <Link 
              key={course._id} 
              href={`/courses/${course._id}`}
              className="group flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              {/* Thumbnail */}
              <div className="relative h-48 w-full bg-gray-200 overflow-hidden">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-md text-sm font-bold text-gray-900 shadow-sm">
                  ${course.price}
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col grow">
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-3">
                  <Tag size={14} />
                  <span>{course.category}</span>
                  <span className="text-gray-300">•</span>
                  <span>{course.level}</span>
                </div>

                <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                  {course.title}
                </h2>
                
                <p className="text-sm text-gray-500 line-clamp-2 mb-4 grow">
                  {course.description}
                </p>

                {/* Instructor */}
                <div className="flex items-center gap-2 mt-auto pt-4 border-t border-gray-50">
                  {course.instructor?.avatar ? (
                    <img
                      src={course.instructor.avatar}
                      alt="Instructor"
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                      {course.instructor?.firstName?.charAt(0)}
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700">
                    {course.instructor?.firstName} {course.instructor?.lastName}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}