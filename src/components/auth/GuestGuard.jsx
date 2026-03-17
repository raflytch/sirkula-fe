"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next/client";
import FullscreenLoader from "@/components/ui/fullscreen-loader";

export default function GuestGuard({ children }) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = getCookie("token");
    if (token) {
      setIsAuthenticated(true);
      router.replace("/");
    } else {
      setIsChecking(false);
    }
  }, [router]);

  // Show loading while checking auth status or redirecting
  if (isChecking || isAuthenticated) {
    return <FullscreenLoader text="Memeriksa autentikasi..." />;
  }

  return <>{children}</>;
}
