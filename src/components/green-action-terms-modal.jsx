"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Leaf,
  Camera,
  MapPin,
  Scale,
  Clock,
  Shield,
  Brain,
  AlertTriangle,
  Users,
} from "lucide-react";

const TERMS_STORAGE_KEY = "sirkula-ga-terms";
const TERMS_DURATION_LONG = 24 * 60 * 60 * 1000;
const TERMS_DURATION_SHORT = 2 * 60 * 60 * 1000;

function getTermsAccepted(userId) {
  try {
    const raw = localStorage.getItem(TERMS_STORAGE_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);
    const entry = data[userId];
    if (!entry) return false;
    const duration = entry.duration ?? TERMS_DURATION_LONG;
    if (Date.now() - entry.timestamp > duration) {
      delete data[userId];
      localStorage.setItem(TERMS_STORAGE_KEY, JSON.stringify(data));
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

function setTermsAccepted(userId, duration) {
  try {
    const raw = localStorage.getItem(TERMS_STORAGE_KEY);
    const data = raw ? JSON.parse(raw) : {};
    data[userId] = { timestamp: Date.now(), duration };
    localStorage.setItem(TERMS_STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

const termsItems = [
  {
    icon: Camera,
    color: "text-blue-600",
    bg: "bg-blue-50",
    title: "Foto/Video Wajib",
    desc: "Setiap aksi hijau harus disertai bukti foto atau video yang jelas dan relevan dengan aktivitas yang dilakukan.",
  },
  {
    icon: MapPin,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    title: "Lokasi (GPS) Wajib",
    desc: "Koordinat lokasi harus valid dan sesuai dengan tempat aksi dilakukan.",
  },
  {
    icon: Scale,
    color: "text-violet-600",
    bg: "bg-violet-50",
    title: "Kuantitas Harus Jujur",
    desc: "Jumlah yang diinput harus sesuai dengan yang terlihat di bukti foto/video. Batas kuantitas berlaku per aksi dan per hari.",
  },
  {
    icon: Clock,
    color: "text-amber-600",
    bg: "bg-amber-50",
    title: "Cooldown Antar Aksi",
    desc: "Terdapat jeda waktu antar aksi pada kategori yang sama (15–120 menit tergantung kategori).",
  },
  {
    icon: AlertTriangle,
    color: "text-orange-600",
    bg: "bg-orange-50",
    title: "Maksimal 3 Aksi/Hari per Kategori",
    desc: "Anda hanya dapat mengirimkan maksimal 3 aksi per hari untuk setiap kategori. Batas ini berlaku secara terpisah untuk masing-masing kategori.",
  },
  {
    icon: Brain,
    color: "text-teal-600",
    bg: "bg-teal-50",
    title: "Verifikasi oleh AI",
    desc: "Setiap aksi akan diverifikasi oleh AI. Jika bukti tidak relevan atau mencurigakan, aksi akan ditolak dan feedback diberikan.",
  },
  {
    icon: Shield,
    color: "text-rose-600",
    bg: "bg-rose-50",
    title: "Aksi Mencurigakan Akan Ditinjau",
    desc: "Aksi yang terindikasi kecurangan akan di-flag untuk review admin. Poin ditahan sementara hingga proses selesai.",
  },
  {
    icon: Users,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    title: "Trust Level Mempengaruhi Limit",
    desc: "User baru mendapat limit lebih ketat. Setelah 10 aksi terverifikasi, limit akan meningkat ke level standar.",
  },
];

export default function GreenActionTermsModal({ userId, onAccept }) {
  const [open, setOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    if (!userId) return;
    if (!getTermsAccepted(userId)) {
      setOpen(true);
    } else {
      onAccept?.();
    }
  }, [userId]);

  const handleAccept = () => {
    const duration = dontShowAgain ? TERMS_DURATION_LONG : TERMS_DURATION_SHORT;
    setTermsAccepted(userId, duration);
    setOpen(false);
    onAccept?.();
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-lg max-w-[calc(100%-2rem)] p-0 overflow-hidden border-0 shadow-xl gap-0 [&>button]:hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogTitle className="sr-only">
          Syarat & Ketentuan Green Action
        </DialogTitle>
        <DialogDescription className="sr-only">
          Baca dan setujui syarat sebelum melanjutkan
        </DialogDescription>

        <div className="px-5 pt-5 pb-2">
          <div className="flex items-center justify-center mb-3">
            <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
              <Leaf className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
          <div className="text-center space-y-1 mb-4">
            <h3 className="text-lg font-semibold text-slate-900">
              Syarat & Ketentuan
            </h3>
            <p className="text-xs text-slate-500">
              Harap baca dan pahami ketentuan berikut sebelum mengirimkan aksi
              hijau
            </p>
          </div>
        </div>

        <ScrollArea className="max-h-[50vh] px-5">
          <div className="space-y-3 pb-2">
            {termsItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/40"
                >
                  <div
                    className={`h-8 w-8 rounded-lg ${item.bg} flex items-center justify-center shrink-0 mt-0.5`}
                  >
                    <Icon className={`h-4 w-4 ${item.color}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800">
                      {item.title}
                    </p>
                    <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="shrink-0 text-[10px] bg-slate-100 text-slate-500 border-slate-200"
                  >
                    {i + 1}
                  </Badge>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        <div className="px-5 pt-3 pb-5 space-y-3 border-t border-slate-100">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <Checkbox
              checked={dontShowAgain}
              onCheckedChange={(v) => setDontShowAgain(!!v)}
              className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
            />
            <span className="text-xs text-slate-600">
              Jangan tampilkan lagi selama 24 jam
            </span>
          </label>

          <Button
            onClick={handleAccept}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            size="sm"
          >
            Saya Setuju & Lanjutkan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
