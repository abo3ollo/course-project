import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // لو الخطأ 401 (التوكن انتهى) ولسه محاولناش نعمله Refresh قبل كده
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // ⚠️ لو إحنا أصلاً في صفحة الـ login أو الـ refresh فشل، منعملش حاجة
      if (typeof window !== "undefined" && window.location.pathname === "/login") {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        return api(originalRequest);
      } catch (refreshError) {
        // لو فشل التجديد، نطرده للـ Login
        if (typeof window !== "undefined" && window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;