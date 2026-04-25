import httpClient from "@/lib/http-client";
import {
  CHUNK_UPLOAD_MAX_RETRY,
  VIDEO_CHUNK_SIZE,
  resolveMediaUploadStrategy,
} from "@/lib/green-action-media-rules";

function appendActionFieldsToFormData(formData, actionData) {
  Object.entries(actionData).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    formData.append(key, String(value));
  });
}

/**
 * Convert Blob to raw base64 string (no data URI prefix)
 */
function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function directUpload(file, actionData) {
  const formData = new FormData();
  appendActionFieldsToFormData(formData, actionData);
  formData.append("media", file);

  const response = await httpClient.post("/green-actions", formData);

  return response.data;
}

async function initChunkedUpload(file, totalChunks) {
  const response = await httpClient.post("/green-actions/upload/init", {
    fileName: file.name,
    mimeType: file.type,
    totalSize: file.size,
    totalChunks,
  });

  const uploadId = response.data?.data?.uploadId || response.data?.uploadId;

  if (!uploadId) {
    throw new Error("Gagal memulai sesi upload video.");
  }

  return uploadId;
}

async function uploadChunkWithRetry({ uploadId, chunkIndex, data }) {
  let attempt = 0;

  while (attempt <= CHUNK_UPLOAD_MAX_RETRY) {
    try {
      await httpClient.post("/green-actions/upload/chunk", {
        uploadId,
        chunkIndex,
        data,
      });
      return;
    } catch (error) {
      if (attempt === CHUNK_UPLOAD_MAX_RETRY) {
        throw error;
      }
      attempt += 1;
    }
  }
}

export async function submitGreenActionWithChunkedUpload({
  file,
  actionData,
  onChunkProgress,
}) {
  const uploadStrategy = resolveMediaUploadStrategy(file);

  if (!uploadStrategy.isValid) {
    throw new Error(uploadStrategy.message);
  }

  if (uploadStrategy.mode === "direct") {
    return directUpload(file, actionData);
  }

  const totalChunks = Math.ceil(file.size / VIDEO_CHUNK_SIZE);
  const uploadId = await initChunkedUpload(file, totalChunks);

  onChunkProgress?.({
    uploadedChunks: 0,
    totalChunks,
    percent: 0,
  });

  for (let i = 0; i < totalChunks; i++) {
    const start = i * VIDEO_CHUNK_SIZE;
    const end = Math.min(start + VIDEO_CHUNK_SIZE, file.size);
    const blob = file.slice(start, end);
    const base64 = await blobToBase64(blob);

    await uploadChunkWithRetry({
      uploadId,
      chunkIndex: i,
      data: base64,
    });

    const uploadedChunks = i + 1;
    const percent = Math.round((uploadedChunks / totalChunks) * 100);

    onChunkProgress?.({
      uploadedChunks,
      totalChunks,
      percent,
    });
  }

  const chunkedPayload = {
    ...actionData,
    mediaUploadId: uploadId,
  };

  const response = await httpClient.post("/green-actions", chunkedPayload);

  return response.data;
}
