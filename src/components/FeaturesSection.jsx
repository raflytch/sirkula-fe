"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BorderBeam } from "@/components/ui/border-beam";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { features } from "@/lib/constanst";

export default function FeaturesSection({ id }) {
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
            Fitur Unggulan
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold bg-gradient-to-r from-emerald-600 via-emerald-500 to-yellow-500 bg-clip-text text-transparent mb-4">
            Teknologi AI untuk Aksi Hijau Anda
          </h2>
          <p className="text-neutral-500 max-w-2xl mx-auto">
            Platform berbasis AI yang memverifikasi, merekam, dan memberikan
            reward untuk setiap aksi keberlanjutan Anda
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => (
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
                colorFrom="#14b8a6"
                colorTo="#2dd4bf"
              />
              <CardContent className="p-6">
                <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center mb-4">
                  {React.cloneElement(feature.icon, {
                    className: "w-5 h-5 text-teal-600",
                  })}
                </div>
                <h3 className="text-lg font-medium text-neutral-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-neutral-500 leading-relaxed mb-4">
                  {feature.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {feature.tags.map((tag, tagIndex) => (
                    <Badge
                      key={tagIndex}
                      variant="secondary"
                      className="bg-neutral-100 text-neutral-600 font-normal text-xs"
                    >
                      {tag.label}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
