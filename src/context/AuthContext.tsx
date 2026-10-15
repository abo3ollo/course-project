"use client";

import { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/axios";

type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatar: string;
  isVerified?: boolean;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setAuthenticatedUser: (user: User) => void;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * بيسأل الـ Backend: "أنا مين؟"
   * - لو الكوكي موجودة → يرجّع user
   * - لو لأ → 401 → user = null
   */
  const refresh = async () => {
    try {
      const res = await api.get("/users/me");
      setUser(res.data.data.user);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // عند أول mount للـ app — نتأكد من الجلسة
  useEffect(() => {
    refresh();
  }, []);

  const logout = async () => {
    try {
      await api.post("/auth/logout", undefined, { withCredentials: true });
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        setAuthenticatedUser: (authenticatedUser) => {
          setUser(authenticatedUser);
          setIsLoading(false);
        },
        logout,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};