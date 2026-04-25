export const DIRECT_UPLOAD_MAX_SIZE = 1 * 1024 * 1024; // 1 MB
export const VIDEO_CHUNK_UPLOAD_MAX_SIZE = 15 * 1024 * 1024; // 15 MB
export const VIDEO_CHUNK_SIZE = 512 * 1024; // 512 KB
export const CHUNK_UPLOAD_MAX_RETRY = 2;

export const IMAGE_TOO_LARGE_MESSAGE =
  "Ukuran gambar melebihi 1 MB. Untuk gambar, upload langsung wajib <= 1 MB.";
export const VIDEO_TOO_LARGE_MESSAGE =
  "Ukuran video melebihi 15 MB. Silakan kompres video hingga maksimal 15 MB.";
export const UNSUPPORTED_MEDIA_MESSAGE =
  "Tipe file tidak didukung. Gunakan gambar atau video.";

export function isVideoFile(file) {
  return file?.type?.startsWith("video/");
}

export function isImageFile(file) {
  return file?.type?.startsWith("image/");
}

export function formatFileSize(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(0)} MB`;
}

export function resolveMediaUploadStrategy(file) {
  if (!file) {
    return {
      isValid: false,
      mode: null,
      message: "Media wajib diunggah.",
      maxSize: DIRECT_UPLOAD_MAX_SIZE,
      code: "NO_FILE",
    };
  }

  if (isImageFile(file)) {
    if (file.size <= DIRECT_UPLOAD_MAX_SIZE) {
      return {
        isValid: true,
        mode: "direct",
        maxSize: DIRECT_UPLOAD_MAX_SIZE,
      };
    }

    return {
      isValid: false,
      mode: null,
      message: IMAGE_TOO_LARGE_MESSAGE,
      maxSize: DIRECT_UPLOAD_MAX_SIZE,
      code: "IMAGE_TOO_LARGE",
    };
  }

  if (isVideoFile(file)) {
    if (file.size <= DIRECT_UPLOAD_MAX_SIZE) {
      return {
        isValid: true,
        mode: "direct",
        maxSize: DIRECT_UPLOAD_MAX_SIZE,
      };
    }

    if (file.size <= VIDEO_CHUNK_UPLOAD_MAX_SIZE) {
      return {
        isValid: true,
        mode: "chunked-video",
        maxSize: VIDEO_CHUNK_UPLOAD_MAX_SIZE,
      };
    }

    return {
      isValid: false,
      mode: null,
      message: VIDEO_TOO_LARGE_MESSAGE,
      maxSize: VIDEO_CHUNK_UPLOAD_MAX_SIZE,
      code: "VIDEO_TOO_LARGE",
    };
  }

  return {
    isValid: false,
    mode: null,
    message: UNSUPPORTED_MEDIA_MESSAGE,
    maxSize: DIRECT_UPLOAD_MAX_SIZE,
    code: "UNSUPPORTED_MEDIA",
  };
}
