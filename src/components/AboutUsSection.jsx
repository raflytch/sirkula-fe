"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BorderBeam } from "@/components/ui/border-beam";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { CheckCircle, Gift, BarChart3 } from "lucide-react";

const aboutUsItems = [
  {
    icon: <CheckCircle />,
    title: "Aksi Hijau Terverifikasi",
    description:
      "Setiap aksi pemilah sampah, penanaman pohon, dan konsumsi produk ramah lingkungan Anda diverifikasi menggunakan teknologi AI canggih untuk memastikan keaslian dan dampak nyata.",
  },
  {
    icon: <Gift />,
    title: "Reward ke UMKM",
    description:
      "Tukarkan poin Anda dengan voucher dan produk dari UMKM lokal. Setiap reward yang Anda dapatkan turut mendukung pertumbuhan ekonomi komunitas sekitar.",
  },
  {
    icon: <BarChart3 />,
    title: "Dampak Terukur",
    description:
      "Lihat dampak nyata dari setiap aksi hijau Anda melalui dashboard interaktif. Pantau kontribusi Anda terhadap pengurangan emisi karbon dan pelestarian lingkungan.",
  },
];

export default function AboutUsSection({ id }) {
  const [isVisible, sectionRef] = useScrollAnimation();

  return (
    <section ref={sectionRef} className="py-16 md:py-24" id={id}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className={`text-center mb-12 md:mb-16 transition-all duration-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <Badge
            variant="outline"
            className="mb-4 border-neutral-200 text-neutral-600 bg-neutral-50 px-3 py-1"
          >
            Tentang Kami
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold bg-gradient-to-r from-emerald-600 via-emerald-500 to-yellow-500 bg-clip-text text-transparent mb-4">
            Apa itu Sirkula
          </h2>
          <p className="text-neutral-500 max-w-2xl mx-auto">
            Platform berbasis AI yang mengubah aksi hijau Anda menjadi dampak
            terukur dan reward nyata
          </p>
        </div>

        {/* About Us Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
          {aboutUsItems.map((item, index) => (
            <Card
              key={index}
              className={`relative border border-neutral-200 bg-white hover:border-neutral-300 transition-all duration-300 overflow-hidden ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <BorderBeam
                size={100}
                duration={8}
                delay={index * 2}
                colorFrom="#10b981"
                colorTo="#eab308"
              />
              <CardContent className="p-6">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center mb-4">
                  {React.cloneElement(item.icon, {
                    className: "w-5 h-5 text-emerald-600",
                  })}
                </div>
                <h3 className="text-lg font-medium text-neutral-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
