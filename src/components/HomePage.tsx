"use client";


import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function HomePage() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="text-center py-20 text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <h1 className="text-4xl font-bold mb-4">
        Welcome to Courses Platform
      </h1>

      {isAuthenticated ? (
        <>
          <p className="text-lg text-gray-600 mb-8">
            مرحبًا {user?.firstName}! 👋
          </p>
          <Link
            href="/courses"
            className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
          >
            Browse Courses
          </Link>
        </>
      ) : (
        <>
          <p className="text-lg text-gray-600 mb-8">
            Learn new skills from expert instructors
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/register"
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="border border-black px-6 py-3 rounded-lg hover:bg-gray-100"
            >
              Login
            </Link>
          </div>
        </>
      )}
    </div>
  );
}