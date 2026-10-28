بناءً على التغييرات الأخيرة (التحول من Cloudinary إلى Bunny Stream للفيديوهات، وتحديث الـ Navbar حسب الرتب، وإضافة صفحة الأرباح)، تم تحديث ملف `PROJECT_SUMMARY.md` بالكامل. 

انسخ الملف ده كامل واحفظه عندك:

```markdown
# 🎓 Courses Platform — Project Summary

> **آخر تحديث:** أكتوبر 2025
> **الغرض:** مرجع شامل لمشروع Courses Platform (Backend + Frontend)

---

## 🏗️ نظرة عامة

**المشروع:** منصة كورسات تعليمية (UI/UX مستوحى من تصميم Slash).
**التقنيات:**
- **Backend:** Node.js + Express + MongoDB (Mongoose)
- **Frontend:** Next.js 15 (App Router) + TypeScript + Tailwind + shadcn/ui
- **Auth:** JWT في httpOnly cookies
- **Storage:** Cloudinary (للصور والإيصالات) + Bunny Stream (للفيديوهات)
- **Payments:** Manual Payment (رفع إيصال + موافقة الأدمن)
- **Deploy:** Vercel (Backend + Frontend)

**الروابط:**
- Frontend: `https://course-project-full.vercel.app`
- Backend: `https://course-project-ten-gules.vercel.app`
- Database: MongoDB Atlas

---

## 📂 بنية المشروع

### Backend (`E:\Backend`)

```text
Backend/
├── config/
│   └── cloudinary.js             # إعداد Cloudinary (للصور فقط)
├── controllers/
│   ├── auth.controllers.js       # register, login, logout, logoutAll, forgot, reset, verifyEmail, resendVerification
│   ├── users.controllers.js      # getAllUsers, getMe, updateMe, changePassword, uploadAvatar, updateUserRole, deleteUser
│   ├── courses.controllers.js    # getAllCourse, getSingleCourse, CreateCourse, updateCourse, deleteCourse, enrollCourse, getMyCourses, getDashboardStats, addSection (Bunny), updateSection (Bunny), deleteSection, completeSection, getInstructorStats, getAdminStats, getPendingEnrollments, updateEnrollmentStatus, getInstructorRevenue, getAllInstructorsFinancials, getBunnyUploadSignature
│   ├── reviews.controllers.js    # createReview, getCourseReviews
│   └── notifications.controllers.js # getMyNotifications, markAsRead, markAllAsRead
├── models/
│   ├── user.models.js            # User schema
│   ├── courses.models.js         # Course schema (sections & ratings)
│   ├── enrollment.models.js      # Enrollment schema (with paymentStatus, receipt, completedSections)
│   ├── review.models.js          # Review schema (with auto-calc avg rating)
│   └── notification.models.js    # Notification schema
├── routes/
│   ├── auth.routes.js            # /api/auth/*
│   ├── user.routes.js            # /api/users/*
│   ├── courses.routes.js         # /api/courses/* (includes dashboard, admin, instructor stats, bunny signature)
│   ├── reviews.routes.js         # /api/courses/:courseId/reviews/*
│   └── notifications.routes.js   # /api/notifications/*
├── middlewares/
│   ├── verifyToken.js            # يقرأ من req.cookies.token
│   ├── optionalAuth.js           # يقرأ التوكن لو موجود
│   ├── allowedTo.js              # role-based access
│   ├── asyncWrapper.js           # error wrapper
│   ├── validationsSchema.js      # express-validator
│   ├── rateLimiter.js            # rate limiting
│   └── cloudinaryUpload.js       # multer + cloudinaryStorage (للصور والإيصالات فقط)
├── utils/
│   ├── appError.js
│   ├── httpStatusText.js
│   ├── generateJWT.js
│   ├── sendEmail.js
│   └── userRoles.js
├── index.js                      # + MongoDB connection cache + 100mb body limit
├── vercel.json                   # إعدادات Vercel
├── package.json
└── .env                          # يحتوي على CLOUDINARY_* و BUNNY_LIBRARY_ID و BUNNY_API_KEY
```

### Frontend (`course-project-full`)

```text
course-project-full/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   ├── forgot-password/page.tsx
│   │   │   └── reset-password/[token]/page.tsx
│   │   ├── (main)/
│   │   │   ├── page.tsx                  # Home (Dynamic Dashboards)
│   │   │   ├── profile/page.tsx          # Account Settings
│   │   │   ├── my-courses/page.tsx       # Enrolled Courses (with Progress Bar & Payment Status)
│   │   │   ├── admin/
│   │   │   │   ├── page.tsx              # Admin Dashboard
│   │   │   │   ├── enrollments/page.tsx  # Pending Enrollments (Approve/Reject)
│   │   │   │   └── financials/page.tsx   # Instructors Financials
│   │   │   ├── instructor/
│   │   │   │   └── revenue/page.tsx      # Instructor Revenue
│   │   │   └── courses/
│   │   │       ├── page.tsx              # Browse Catalog (Search/Filter/Ratings)
│   │   │       ├── [id]/
│   │   │       │   ├── page.tsx          # Course Details (Pending Approval status)
│   │   │       │   ├── checkout/page.tsx # Payment Page (Upload Receipt)
│   │   │       │   └── learn/page.tsx    # Learning Page (Bunny Stream Player + Progress)
│   │   │       ├── create/
│   │   │       │   ├── page.tsx          # Create Course
│   │   │       │   └── [courseId]/sections/new/page.tsx # Add Section (Bunny Upload)
│   │   │       ├── edit/[courseId]/page.tsx # Edit Course details
│   │   │       └── manage/
│   │   │           └── [courseId]/
│   │   │               ├── page.tsx      # Manage Course (Sections List)
│   │   │               └── sections/[sectionId]/edit/page.tsx # Edit Section
│   │   ├── verify-email/
│   │   │   ├── [token]/page.tsx
│   │   │   └── pending/page.tsx
│   │   ├── layout.tsx                    # AuthProvider + Navbar + Toaster
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                           # shadcn
│   │   ├── Navbar.tsx
│   │   ├── NotificationBell.tsx
│   │   └── dashboards/
│   │       ├── StudentDashboard.tsx
│   │       ├── InstructorDashboard.tsx
│   │       └── AdminDashboard.tsx
│   ├── context/
│   │   └── AuthContext.tsx               # user, refresh, logout
│   ├── lib/
│   │   ├── axios.ts                      # withCredentials: true
│   │   └── utils.ts
│   ├── schema/
│   │   ├── register.schema.ts
│   │   ├── login.schema.ts
│   │   ├── auth.schema.ts
│   │   ├── profile.schema.ts
│   │   └── course.schema.ts
│   ├── types/
│   │   └── index.ts                      # Course, Section, Lesson, Instructor, Review types
│   └── middleware.ts                     # حماية الصفحات
├── next.config.ts                        # rewrites + 100mb body limit
└── package.json
```

---

## ✅ اللي خلصناه

### Backend — Auth & Users (كامل 100%) ✅
| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| POST | `/api/auth/register` | ❌ | any | تسجيل (يفرض التحقق من الإيميل) |
| POST | `/api/auth/login` | ❌ | any | دخول + كوكي |
| POST | `/api/auth/logout` | ✅ | any | خروج |
| POST | `/api/auth/logout-all` | ✅ | any | خروج من كل الأجهزة |
| POST | `/api/auth/forgot-password` | ❌ | any | إرسال رابط reset |
| PATCH | `/api/auth/reset-password/:token` | ❌ | any | تغيير الباسورد |
| GET | `/api/auth/verify-email/:token` | ❌ | any | تأكيد الإيميل |
| POST | `/api/auth/resend-verification` | ❌ | any | إعادة إرسال رابط التحقق |
| GET | `/api/users/me` | ✅ | any | بيانات المستخدم |
| PATCH | `/api/users/me` | ✅ | any | تحديث الاسم |
| PATCH | `/api/users/me/password` | ✅ | any | تغيير الباسورد |
| POST | `/api/users/me/avatar` | ✅ | any | رفع صورة (Cloudinary) |
| GET | `/api/users` | ✅ | ADMIN | قائمة المستخدمين |
| PATCH | `/api/users/:userId/role` | ✅ | ADMIN | تغيير رتبة المستخدم |
| DELETE | `/api/users/:userId` | ✅ | ADMIN | حذف مستخدم |

### Backend — Courses, Sections, Reviews, Payments & Bunny Stream ✅
| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| GET | `/api/courses` | ❌ | any | قائمة الكورسات (تدعم الفلترة والبحث) |
| GET | `/api/courses/:id` | Optional | any | تفاصيل كورس (بيخفي الفيديوهات ويرجع حالة الدفع) |
| POST | `/api/courses` | ✅ | Instructor/Admin | إنشاء كورس + صورة |
| PATCH | `/api/courses/:id` | ✅ | Instructor/Admin | تعديل بيانات الكورس |
| DELETE | `/api/courses/:id` | ✅ | ADMIN | حذف كورس |
| POST | `/api/courses/:id/enroll` | ✅ | any | التسجيل في كورس (مع رفع إيصال الدفع) |
| GET | `/api/courses/my-courses` | ✅ | any | كورسات الطالب (مع نسبة التقدم وحالة الدفع) |
| GET | `/api/courses/dashboard-stats` | ✅ | any | إحصائيات لوحة تحكم الطالب |
| POST | `/api/courses/bunny-upload-signature` | ✅ | Instructor/Admin | جلب تصريح الرفع من Bunny Stream |
| POST | `/api/courses/:id/sections` | ✅ | Instructor/Admin | إضافة قسم (يستقبل videoId) |
| PATCH | `/api/courses/:id/sections/:sectionId` | ✅ | Instructor/Admin | تعديل قسم (يستقبل videoId) |
| DELETE | `/api/courses/:id/sections/:sectionId` | ✅ | Instructor/Admin | حذف قسم |
| POST | `/api/courses/:id/sections/:sectionId/complete` | ✅ | any | تعليم القسم كمكتمل |
| POST | `/api/courses/:id/reviews` | ✅ | any | إضافة تقييم (للمشتركين فقط) |
| GET | `/api/courses/:id/reviews` | ❌ | any | جلب تقييمات الكورس |
| GET | `/api/courses/instructor-stats` | ✅ | Instructor | إحصائيات لوحة تحكم المعلم |
| GET | `/api/courses/instructor/revenue` | ✅ | Instructor | كشف حساب المعلم |
| GET | `/api/courses/admin/dashboard-stats` | ✅ | ADMIN | إحصائيات لوحة تحكم الأدمن |
| GET | `/api/courses/admin/pending-enrollments` | ✅ | ADMIN | طلبات الاشتراك المعلقة |
| PATCH | `/api/courses/admin/enrollments/:enrollmentId` | ✅ | ADMIN | الموافقة أو رفض الاشتراك |
| GET | `/api/courses/admin/instructors-financials` | ✅ | ADMIN | تفاصيل مالية لكل معلم |
| GET | `/api/notifications` | ✅ | any | جلب الإشعارات |
| PATCH | `/api/notifications/:id/read` | ✅ | any | تعليم إشعار كمقروء |
| PATCH | `/api/notifications/read-all` | ✅ | any | تعليم كل الإشعارات كمقروءة |

### Frontend (كامل) ✅
- ✅ Auth Pages (Register, Login, Verify Email, Forgot/Reset Password).
- ✅ AuthContext + Navbar (Dynamic links based on role: Student, Instructor, Admin).
- ✅ Profile Page (Dark Theme).
- ✅ Courses Catalog (Grid view + Ratings Stars + Search & Filtering).
- ✅ Course Details (Handles unauthorized access, Pending Payment status, Reviews).
- ✅ Course Management (Create, Edit, Manage Sections).
- ✅ Add/Edit Section using **Bunny Stream** (Direct Client-Side Upload with Progress Bar).
- ✅ Learning Page (`/courses/[id]/learn`): Bunny Stream Iframe Player + "Mark as Complete".
- ✅ My Courses Page (Grid layout + Progress Bar + Payment Status Badges).
- ✅ Home Page (Divided into 3 separate components: StudentDashboard, InstructorDashboard, AdminDashboard).
- ✅ Admin Dashboard (`/admin`, `/admin/enrollments`, `/admin/financials`).
- ✅ Instructor Revenue Page (`/instructor/revenue`).
- ✅ Payment Checkout Page (`/courses/[id]/checkout`).
- ✅ NotificationBell Component.
- ✅ Middleware Protection.
- ✅ Next.js Rewrites.

---

## 🎯 القرارات التقنية (Tech Decisions)

1. **Auth:** JWT في httpOnly cookie. لا يوجد localStorage نهائيًا.
2. **Deploy:** Vercel للفرونت والباك إند (Next.js Rewrites proxy).
3. **Media (Images):** Cloudinary (`multer-storage-cloudinary`).
4. **Media (Videos):** Bunny Stream (Client-side upload using TUS, stored via `videoId`).
5. **Manual Payments:** الطالب يرفع إيصال -> الأدمن يوافق -> يتم تفعيل الكورس.
6. **Revenue Split:** 15% للمنصة، 85% للمدرس.
7. **UI/UX:** تصميم Dark Theme (Slash).
8. **Progress Tracking:** بيتم حفظ الأقسام المكتملة في الـ Enrollment Model.

---

## 🚧 الخطوة الجاية (Next Steps)

1. **صفحة 404 مخصصة (Not Found Page)**.
2. **تحسين الـ Responsive Design** (للموبايل).
3. **إضافة Refresh Tokens** لتحسين الأمان.
4. **نظام الدفع الإلكتروني (Stripe / Paymob)**.

---

## 🔑 معلومات مهمة للـ Chat الجديد

**لما تفتح chat جديد، قول:**
> "المشروع: Courses Platform (UI/UX: Slash Dark Theme).
> Backend: Express + MongoDB + JWT + Cloudinary (Images) + Bunny Stream (Videos) + Manual Payments (Vercel).
> Frontend: Next.js 15 + TS + shadcn (Vercel).
> Auth, Profile, Courses, Sections, Enrollment, Learning, Admin Dashboard, Reviews, Search/Filter, Progress Tracking, Notifications, Manual Payments, Instructor Revenue, Bunny Stream Integration خلصوا بالكامل.
> عايز نكمل في [404 Page / Responsive Design / Refresh Tokens]."

**وأرسل الملخص ده.**
```