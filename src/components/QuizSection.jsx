"use client";

import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BorderBeam } from "@/components/ui/border-beam";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { ArrowRight, BookOpen, Target, Trophy, Sparkles } from "lucide-react";

const quizSteps = [
  {
    icon: <Sparkles />,
    title: "AI Generate Materi",
    description:
      "AI menyiapkan materi edukasi tentang lingkungan dan aksi hijau yang relevan untuk Anda pelajari.",
  },
  {
    icon: <BookOpen />,
    title: "Baca & Pahami",
    description:
      "Pelajari materi yang disediakan untuk memperluas wawasan tentang keberlanjutan lingkungan.",
  },
  {
    icon: <Target />,
    title: "Jawab Quiz",
    description:
      "Uji pemahaman Anda dengan menjawab soal-soal quiz yang dibuat berdasarkan materi.",
  },
  {
    icon: <Trophy />,
    title: "Raih Poin",
    description:
      "Dapatkan poin dari setiap jawaban benar dan tukarkan dengan reward menarik.",
  },
];

export default function QuizSection({ id }) {
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
            Quiz Berhadiah
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold bg-linear-to-r from-emerald-600 via-emerald-500 to-yellow-500 bg-clip-text text-transparent mb-4">
            Belajar Sambil Bermain, Dapat Hadiah
          </h2>
          <p className="text-neutral-500 max-w-2xl mx-auto">
            Uji pengetahuan lingkunganmu lewat quiz interaktif berbasis AI dan
            kumpulkan poin untuk ditukar reward
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto mb-10">
          {quizSteps.map((step, index) => (
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
                size={80}
                duration={7}
                delay={index * 1.5}
                colorFrom="#10b981"
                colorTo="#14b8a6"
              />
              <CardContent className="p-5 sm:p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                    {React.cloneElement(step.icon, {
                      className: "w-5 h-5 text-emerald-600",
                    })}
                  </div>
                </div>
                <div className="text-xs font-semibold text-emerald-600 mb-2">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h3 className="text-sm md:text-base font-semibold text-neutral-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-xs md:text-sm text-neutral-500 leading-relaxed">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div
          className={`flex justify-center transition-all duration-500 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <Link href="/quiz">
            <Button
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 h-12 text-base font-medium"
            >
              Mulai Quiz Sekarang
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
