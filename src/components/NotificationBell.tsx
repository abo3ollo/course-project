"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // جلب الإشعارات
  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data.data.notifications);
      setUnreadCount(res.data.data.unreadCount);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // تحديث الإشعارات كل دقيقة
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  // تعليم إشعار واحد كمقروء
  const handleMarkAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);

      // تحديث الحالة في الواجهة فوراً
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  // تعليم كل الإشعارات كمقروءة
  const handleMarkAllAsRead = async () => {
    try {
      await api.patch("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger className="relative p-2 rounded-full text-fog hover:text-white hover:bg-carbon transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-copper">
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-copper rounded-full border-2 border-obsidian"></span>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 bg-onyx border border-graphite text-bone p-2"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-2 border-b border-graphite mb-2">
          <span className="font-semibold text-white">Notifications</span>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-xs text-copper hover:underline"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* List */}
        <div className="max-h-75 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="text-center text-sm text-fog p-6">
              No notifications yet.
            </p>
          ) : (
            notifications.map((notif) => (
              <Link
                href={notif.link || "#"}
                key={notif._id}
                onClick={() => {
                  if (!notif.isRead) handleMarkAsRead(notif._id);
                  setIsOpen(false);
                }}
              >
                <DropdownMenuItem
                  className={`flex items-start gap-3 p-3 rounded-md cursor-pointer transition-colors ${!notif.isRead ? "bg-carbon/60" : "hover:bg-carbon/40"
                    }`}
                >
                  {/* صورة المرسل أو أيقونة افتراضية */}
                  {notif.sender?.avatar ? (
                    <img
                      src={notif.sender.avatar}
                      alt="sender"
                      className="w-8 h-8 rounded-full object-cover border border-graphite mt-0.5"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-graphite flex items-center justify-center text-copper font-bold mt-0.5">
                      {notif.sender?.firstName?.charAt(0) || "N"}
                    </div>
                  )}

                  <div className="flex-1">
                    <p className={`text-sm leading-snug ${!notif.isRead ? "text-white font-medium" : "text-fog"}`}>
                      {notif.message}
                    </p>
                    <p className="text-xs text-steel mt-1">
                      {new Date(notif.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* نقطة زرقاء/نحاسية لو الإشعار مش مقروء */}
                  {!notif.isRead && (
                    <span className="w-2 h-2 rounded-full bg-copper mt-1 shrink-0"></span>
                  )}
                </DropdownMenuItem>
              </Link>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}