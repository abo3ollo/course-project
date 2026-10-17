# 🎓 Courses Platform — Project Summary

> **آخر تحديث:** أكتوبر 2025
> **الغرض:** مرجع شامل لمشروع Courses Platform (Backend + Frontend)

---

## 🏗️ نظرة عامة

**المشروع:** منصة كورسات تعليمية
**التقنيات:**
- **Backend:** Node.js + Express + MongoDB (Mongoose)
- **Frontend:** Next.js 15 (App Router) + TypeScript + Tailwind + shadcn/ui
- **Auth:** JWT في httpOnly cookies
- **Deploy:** Vercel (Backend + Frontend)

**الروابط:**
- Frontend: `https://course-project-full.vercel.app`
- Backend: `https://course-project-ten-gules.vercel.app`
- Database: MongoDB Atlas

---

## 📂 بنية المشروع

### Backend (`E:\Backend`)

Backend/
├── controllers/
│ ├── auth.controllers.js # register, login, logout, logoutAll, forgot, reset, verify, getMe
│ ├── users.controllers.js # getAllUsers (Admin)
│ └── courses.controllers.js # getAllCourses, getSingleCourse, createCourse, updateCourse, deleteCourse
├── models/
│ ├── user.models.js # User schema (with select:false + toJSON.transform)
│ └── courses.models.js # Course schema (title, price)
├── routes/
│ ├── auth.routes.js # /api/auth/*
│ ├── user.routes.js # /api/users/*
│ └── courses.routes.js # /api/courses/*
├── middlewares/
│ ├── verifyToken.js # يقرأ من req.cookies.token
│ ├── allowedTo.js # role-based access
│ ├── asyncWrapper.js # error wrapper for async
│ ├── validationsSchema.js # express-validator schemas
│ └── rateLimiter.js # rate limiting للـ auth
├── utils/
│ ├── appError.js # custom error class
│ ├── httpStatusText.js # SUCCESS, FAIL, ERROR
│ ├── generateJWT.js # JWT signing
│ ├── sendEmail.js # Nodemailer setup
│ └── userRoles.js # ADMIN, INSTRUCTOR, USER
├── uploads/ # صور المستخدمين والكورسات
├── index.js # نقطة البداية + MongoDB connection cache
├── .env # المتغيرات السرية
└── package.json


**Tech Stack Backend:**
- express
- mongoose
- bcryptjs
- jsonwebtoken
- validator
- express-validator
- nodemailer
- multer
- cookie-parser
- express-rate-limit
- cors
- dotenv

### Frontend (`course-project-full`)
course-project-full/
├── src/
│ ├── app/
│ │ ├── (auth)/
│ │ │ ├── login/page.tsx
│ │ │ ├── register/page.tsx
│ │ │ ├── forgot-password/page.tsx # (لسه)
│ │ │ └── reset-password/[token]/page.tsx # (لسه)
│ │ ├── (main)/
│ │ │ ├── page.tsx # Home
│ │ │ ├── profile/page.tsx # (لسه)
│ │ │ └── courses/ # (لسه)
│ │ ├── layout.tsx # AuthProvider + Navbar + Toaster
│ │ └── globals.css
│ ├── components/
│ │ ├── ui/ # shadcn components
│ │ └── Navbar.tsx # يعرض اسم المستخدم + Logout
│ ├── context/
│ │ └── AuthContext.tsx # user, isAuthenticated, refresh, logout
│ ├── lib/
│ │ ├── axios.ts # withCredentials: true
│ │ └── utils.ts # cn helper
│ ├── schema/
│ │ ├── register.schema.ts # Zod
│ │ └── login.schema.ts # Zod
│ └── middleware.ts # حماية الصفحات + API proxy
├── next.config.ts # rewrites للـ Backend
├── .env.local # NEXT_PUBLIC_API_URL
└── package.json

text

**Tech Stack Frontend:**
- next (15.x)
- react
- typescript
- tailwindcss
- shadcn/ui
- react-hook-form
- zod
- @hookform/resolvers
- axios
- sonner
- lucide-react

---

## ✅ اللي خلصناه

### Backend — Auth (كامل) ✅

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | ❌ | تسجيل مستخدم جديد (firstName, lastName, email, password, role?, avatar?) |
| POST | `/api/auth/login` | ❌ | دخول + كوكي httpOnly |
| POST | `/api/auth/logout` | ✅ | خروج من جهاز (يمسح الكوكي) |
| POST | `/api/auth/logout-all` | ✅ | خروج من كل الأجهزة (tokenVersion++) |
| POST | `/api/auth/forgot-password` | ❌ | طلب رابط reset في الإيميل |
| PATCH | `/api/auth/reset-password/:token` | ❌ | تنفيذ reset بالباسورد الجديد |
| GET | `/api/auth/verify-email/:token` | ❌ | تأكيد الإيميل |
| POST | `/api/auth/resend-verification` | ✅ | إعادة إرسال رابط التحقق |

**ملاحظات:**
- الـ login بيرجّع `{ user }` بس (مفيش token في body)
- الـ cookie اسمها `token` — `httpOnly`, `secure`, `sameSite: "lax"`
- كله بيستخدم `verifyToken` middleware (يقرأ من `req.cookies.token`)

### Backend — Users ✅

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| GET | `/api/users/me` | ✅ | any | بيانات المستخدم الحالي |
| GET | `/api/users` | ✅ | ADMIN | قائمة المستخدمين |

### Backend — Courses ✅

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| GET | `/api/courses` | ❌ | any | قائمة الكورسات |
| GET | `/api/courses/:id` | ❌ | any | تفاصيل كورس |
| POST | `/api/courses` | ✅ | any | إنشاء كورس جديد |
| PATCH | `/api/courses/:id` | ✅ | any | تحديث كورس |
| DELETE | `/api/courses/:id` | ✅ | ADMIN | حذف كورس |

### Frontend — Auth ✅

- ✅ Register Page (Zod + RHF)
- ✅ Login Page (بدون localStorage)
- ✅ AuthContext (يستخدم `/users/me`)
- ✅ Navbar (يعرض المستخدم + Logout)
- ✅ Home Page (تترحيب بالمستخدم)
- ✅ Middleware لحماية الصفحات + redirect
- ✅ Next.js Rewrites (proxy للـ Backend)
- ✅ الـ Navbar بيتحدّث تلقائيًا بعد Login (`await refresh()`)
- ✅ httpOnly Cookies فقط (لا localStorage نهائيًا)

---

## 🔐 Auth Flow

### التقنية

- **JWT** في **httpOnly cookies**
- **Access Token** فقط (مفيش refresh tokens دلوقتي)
- **Cookies:**
  - `httpOnly: true`
  - `secure: true`
  - `sameSite: "lax"`
  - `maxAge: 24 ساعة`
  - `path: "/"`
- **JWT_SECRET_KEY:** في `.env` (لازم يكون نفس الاسم في generateJWT و verifyToken)

### Endpoints

**Register:**
POST /api/auth/register
Body: { firstName, lastName, email, password, role? }
Response: { status, data: { user } }



**Login:**
POST /api/auth/login
Body: { email, password }
Response: { status, data: { user } }
Cookie: token=... (httpOnly, secure, lax)



**Get Me:**
GET /api/users/me
Cookie: token=...
Response: { status, data: { user } }



**Logout:**
POST /api/auth/logout
Response: { status, message: "Logged out" }
Cookie: cleared



**Logout All:**
POST /api/auth/logout-all
Response: { status, message: "Logged out from all devices" }
Cookie: cleared
(+ tokenVersion++ في DB)



### Frontend — Auth Flow

1. **Login:**
   ```tsx
   await api.post("/auth/login", values);
   await refresh();       // GET /users/me → setUser
   router.push("/");
Refresh Page:

AuthProvider mounted

refresh() → GET /users/me → setUser(user)

Navbar يعرض المستخدم

Logout:

tsx
await api.post("/auth/logout");
setUser(null);
router.push("/login");
User Schema — الحقول الحساسة
js
password: { type: String, required: true, select: false },
token: { type: String, select: false },
emailVerificationToken: { type: String, select: false },
emailVerificationExpires: { type: Date, select: false },
passwordResetToken: { type: String, select: false },
passwordResetExpires: { type: Date, select: false },


## Environment Variables

Frontend (Vercel → course-project-full):
NEXT_PUBLIC_API_URL=/api/backend

Backend (Vercel → course-project-ten-gules):

MONGO_URL=mongodb+srv://...
JWT_SECRET_KEY=...
CLIENT_URL=https://course-project-full.vercel.app
NODE_ENV=production
PORT=5000
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...


## lib/axios.ts

import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,   // "/api/backend"
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export default api;

## Middleware (src/middleware.ts)

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // الصفحات المحمية
  const protectedPaths = ["/profile", "/courses/create", "/my-courses"];
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // صفحات auth (لو داخل)
  const authPaths = ["/login", "/register", "/forgot-password"];
  const isAuthPage = authPaths.some((p) => pathname.startsWith(p));

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/courses/create/:path*",
    "/my-courses/:path*",
    "/login",
    "/register",
    "/forgot-password",
  ],
};