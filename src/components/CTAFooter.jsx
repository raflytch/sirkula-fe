"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CTAFooter() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setIsVisible(true),
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const benefits = [
    "Gratis untuk warga",
    "Verifikasi AI instan",
    "Reward nyata",
  ];

  return (
    <>
      {/* CTA Section */}
      <section
        ref={sectionRef}
        className="py-16 md:py-24 bg-gray-900"
        style={{
          backgroundImage: `
        radial-gradient(circle at 50% 50%, 
          rgba(34, 197, 94, 0.18) 0%, 
          rgba(34, 197, 94, 0.1) 25%, 
          rgba(34, 197, 94, 0.04) 35%, 
          transparent 50%
        )
      `,
          backgroundSize: "100% 100%",
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`max-w-3xl mx-auto text-center transition-all duration-500 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold bg-linear-to-r from-yellow-600 via-yellow-500 to-emerald-500 bg-clip-text text-transparent mb-4">
              Siap Mengubah Aksi Hijau Jadi Impact Nyata?
            </h2>
            <p className="text-neutral-500 mb-8 max-w-xl mx-auto">
              Bergabunglah dengan ribuan warga yang telah membuat perbedaan
              untuk lingkungan
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
              <Link href="/sign-up">
                <Button
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 h-12 text-base font-medium w-full sm:w-auto"
                >
                  Daftar Sekarang
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="border-neutral-700 text-black hover:bg-neutral-800 hover:text-white px-6 h-12 text-base font-medium"
              >
                Hubungi Kami
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-6">
              {benefits.map((text, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2 text-neutral-500 transition-all duration-500 ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-600/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-emerald-500" />
                  </div>
                  <span className="text-sm">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-950 border-t border-neutral-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-neutral-400">
              © {new Date().getFullYear()} Sirkula. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-sm text-neutral-400 hover:text-neutral-300 transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-sm text-neutral-400 hover:text-neutral-300 transition-colors"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
