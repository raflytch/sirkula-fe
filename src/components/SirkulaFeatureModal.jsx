"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
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
  const router = useRouter();

  useEffect(() => {
    if (open) setActiveStep(0);
  }, [open]);

  const selectedStep = useMemo(() => steps[activeStep], [activeStep]);
  const SelectedStepIcon = selectedStep?.icon || Camera;
  const progress = ((activeStep + 1) / steps.length) * 100;

  const handleStartAction = () => {
    onOpenChange(false);
    router.push("/sirkula-green-action");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl max-w-[calc(100%-1rem)] p-0 border-0 overflow-hidden gap-0 bg-transparent shadow-none [&>button]:text-white/80 [&>button]:hover:text-white [&>button]:data-[state=open]:bg-white/10">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="relative overflow-hidden rounded-3xl border border-emerald-200/70 bg-white shadow-2xl"
        >
          <div className="pointer-events-none absolute -top-24 -right-20 h-64 w-64 rounded-full bg-emerald-300/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-teal-300/20 blur-3xl" />

          <DialogHeader className="relative px-5 sm:px-7 pt-5 pb-5 bg-linear-to-br from-emerald-700 via-emerald-600 to-teal-600 text-white">
            <Badge className="w-fit mb-3 bg-white/20 text-white border-white/30 hover:bg-white/20">
              <Leaf className="h-3.5 w-3.5 mr-1" />
              Kenali Sirkula Lebih Dekat
            </Badge>

            <DialogTitle className="text-xl sm:text-2xl font-semibold leading-tight max-w-2xl">
              Panduan Fitur Sirkula yang Lebih Interaktif
            </DialogTitle>

            <DialogDescription className="text-emerald-50/95 text-sm sm:text-base max-w-2xl">
              Pelajari alur aksi hijau dalam 3 langkah praktis, lalu mulai
              kontribusi pertamamu sekarang juga.
            </DialogDescription>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {featureCards.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06 * index + 0.1, duration: 0.25 }}
                    className="rounded-xl border border-white/25 bg-white/10 backdrop-blur-sm px-2.5 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-md bg-white/20 flex items-center justify-center">
                        <Icon className="h-4 w-4" />
                      </div>
                      <p className="text-xs sm:text-sm font-medium leading-tight">
                        {feature.title}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </DialogHeader>

          <div className="relative max-h-[68vh] overflow-y-auto px-4 sm:px-6 lg:px-7 py-5 space-y-4 bg-linear-to-b from-white via-emerald-50/30 to-white">
            <div className="rounded-2xl border border-emerald-100 bg-white/90 p-3 sm:p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3 mb-3">
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

              <div className="h-2 rounded-full bg-emerald-100 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-linear-to-r from-emerald-500 to-teal-500"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                />
              </div>

              <div className="grid grid-cols-3 gap-2 mt-3.5">
                {steps.map((step, index) => {
                  const isActive = index === activeStep;

                  return (
                    <Button
                      key={step.id}
                      type="button"
                      variant="outline"
                      onClick={() => setActiveStep(index)}
                      className={cn(
                        "h-auto py-2 px-1.5 border-slate-300 rounded-xl transition-all",
                        isActive
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700 hover:bg-emerald-50 shadow-sm"
                          : "hover:bg-slate-50",
                      )}
                    >
                      <span className="text-xs sm:text-sm font-semibold">
                        Langkah {step.id}
                      </span>
                    </Button>
                  );
                })}
              </div>

              <div className="mt-3.5 grid lg:grid-cols-[1fr_1.35fr] gap-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-3 space-y-2">
                  {steps.map((step, index) => {
                    const StepIcon = step.icon;
                    const isActive = index === activeStep;

                    return (
                      <motion.button
                        key={step.id}
                        type="button"
                        onClick={() => setActiveStep(index)}
                        whileHover={{ x: 3 }}
                        whileTap={{ scale: 0.98 }}
                        className={cn(
                          "w-full rounded-xl border px-3 py-2 text-left transition-colors",
                          isActive
                            ? "border-emerald-300 bg-emerald-50"
                            : "border-slate-200 bg-white hover:bg-slate-50",
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
                      </motion.button>
                    );
                  })}
                </div>

                <div className="rounded-2xl border border-emerald-200 bg-linear-to-br from-white to-emerald-50 p-3.5">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedStep?.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                    >
                      <div className="flex items-center gap-2.5 mb-2">
                        <motion.div
                          key={`icon-${selectedStep?.id}`}
                          initial={{ rotate: -8, scale: 0.9 }}
                          animate={{ rotate: 0, scale: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 240,
                            damping: 18,
                          }}
                          className="h-9 w-9 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700"
                        >
                          <SelectedStepIcon className="h-4.5 w-4.5" />
                        </motion.div>
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

                      <Separator className="my-3" />

                      <div className="space-y-2">
                        {selectedStep?.highlights?.map((item, index) => (
                          <motion.div
                            key={item}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              delay: index * 0.05 + 0.08,
                              duration: 0.2,
                            }}
                            className="flex items-start gap-2 text-sm text-slate-700"
                          >
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                            <span>{item}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </AnimatePresence>
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
                    onClick={handleStartAction}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    Siap Mulai Aksi Hijau
                  </Button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
