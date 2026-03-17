"use client";

import axios from "axios";
import { getCookie, deleteCookie } from "cookies-next/client";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const httpClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

httpClient.interceptors.request.use(
  (config) => {
    if (config.skipAuth) {
      return config;
    }

    const token = getCookie("token");

    if (!token && typeof window !== "undefined") {
      // Daftar path yang tidak memerlukan autentikasi
      const publicPaths = ["/", "/auth", "/sign-up"];
      const currentPath = window.location.pathname;
      const isPublicPath = publicPaths.some(
        (path) => currentPath === path || currentPath.startsWith(path + "/")
      );

      // Hanya redirect ke /auth jika bukan di halaman public
      if (!isPublicPath) {
        window.location.href = "/auth";
        return Promise.reject(new Error("No authentication token"));
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

httpClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      deleteCookie("token");
    }

    if (
      error.response?.status === 404 &&
      error.config?.url?.includes("/users/session")
    ) {
      deleteCookie("token");
    }

    return Promise.reject(error);
  }
);

export default httpClient;
