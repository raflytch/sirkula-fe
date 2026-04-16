"use client";

import { useState, useCallback } from "react";
import { XCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const MAX_IMAGE_SIZE = 1 * 1024 * 1024; // 1MB for images
const MAX_VIDEO_SIZE = 10 * 1024 * 1024; // 10MB for videos

const VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime", // .mov
];

function isVideoFile(file) {
  return file?.type?.startsWith("video/");
}

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(0)}MB`;
}

export function FileSizeAlertDialog({ open, onOpenChange, maxSize }) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <XCircle className="h-5 w-5" />
            Ukuran File Terlalu Besar
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm">
            File yang Anda pilih melebihi batas maksimal{" "}
            <strong>{formatFileSize(maxSize || MAX_IMAGE_SIZE)}</strong>.
            Silakan pilih file dengan ukuran yang lebih kecil atau kompres file
            Anda terlebih dahulu.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction className="bg-emerald-600 hover:bg-emerald-700">
            Mengerti
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function useFileValidation() {
  const [showFileSizeDialog, setShowFileSizeDialog] = useState(false);
  const [fileSizeLimit, setFileSizeLimit] = useState(MAX_IMAGE_SIZE);

  const validateFile = useCallback((file) => {
    if (!file) return true;

    const maxSize = isVideoFile(file) ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;

    if (file.size > maxSize) {
      setFileSizeLimit(maxSize);
      setShowFileSizeDialog(true);
      return false;
    }
    return true;
  }, []);

  return {
    validateFile,
    showFileSizeDialog,
    setShowFileSizeDialog,
    fileSizeLimit,
    maxImageSize: MAX_IMAGE_SIZE,
    maxVideoSize: MAX_VIDEO_SIZE,
    maxImageSizeLabel: formatFileSize(MAX_IMAGE_SIZE),
    maxVideoSizeLabel: formatFileSize(MAX_VIDEO_SIZE),
  };
}
