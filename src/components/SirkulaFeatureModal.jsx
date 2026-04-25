"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  Bot,
  Sparkles,
  Gift,
  BarChart3,
  Camera,
  ScanEye,
  Trophy,
  CheckCircle2,
  ArrowRight,
  Leaf,
  Recycle,
} from "lucide-react";

const featureCards = [
  {
    icon: Bot,
    title: "Verifikasi AI Otomatis",
    description:
      "Bukti foto atau video diperiksa AI untuk memastikan aksi hijau valid.",
    tone: "from-sky-50 to-cyan-50 border-sky-200 text-sky-700",
  },
  {
    icon: Sparkles,
    title: "Skor Kualitas Aksi",
    description:
      "Setiap aksi mendapat skor agar pengguna tahu kualitas kontribusinya.",
    tone: "from-emerald-50 to-teal-50 border-emerald-200 text-emerald-700",
  },
  {
    icon: Gift,
    title: "Poin & Reward",
    description:
      "Aksi terverifikasi langsung dikonversi menjadi poin yang bisa ditukar.",
    tone: "from-amber-50 to-yellow-50 border-amber-200 text-amber-700",
  },
  {
    icon: BarChart3,
    title: "Dashboard Dampak",
    description:
      "Lihat total aksi, tren bulanan, dan dampak kolektif pengguna Sirkula.",
    tone: "from-violet-50 to-fuchsia-50 border-violet-200 text-violet-700",
  },
];

const steps = [
  {
    id: 1,
    icon: Camera,
    title: "Lakukan Aksi & Upload Bukti",
    description:
      "Pilih kategori, isi kuantitas, tentukan lokasi, lalu upload bukti aksi hijau Anda.",
    highlights: [
      "Foto/video wajib jelas dan relevan",
      "Lokasi GPS dipakai untuk validasi",
      "Video besar diunggah otomatis per chunk",
    ],
  },
  {
    id: 2,
    icon: ScanEye,
    title: "Sistem Verifikasi AI",
    description:
      "AI akan mengecek kecocokan bukti, kualitas aksi, dan mendeteksi anomali secara otomatis.",
    highlights: [
      "Dapat feedback AI secara langsung",
      "Mencegah tindakan spam/curang",
      "Status aksi: menunggu, terverifikasi, atau ditolak",
    ],
  },
  {
    id: 3,
    icon: Trophy,
    title: "Dapatkan Poin & Pantau Dampak",
    description:
      "Setiap aksi valid menambah poin Anda, lalu pantau dampak kontribusi di dashboard Sirkula.",
    highlights: [
      "Poin bisa ditukar reward",
      "Riwayat aksi tersimpan rapi",
      "Kontribusi lingkungan terukur",
    ],
  },
];

export default function SirkulaFeatureModal({ open, onOpenChange }) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (open) setActiveStep(0);
  }, [open]);

  const selectedStep = useMemo(() => steps[activeStep], [activeStep]);
  const SelectedStepIcon = selectedStep?.icon || Camera;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-w-[calc(100%-1.5rem)] p-0 border-0 overflow-hidden gap-0">
        <DialogHeader className="px-5 sm:px-7 pt-6 pb-5 bg-linear-to-br from-emerald-600 via-emerald-500 to-teal-500 text-white">
          <Badge className="w-fit mb-3 bg-white/20 text-white border-white/30 hover:bg-white/20">
            <Leaf className="h-3.5 w-3.5 mr-1" />
            Kenali Sirkula Lebih Dekat
          </Badge>
          <DialogTitle className="text-xl sm:text-2xl font-semibold leading-tight">
            Panduan Singkat Fitur Sirkula
          </DialogTitle>
          <DialogDescription className="text-emerald-50/95 text-sm sm:text-base">
            Pelajari fitur inti dan alur penggunaan Sirkula dalam 3 langkah
            sederhana.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[75vh] overflow-y-auto px-5 sm:px-7 py-5 sm:py-6 space-y-6 bg-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {featureCards.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className={cn(
                    "rounded-xl border p-3.5 bg-linear-to-br",
                    feature.tone,
                  )}
                >
                  <div className="h-9 w-9 rounded-lg bg-white/70 flex items-center justify-center mb-2.5">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <p className="text-sm font-semibold mb-1 leading-snug">
                    {feature.title}
                  </p>
                  <p className="text-xs leading-relaxed text-black/70">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-base sm:text-lg font-semibold text-slate-900">
                  Cara Penggunaan (1-2-3)
                </p>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Ikuti alur ini untuk memulai aksi hijau pertama Anda.
                </p>
              </div>
              <Recycle className="h-5 w-5 text-emerald-600 shrink-0" />
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4">
              {steps.map((step, index) => (
                <Button
                  key={step.id}
                  type="button"
                  variant="outline"
                  onClick={() => setActiveStep(index)}
                  className={cn(
                    "h-auto py-2.5 px-2 border-slate-300",
                    index === activeStep &&
                      "border-emerald-500 bg-emerald-50 text-emerald-700 hover:bg-emerald-50",
                  )}
                >
                  <span className="text-xs sm:text-sm font-semibold">
                    Langkah {step.id}
                  </span>
                </Button>
              ))}
            </div>

            <div className="mt-4 grid lg:grid-cols-[0.95fr_1.25fr] gap-4">
              <div className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-2.5">
                {steps.map((step, index) => {
                  const StepIcon = step.icon;
                  const isActive = index === activeStep;
                  return (
                    <div
                      key={step.id}
                      className={cn(
                        "rounded-lg border px-3 py-2.5 transition-colors",
                        isActive
                          ? "border-emerald-300 bg-emerald-50"
                          : "border-slate-200 bg-white",
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "h-7 w-7 rounded-md flex items-center justify-center",
                            isActive
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-100 text-slate-500",
                          )}
                        >
                          <StepIcon className="h-3.5 w-3.5" />
                        </div>
                        <p
                          className={cn(
                            "text-xs sm:text-sm font-medium leading-snug",
                            isActive ? "text-emerald-800" : "text-slate-600",
                          )}
                        >
                          {step.title}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-xl border border-emerald-200 bg-linear-to-br from-white to-emerald-50 p-4">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="h-9 w-9 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                    <SelectedStepIcon className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-emerald-700">
                      Langkah {selectedStep?.id}
                    </p>
                    <p className="text-base font-semibold text-slate-900 leading-tight">
                      {selectedStep?.title}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-slate-700 leading-relaxed">
                  {selectedStep?.description}
                </p>

                <Separator className="my-3.5" />

                <div className="space-y-2">
                  {selectedStep?.highlights?.map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-2 text-sm text-slate-700"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                disabled={activeStep === 0}
                className="border-slate-300"
              >
                Kembali
              </Button>

              {activeStep < steps.length - 1 ? (
                <Button
                  type="button"
                  onClick={() =>
                    setActiveStep((prev) =>
                      Math.min(steps.length - 1, prev + 1),
                    )
                  }
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Lanjut
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Siap Mulai Aksi Hijau
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
