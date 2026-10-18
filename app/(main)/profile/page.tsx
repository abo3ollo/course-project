"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import api from "@/lib/axios";
import { useAuth } from "@/src/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  updateProfileSchema,
  UpdateProfileSchemaType,
  changePasswordSchema,
  ChangePasswordSchemaType,
} from "@/src/schema/profile.schema";

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading: isAuthLoading, logout, refresh } = useAuth();
  const router = useRouter();

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // --- Profile Form ---
  const profileForm = useForm<UpdateProfileSchemaType>({
    resolver: zodResolver(updateProfileSchema),
  });

  useEffect(() => {
    if (user) {
      profileForm.reset({
        firstName: user.firstName,
        lastName: user.lastName,
      });
    }
  }, [user, profileForm]);

  // --- Password Form ---
  const passwordForm = useForm<ChangePasswordSchemaType>({
    resolver: zodResolver(changePasswordSchema),
  });

  // --- Handlers ---
  async function onUpdateProfile(values: UpdateProfileSchemaType) {
    setIsUpdatingProfile(true);
    try {
      await api.patch("/users/me", values);
      toast.success("Profile updated successfully");
      await refresh(); // تحديث الـ AuthContext
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Update failed");
    } finally {
      setIsUpdatingProfile(false);
    }
  }

  async function onChangePassword(values: ChangePasswordSchemaType) {
    setIsChangingPassword(true);
    try {
      await api.patch("/users/me/password", {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      toast.success("Password changed. Please login again.");
      await logout();
      router.push("/login");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Change failed");
    } finally {
      setIsChangingPassword(false);
    }
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    setIsUploadingAvatar(true);
    try {
      await api.post("/users/me/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Avatar updated");
      await refresh(); // تحديث الصورة في الـ Navbar
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Upload failed");
    } finally {
      setIsUploadingAvatar(false);
    }
  }

  if (isAuthLoading) return <div className="text-center py-20">Loading...</div>;
  if (!isAuthenticated) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-10">
      
      {/* Avatar Section */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border text-center">
        <img 
          src={user?.avatar || "/default-avatar.png"} 
          alt="Avatar" 
          className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
        />
        <label className="cursor-pointer bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 transition">
          {isUploadingAvatar ? "Uploading..." : "Change Avatar"}
          <input 
            type="file" 
            className="hidden" 
            accept="image/*"
            onChange={handleAvatarUpload}
            disabled={isUploadingAvatar}
          />
        </label>
      </div>

      {/* Update Profile Form */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>
        <form onSubmit={profileForm.handleSubmit(onUpdateProfile)} className="space-y-4">
          <FieldGroup>
            <Controller
              name="firstName"
              control={profileForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>First Name</FieldLabel>
                  <Input {...field} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
          <FieldGroup>
            <Controller
              name="lastName"
              control={profileForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Last Name</FieldLabel>
                  <Input {...field} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
          <Button type="submit" disabled={isUpdatingProfile}>
            {isUpdatingProfile ? "Updating..." : "Update Profile"}
          </Button>
        </form>
      </div>

      {/* Change Password Form */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border">
        <h2 className="text-xl font-bold mb-6 text-red-600">Change Password</h2>
        <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-4">
          <Controller
            name="currentPassword"
            control={passwordForm.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Current Password</FieldLabel>
                <Input type="password" {...field} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="newPassword"
            control={passwordForm.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>New Password</FieldLabel>
                <Input type="password" {...field} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="confirmPassword"
            control={passwordForm.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Confirm New Password</FieldLabel>
                <Input type="password" {...field} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Button type="submit" variant="destructive" disabled={isChangingPassword}>
            {isChangingPassword ? "Changing..." : "Change Password"}
          </Button>
        </form>
      </div>
    </div>
  );
}