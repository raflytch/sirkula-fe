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

const MAX_FILE_SIZE = 1 * 1024 * 1024;

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(0)}MB`;
}

export function FileSizeAlertDialog({ open, onOpenChange }) {
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
            <strong>{formatFileSize(MAX_FILE_SIZE)}</strong>. Silakan pilih file
            dengan ukuran yang lebih kecil atau kompres file Anda terlebih
            dahulu.
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

  const validateFile = useCallback((file) => {
    if (file && file.size > MAX_FILE_SIZE) {
      setShowFileSizeDialog(true);
      return false;
    }
    return true;
  }, []);

  return {
    validateFile,
    showFileSizeDialog,
    setShowFileSizeDialog,
    maxFileSize: MAX_FILE_SIZE,
    maxFileSizeLabel: formatFileSize(MAX_FILE_SIZE),
  };
}
