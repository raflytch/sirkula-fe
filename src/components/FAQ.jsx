"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    question: "Apa itu Sirkula?",
    answer:
      "Sirkula adalah platform berbasis AI yang mengubah aksi hijau Anda menjadi dampak terukur dan reward nyata. Kami memverifikasi setiap aksi keberlanjutan seperti pemilahan sampah, penanaman pohon, dan konsumsi produk ramah lingkungan menggunakan teknologi AI canggih.",
  },
  {
    question: "Bagaimana cara kerja Sirkula?",
    answer:
      "Cara kerja Sirkula sangat mudah: (1) Daftar dan buat akun, (2) Lakukan aksi hijau seperti pilah sampah atau tanam pohon, (3) Foto dan unggah bukti aksi Anda, (4) AI kami akan memverifikasi dan Anda mendapat poin yang bisa ditukar dengan reward dari UMKM lokal.",
  },
  {
    question: "Apa fitur utama Sirkula?",
    answer:
      "Fitur utama Sirkula meliputi: Verifikasi AI untuk memastikan keaslian aksi hijau, sistem poin dan reward yang bisa ditukar dengan produk UMKM, dashboard interaktif untuk memantau dampak lingkungan Anda, serta leaderboard komunitas untuk memotivasi aksi keberlanjutan bersama.",
  },
  {
    question: "Apakah Sirkula gratis digunakan?",
    answer:
      "Ya, Sirkula 100% gratis untuk semua warga. Tidak ada biaya pendaftaran, biaya bulanan, atau biaya tersembunyi. Kami percaya bahwa aksi keberlanjutan harus mudah diakses oleh semua orang untuk menciptakan dampak lingkungan yang maksimal.",
  },
  {
    question: "Bagaimana menukarkan poin dengan reward?",
    answer:
      "Setelah mengumpulkan poin dari aksi hijau Anda, kunjungi halaman Redeem di dashboard. Pilih voucher atau produk dari UMKM lokal yang Anda inginkan, konfirmasi penukaran, dan voucher akan dikirim ke akun Anda. Anda bisa langsung menggunakan voucher tersebut di merchant yang terdaftar.",
  },
];

export default function FAQ({ id }) {
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
            FAQ
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold bg-gradient-to-r from-emerald-600 via-emerald-500 to-yellow-500 bg-clip-text text-transparent mb-4">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-neutral-500 max-w-2xl mx-auto">
            Temukan jawaban untuk pertanyaan umum tentang Sirkula
          </p>
        </div>

        {/* FAQ Accordion */}
        <div
          className={`max-w-3xl mx-auto transition-all duration-500 delay-100 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-neutral-200 rounded-lg px-6 bg-white"
              >
                <AccordionTrigger className="text-left font-medium text-neutral-900 hover:no-underline py-5">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-neutral-600 pb-5 leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
