"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Leaf, Recycle, TreePine, Users } from "lucide-react";

const impactItems = [
  {
    icon: <Recycle />,
    value: "Pemilahan Sampah",
    label:
      "Klasifikasi sampah terverifikasi AI untuk daur ulang yang lebih efektif",
  },
  {
    icon: <TreePine />,
    value: "Penanaman Pohon",
    label:
      "Setiap pohon yang ditanam tercatat sebagai kontribusi nyata terhadap lingkungan",
  },
  {
    icon: <Leaf />,
    value: "Produk Ramah Lingkungan",
    label:
      "Konsumsi produk hijau dari UMKM lokal mendukung ekonomi berkelanjutan",
  },
  {
    icon: <Users />,
    value: "Komunitas Hijau",
    label:
      "Bergabung dengan komunitas yang peduli dan saling memotivasi untuk aksi nyata",
  },
];

export default function ImpactSection({ id }) {
  const [isVisible, sectionRef] = useScrollAnimation();

  return (
    <section ref={sectionRef} className="py-16 md:py-24" id={id}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center mb-12 md:mb-16 transition-all duration-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <Badge
            variant="outline"
            className="mb-4 border-neutral-200 text-neutral-600 bg-neutral-50 px-3 py-1"
          >
            Dampak Nyata
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold bg-linear-to-r from-emerald-600 via-emerald-500 to-yellow-500 bg-clip-text text-transparent mb-4">
            Setiap Aksi Punya Dampak
          </h2>
          <p className="text-neutral-500 max-w-2xl mx-auto">
            Aksi kecil yang Anda lakukan berkontribusi pada perubahan besar bagi
            lingkungan dan komunitas
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto">
          {impactItems.map((item, index) => (
            <div
              key={index}
              className={`text-center transition-all duration-500 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                  {React.cloneElement(item.icon, {
                    className: "w-6 h-6 text-emerald-600",
                  })}
                </div>
              </div>
              <h3 className="text-base font-semibold text-neutral-900 mb-2">
                {item.value}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
