"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { LogOut, GraduationCap } from "lucide-react";

export default function Navbar() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    router.push("/login");
    router.refresh();
  };

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo & Main Links */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-indigo-600">
            <div className="bg-indigo-600 text-white p-2 rounded-lg">
              <GraduationCap size={24} />
            </div>
            Courses
          </Link>

          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-6">
              <Link href="/my-courses" className={`text-sm font-medium ${pathname === '/my-courses' ? 'text-indigo-600' : 'text-gray-600 hover:text-black'}`}>
                My Courses
              </Link>
              <Link href="/courses" className={`text-sm font-medium ${pathname === '/courses' ? 'text-indigo-600' : 'text-gray-600 hover:text-black'}`}>
                Browse Catalog
              </Link>
              <Link href="/resources" className={`text-sm font-medium ${pathname === '/resources' ? 'text-indigo-600' : 'text-gray-600 hover:text-black'}`}>
                Resources
              </Link>
            </div>
          )}
        </div>

        {/* User Section */}
        <div className="flex items-center gap-4">
          {isLoading ? (
            <span className="text-sm text-gray-500">Loading...</span>
          ) : isAuthenticated ? (
            <>
              <Link 
                href="/profile" 
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 hover:bg-gray-50 transition"
              >
                {user?.avatar && !user.avatar.includes('default-avatar') ? (
                  <img 
                    src={user.avatar} 
                    alt="Avatar" 
                    className="w-7 h-7 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                    {user?.firstName?.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-sm font-medium text-gray-700">
                  {user?.firstName}
                </span>
              </Link>
              
              <Button
                onClick={handleLogout}
                variant="outline"
                className="rounded-full text-gray-600 hover:text-red-600 border-gray-200"
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-black">
                Login
              </Link>
              <Link href="/register">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}