"use client";

import { useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Award,
  MapPin,
  Tag,
  MessageSquare,
  Brain,
  X,
} from "lucide-react";

const AUTO_CLOSE_MS = 10000;

function ProgressBar({ durationMs, color }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/5 overflow-hidden rounded-b-lg">
      <motion.div
        className={`h-full ${color}`}
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: durationMs / 1000, ease: "linear" }}
      />
    </div>
  );
}

function AcceptedContent({ data }) {
  const locationParts = [data.locationName, data.district, data.city].filter(
    Boolean,
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.25 }}
      className="space-y-3"
    >
      <div className="flex items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 220,
            damping: 16,
            delay: 0.12,
          }}
          className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center"
        >
          <CheckCircle2 className="h-6 w-6 text-emerald-600" />
        </motion.div>
      </div>

      <div className="text-center space-y-0.5">
        <h3 className="text-base font-semibold text-emerald-700">
          Aksi Hijau Diterima!
        </h3>
        <p className="text-xs text-slate-500 line-clamp-1">
          {data.description || data.category?.replace(/_/g, " ")}
        </p>
      </div>

      <div className="space-y-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100 p-3">
        {data.aiFeedback && (
          <div className="flex items-start gap-2">
            <MessageSquare className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-emerald-700 mb-0.5">
                Feedback AI
              </p>
              <p className="text-xs text-emerald-800 leading-relaxed line-clamp-3">
                {data.aiFeedback}
              </p>
            </div>
          </div>
        )}

        {data.points != null && (
          <div className="flex items-center gap-2">
            <Award className="h-3.5 w-3.5 text-amber-500 shrink-0" />
            <div>
              <p className="text-[11px] font-medium text-emerald-700 mb-0.5">
                Poin Diperoleh
              </p>
              <span className="text-sm font-bold text-amber-600">
                +{data.points} poin
              </span>
            </div>
          </div>
        )}

        {locationParts.length > 0 && (
          <div className="flex items-start gap-2">
            <MapPin className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-emerald-700 mb-0.5">
                Lokasi
              </p>
              <p className="text-xs text-emerald-800 line-clamp-1">
                {locationParts.join(", ")}
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function RejectedContent({ details, message }) {
  const labels = details?.aiLabels || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.25 }}
      className="space-y-3"
    >
      <div className="flex items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 220,
            damping: 16,
            delay: 0.12,
          }}
          className="h-12 w-12 rounded-full bg-rose-100 flex items-center justify-center"
        >
          <XCircle className="h-6 w-6 text-rose-600" />
        </motion.div>
      </div>

      <div className="text-center space-y-0.5">
        <h3 className="text-base font-semibold text-rose-700">
          Aksi Hijau Ditolak
        </h3>
        {message && (
          <p className="text-xs text-slate-500 line-clamp-1">{message}</p>
        )}
      </div>

      <div className="space-y-2.5 rounded-lg bg-rose-50/60 border border-rose-100 p-3 max-h-[40vh] overflow-y-auto">
        {details?.aiFeedback && (
          <div className="flex items-start gap-2">
            <MessageSquare className="h-3.5 w-3.5 text-rose-600 mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-rose-700 mb-0.5">
                Feedback AI
              </p>
              <p className="text-xs text-rose-800 leading-relaxed">
                {details.aiFeedback}
              </p>
            </div>
          </div>
        )}

        {details?.rejectionInsight && (
          <div className="flex items-start gap-2">
            <Brain className="h-3.5 w-3.5 text-rose-600 mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-rose-700 mb-0.5">
                Rejection Insight
              </p>
              <p className="text-xs text-rose-800 leading-relaxed">
                {details.rejectionInsight}
              </p>
            </div>
          </div>
        )}

        {labels.length > 0 && (
          <div className="flex items-start gap-2">
            <Tag className="h-3.5 w-3.5 text-rose-600 mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-rose-700 mb-1">
                Label Terdeteksi AI
              </p>
              <div className="flex flex-wrap gap-1">
                {labels.map((label, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="bg-rose-100 text-rose-700 border-rose-200 text-[10px] px-1.5 py-0"
                  >
                    {label}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

const failureTypeLabels = {
  QUANTITY_EXCEEDED: "Batas Kuantitas",
  COOLDOWN_ACTIVE: "Cooldown Aktif",
};

function ErrorContent({ message, errorType, failureType }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.25 }}
      className="space-y-3"
    >
      <div className="flex items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 220,
            damping: 16,
            delay: 0.12,
          }}
          className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center"
        >
          <AlertTriangle className="h-6 w-6 text-amber-600" />
        </motion.div>
      </div>

      <div className="text-center space-y-0.5">
        <h3 className="text-base font-semibold text-amber-700">
          {errorType === "Forbidden" ? "Batas Tercapai" : "Gagal Mengirim"}
        </h3>
        {failureType && failureTypeLabels[failureType] && (
          <Badge
            variant="secondary"
            className="bg-amber-100 text-amber-700 border-amber-200 text-[10px]"
          >
            {failureTypeLabels[failureType]}
          </Badge>
        )}
      </div>

      <div className="space-y-2.5 rounded-lg bg-amber-50/60 border border-amber-100 p-3">
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-600 mt-0.5 shrink-0" />
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-amber-700 mb-0.5">
              Detail
            </p>
            <p className="text-xs text-amber-800 leading-relaxed">{message}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function GreenActionResultModal({
  result,
  open,
  onClose,
  autoClose = true,
}) {
  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  useEffect(() => {
    if (!open || !autoClose) return;

    const timer = setTimeout(handleClose, AUTO_CLOSE_MS);
    return () => clearTimeout(timer);
  }, [open, autoClose, handleClose]);

  if (!result) return null;

  const isAccepted = result.type === "ACCEPTED";
  const isError = result.type === "ERROR";

  const getTitle = () => {
    if (isAccepted) return "Aksi Hijau Diterima";
    if (isError) return "Gagal Mengirim Aksi";
    return "Aksi Hijau Ditolak";
  };

  const getDescription = () => {
    if (isAccepted) return "Aksi hijau Anda telah diterima oleh AI";
    if (isError) return "Terjadi kesalahan saat mengirim aksi hijau";
    return "Aksi hijau Anda ditolak oleh AI";
  };

  const getButtonColor = () => {
    if (isAccepted) return "bg-emerald-600 hover:bg-emerald-700";
    if (isError) return "bg-amber-600 hover:bg-amber-700";
    return "bg-rose-600 hover:bg-rose-700";
  };

  const getProgressColor = () => {
    if (isAccepted) return "bg-emerald-500";
    if (isError) return "bg-amber-500";
    return "bg-rose-500";
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent
        className="sm:max-w-sm max-w-[calc(100%-2rem)] p-0 overflow-hidden border-0 shadow-xl gap-0"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">{getTitle()}</DialogTitle>
        <DialogDescription className="sr-only">
          {getDescription()}
        </DialogDescription>

        <div className="relative px-5 pt-5 pb-4">
          <button
            onClick={handleClose}
            className="absolute top-2.5 right-2.5 h-7 w-7 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors z-10"
          >
            <X className="h-3.5 w-3.5 text-slate-400" />
          </button>

          <AnimatePresence mode="wait">
            {isAccepted ? (
              <AcceptedContent key="accepted" data={result.data} />
            ) : isError ? (
              <ErrorContent
                key="error"
                message={result.message}
                errorType={result.errorType}
                failureType={result.failureType}
              />
            ) : (
              <RejectedContent
                key="rejected"
                details={result.details}
                message={result.message}
              />
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="mt-3"
          >
            <Button
              onClick={handleClose}
              size="sm"
              className={`w-full ${getButtonColor()} text-white text-sm`}
            >
              {isAccepted ? "Lanjutkan" : "Mengerti"}
            </Button>
          </motion.div>

          {autoClose && (
            <ProgressBar
              durationMs={AUTO_CLOSE_MS}
              color={getProgressColor()}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
