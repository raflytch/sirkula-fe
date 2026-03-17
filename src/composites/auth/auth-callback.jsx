"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { setCookie } from "cookies-next/client";
import { useDispatch } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { setUser } from "@/features/slices/user.slice";
import { authService } from "@/services/auth.service";
import FullscreenLoader from "@/components/ui/fullscreen-loader";

export default function AuthCallbackComposite() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get("token");
      const needsProfileCompletion = searchParams.get("needsProfileCompletion");

      if (!token) {
        toast.error("Token tidak ditemukan");
        router.push("/auth");
        return;
      }

      try {
        // Set cookie
        setCookie("token", token, {
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
        });

        // Get session data
        const sessionData = await authService.getSession();
        dispatch(setUser(sessionData.data));
        queryClient.invalidateQueries({ queryKey: ["session"] });

        toast.success("Login dengan Google berhasil!");

        // Redirect based on needsProfileCompletion or role
        if (needsProfileCompletion === "true") {
          router.push("/profile");
        } else {
          const role = sessionData.data?.role;
          switch (role) {
            case "UMKM":
              router.push("/dashboard/umkm");
              break;
            case "DLH":
              router.push("/dashboard/dinas");
              break;
            case "ADMIN":
              router.push("/dashboard/admin");
              break;
            default:
              router.push("/");
          }
        }
      } catch (error) {
        console.error("Error processing callback:", error);
        toast.error("Gagal memproses login Google");
        router.push("/auth");
      }
    };

    handleCallback();
  }, [searchParams, dispatch, queryClient]);

  return <FullscreenLoader text="Memproses login Google..." />;
}
