"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    router.push("/login");
    router.refresh();
  };

  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          🎓 Courses
        </Link>

        {/* Links */}
        <div className="flex items-center gap-4">
          {isLoading ? (
            <span className="text-sm text-gray-500">Loading...</span>
          ) : isAuthenticated ? (
            <>
              <Link href="/courses" className="text-sm hover:underline">
                Courses
              </Link>
              <Link href="/profile" className="text-sm hover:underline">
                {user?.firstName}
              </Link>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm hover:underline">
                Login
              </Link>
              <Link href="/register" className="text-sm hover:underline">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}