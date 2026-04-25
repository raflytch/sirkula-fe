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
import {
  DIRECT_UPLOAD_MAX_SIZE,
  VIDEO_CHUNK_UPLOAD_MAX_SIZE,
  formatFileSize,
  resolveMediaUploadStrategy,
} from "@/lib/green-action-media-rules";

const DEFAULT_ERROR_MESSAGE =
  "Ukuran file tidak sesuai aturan upload. Silakan gunakan file lain.";

export function FileSizeAlertDialog({ open, onOpenChange, maxSize, message }) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <XCircle className="h-5 w-5" />
            Ukuran File Terlalu Besar
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm">
            {message || DEFAULT_ERROR_MESSAGE}
            {maxSize ? (
              <>
                {" "}
                Batas maksimal: <strong>{formatFileSize(maxSize)}</strong>.
              </>
            ) : null}
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
  const [fileSizeLimit, setFileSizeLimit] = useState(DIRECT_UPLOAD_MAX_SIZE);
  const [fileSizeMessage, setFileSizeMessage] = useState("");

  const validateFile = useCallback((file) => {
    if (!file) return true;

    const validation = resolveMediaUploadStrategy(file);

    if (!validation.isValid) {
      setFileSizeLimit(validation.maxSize || DIRECT_UPLOAD_MAX_SIZE);
      setFileSizeMessage(validation.message || DEFAULT_ERROR_MESSAGE);
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
    fileSizeMessage,
    maxImageSize: DIRECT_UPLOAD_MAX_SIZE,
    maxVideoSize: VIDEO_CHUNK_UPLOAD_MAX_SIZE,
    maxImageSizeLabel: formatFileSize(DIRECT_UPLOAD_MAX_SIZE),
    maxVideoSizeLabel: formatFileSize(VIDEO_CHUNK_UPLOAD_MAX_SIZE),
  };
}
