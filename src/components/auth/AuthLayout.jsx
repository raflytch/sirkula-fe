"use client";

import Image from "next/image";
import Link from "next/link";
import { images } from "@/lib/constanst";
import GuestGuard from "./GuestGuard";

export default function AuthLayout({ children }) {
  return (
    <GuestGuard>
      <div className="min-h-screen bg-[#fefcff] relative flex flex-col">
        {/* Dreamy Sky Pink Glow */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 30% 70%, rgba(173, 216, 230, 0.35), transparent 60%),
              radial-gradient(circle at 70% 30%, rgba(255, 182, 193, 0.4), transparent 60%)`,
          }}
        />
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-6 sm:py-8">
          <Link
            href="/"
            className="flex flex-col items-center gap-2 mb-6 sm:mb-8"
          >
            <Image
              src={images.logo}
              alt="Sirkula Logo"
              className="w-16 h-16 sm:w-20 sm:h-20"
            />
          </Link>
          {children}
        </div>
      </div>
    </GuestGuard>
  );
}
