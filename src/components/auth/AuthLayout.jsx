"use client";

import Image from "next/image";
import Link from "next/link";
import { images } from "@/lib/constanst";
import GuestGuard from "./GuestGuard";

export default function AuthLayout({ children }) {
  return (
    <GuestGuard>
      <div className="min-h-screen bg-gradient-to-br from-green-50/60 via-white to-emerald-50/40 relative flex flex-col">
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 80%, rgba(134, 239, 172, 0.15), transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(167, 243, 208, 0.2), transparent 50%)`,
          }}
        />
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-5 py-8 sm:py-12">
          <Link
            href="/"
            className="flex flex-col items-center gap-2 mb-8 sm:mb-10"
          >
            <Image
              src={images.logo}
              alt="Sirkula Logo"
              className="w-18 h-18 sm:w-22 sm:h-22"
            />
          </Link>
          {children}
        </div>
      </div>
    </GuestGuard>
  );
}
