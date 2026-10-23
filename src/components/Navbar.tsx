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
    <nav className="border-b border-graphite bg-obsidian sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo & Main Links */}
        <div className="flex items-center gap-10">
          {/* اللوجو: خط Serif فخم مع أيقونة نحاسية (Copper) */}
          <Link href="/" className="flex items-center gap-3 text-2xl font-serif text-white tracking-wide group">
            <div className="bg-carbon border border-graphite text-copper p-2 rounded-xl group-hover:border-copper transition-colors">
              <GraduationCap size={22} />
            </div>
            <span className="group-hover:text-copper transition-colors">Courses</span>
          </Link>

          {/* روابط التنقل (Nav Links) */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-8">
              <Link 
                href="/my-courses" 
                className={`text-sm font-medium transition-colors ${pathname === '/my-courses' ? 'text-white' : 'text-fog hover:text-white'}`}
              >
                My Courses
              </Link>
              <Link 
                href="/courses" 
                className={`text-sm font-medium transition-colors ${pathname === '/courses' ? 'text-white' : 'text-fog hover:text-white'}`}
              >
                Browse Catalog
              </Link>
              <Link 
                href="/resources" 
                className={`text-sm font-medium transition-colors ${pathname === '/resources' ? 'text-white' : 'text-fog hover:text-white'}`}
              >
                Resources
              </Link>
            </div>
          )}
        </div>

        {/* User Section */}
        <div className="flex items-center gap-5">
          {isLoading ? (
            <span className="text-sm text-fog">Loading...</span>
          ) : isAuthenticated ? (
            <>
              {/* بروفايل اليوزر: خلفية داكنة بحدود خفيفة */}
              <Link
                href="/profile"
                className="flex items-center gap-3 px-3 py-1.5 rounded-full border border-graphite bg-carbon hover:border-slate transition-colors"
              >
                {user?.avatar && !user.avatar.includes('default-avatar') ? (
                  <img
                    src={user.avatar || "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"}
                    alt="Avatar"
                    className="w-7 h-7 rounded-full object-cover border border-slate"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-graphite text-copper flex items-center justify-center font-bold text-xs border border-slate">
                    {user?.firstName?.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-sm font-medium text-bone">
                  {user?.firstName}
                </span>
              </Link>

              {/* زرار تسجيل الخروج: شفاف بحدود رمادية */}
              <Button
                onClick={handleLogout}
                variant="outline"
                className="rounded-full bg-transparent text-fog border-slate hover:text-white hover:bg-carbon hover:border-smoke transition-all"
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-fog hover:text-white transition-colors">
                Login
              </Link>
              {/* زرار أبيض ممتلئ (Primary Action) زي تصميم Slash */}
              <Link href="/register">
                <Button className="bg-white text-black hover:bg-gray-200 rounded-full font-medium px-6">
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