import httpClient from "@/lib/http-client";

const CHUNK_SIZE = 1 * 1024 * 1024; // 1MB per chunk
const DIRECT_UPLOAD_THRESHOLD = 1.5 * 1024 * 1024; // 1.5MB

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

/**
 * Direct upload for small files (<= 1.5MB)
 */
async function directUpload(formData) {
  const response = await httpClient.post("/green-actions", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

/**
 * Upload file in chunks, then submit the green action.
 * Files <= 1.5MB use direct multipart upload.
 * Files > 1.5MB are split into 1MB base64 chunks.
 *
 * @param {File} file - The media file to upload
 * @param {FormData} actionFormData - FormData with action fields (category, subCategory, etc.)
 * @returns {Promise<object>} API response data
 */
export async function submitGreenActionWithChunkedUpload(file, actionFormData) {
  // Small file: direct multipart upload (no chunking needed)
  if (file.size <= DIRECT_UPLOAD_THRESHOLD) {
    actionFormData.append("media", file);
    return directUpload(actionFormData);
  }

  // Step 1: Init chunked upload session
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

  const { data: initRes } = await httpClient.post(
    "/green-actions/upload/init",
    {
      fileName: file.name,
      mimeType: file.type,
      totalSize: file.size,
      totalChunks,
    },
  );

  const uploadId = initRes.data.uploadId;

  // Step 2: Send chunks sequentially
  for (let i = 0; i < totalChunks; i++) {
    const start = i * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, file.size);
    const blob = file.slice(start, end);

    const base64 = await blobToBase64(blob);

    await httpClient.post("/green-actions/upload/chunk", {
      uploadId,
      chunkIndex: i,
      data: base64,
    });
  }

  // Step 3: Submit green action with mediaUploadId
  actionFormData.append("mediaUploadId", uploadId);

  const { data: result } = await httpClient.post(
    "/green-actions",
    actionFormData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );

  return result;
}
