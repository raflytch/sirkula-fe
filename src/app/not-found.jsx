"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Home, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { images } from "@/lib/constanst";

export default function NotFound() {
  const router = useRouter();
  const lottieContainer = useRef(null);

  useEffect(() => {
    let animationInstance = null;

    const loadLottie = async () => {
      try {
        const lottie = (await import("lottie-web")).default;
        const animationData = await import(
          "@/../public/animations/not-found.json"
        );

        if (lottieContainer.current) {
          animationInstance = lottie.loadAnimation({
            container: lottieContainer.current,
            renderer: "svg",
            loop: true,
            autoplay: true,
            animationData: animationData.default || animationData,
          });
        }
      } catch (error) {
        console.error("Error loading Lottie animation:", error);
      }
    };

    loadLottie();

    return () => {
      if (animationInstance) {
        animationInstance.destroy();
      }
    };
  }, []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="max-w-5xl w-full">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 lg:gap-16">
          {/* Left Column - Animation */}
          <div className="flex flex-col items-center space-y-4 sm:space-y-6 md:flex-1">
            {/* Logo */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Image
                src={images.logo}
                alt="Sirkula Logo"
                className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14"
              />
              <span className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Sirkula
              </span>
            </div>

            {/* Lottie Animation */}
            <div
              ref={lottieContainer}
              className="w-full max-w-[220px] sm:max-w-[300px] md:max-w-[350px] lg:max-w-[400px] aspect-square"
            />
          </div>

          {/* Right Column - Content */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4 sm:space-y-5 md:space-y-6 md:flex-1">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-green-50 border-2 border-green-200 rounded-full">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
              <span className="text-xs sm:text-sm font-medium text-green-700">
                Error 404
              </span>
            </div>

            {/* Heading */}
            <div className="space-y-2 sm:space-y-3">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Halaman Tidak
                <br />
                Ditemukan
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed max-w-md">
                Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
                Silakan kembali ke beranda untuk melanjutkan.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 border-2 border-green-700 w-full sm:w-auto h-10 sm:h-11 text-sm sm:text-base"
              >
                <Link href="/" className="flex items-center justify-center gap-2">
                  <Home className="w-4 h-4" />
                  Kembali ke Beranda
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-2 border-emerald-300 hover:border-emerald-400 hover:bg-emerald-50 h-10 sm:h-11 text-sm sm:text-base"
                onClick={() => router.back()}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Halaman Sebelumnya
              </Button>
            </div>

            {/* Quick Links */}
            <div className="pt-4 sm:pt-6 border-t-2 border-gray-100 w-full">
              <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                Tautan Populer:
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 sm:gap-3">
                <Link
                  href="/sirkula-green-action"
                  className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 rounded-lg text-xs sm:text-sm font-medium transition-colors"
                >
                  Sirkula-AI
                </Link>
                <Link
                  href="/leaderboard"
                  className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 rounded-lg text-xs sm:text-sm font-medium transition-colors"
                >
                  Leaderboard
                </Link>
                <Link
                  href="/reedem"
                  className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 rounded-lg text-xs sm:text-sm font-medium transition-colors"
                >
                  Tukar Poin
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
