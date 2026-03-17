"use client";

import Lottie from "lottie-react";
import loadingAnimation from "../../../public/animations/loading.json";

export default function FullscreenLoader({ text }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md">
      <div className="w-32 h-32 sm:w-40 sm:h-40">
        <Lottie animationData={loadingAnimation} loop={true} autoplay={true} />
      </div>
      {text && (
        <p className="mt-6 text-sm sm:text-base text-white font-medium drop-shadow-lg">
          {text}
        </p>
      )}
    </div>
  );
}
