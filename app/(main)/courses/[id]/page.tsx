import { Metadata } from "next";
import CourseDetailsClient from "./CourseDetailsClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://course-project-ten-gules.vercel.app/api";

async function getCourse(id: string) {
  try {
    const res = await fetch(`${API_URL}/courses/${id}`, {
      next: { revalidate: 3600 }, // Cache لمدة ساعة
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data.course;
  } catch (error) {
    return null;
  }
}

// ✅ في Next.js 15، الـ params بقت Promise فلازم await
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const course = await getCourse(resolvedParams.id);
  
  if (!course) {
    return {
      title: "Course Not Found",
    };
  }

  return {
    title: course.title,
    description: course.description?.slice(0, 160) || "Explore this course.",
    openGraph: {
      title: course.title,
      description: course.description?.slice(0, 160),
      images: course.thumbnail ? [{ url: course.thumbnail }] : [],
    },
  };
}

export default async function CourseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  return <CourseDetailsClient courseId={resolvedParams.id} />;
}