import httpClient from "@/lib/http-client";
import { submitGreenActionWithChunkedUpload } from "@/lib/chunked-upload";

export const greenActionService = {
  getCategories: async () => {
    const response = await httpClient.get("/green-actions/categories", {
      skipAuth: true,
    });
    return response.data;
  },

  createGreenAction: async ({ file, ...actionData }) => {
    const formData = new FormData();
    formData.append("category", actionData.category);
    formData.append("subCategory", actionData.subCategory);
    formData.append("quantity", String(actionData.quantity));
    formData.append("latitude", String(actionData.latitude));
    formData.append("longitude", String(actionData.longitude));
    if (actionData.description)
      formData.append("description", actionData.description);
    if (actionData.actionType)
      formData.append("actionType", actionData.actionType);

    return submitGreenActionWithChunkedUpload(file, formData);
  },

  getMyGreenActions: async (params = {}) => {
    const response = await httpClient.get("/green-actions/me", { params });
    return response.data;
  },

  getMyStats: async () => {
    const response = await httpClient.get("/green-actions/me/stats");
    return response.data;
  },

  getGreenActionById: async (id) => {
    const response = await httpClient.get(`/green-actions/${id}`);
    return response.data;
  },

  deleteGreenAction: async (id) => {
    const response = await httpClient.delete(`/green-actions/${id}`);
    return response.data;
  },

  retryVerification: async (id) => {
    const response = await httpClient.post(`/green-actions/${id}/retry`);
    return response.data;
  },

  getAllGreenActions: async (params = {}) => {
    const response = await httpClient.get("/green-actions", { params });
    return response.data;
  },

  getImpact: async () => {
    const response = await httpClient.get("/green-actions/impact");
    return response.data;
  },

  getDistricts: async () => {
    const response = await httpClient.get("/green-actions/districts");
    return response.data;
  },

  downloadReportPdf: async (district) => {
    const response = await httpClient.get("/green-actions/reports/pdf", {
      params: { district },
      responseType: "blob",
    });
    return response.data;
  },

  downloadReportExcel: async (district) => {
    const response = await httpClient.get("/green-actions/reports/excel", {
      params: { district },
      responseType: "blob",
    });
    return response.data;
  },

  getFlaggedActions: async (params = {}) => {
    const response = await httpClient.get("/green-actions/flagged", { params });
    return response.data;
  },

  approveFlaggedAction: async (id) => {
    const response = await httpClient.post(
      `/green-actions/flagged/${encodeURIComponent(id)}/approve`,
    );
    return response.data;
  },

  rejectFlaggedAction: async (id) => {
    const response = await httpClient.post(
      `/green-actions/flagged/${encodeURIComponent(id)}/reject`,
    );
    return response.data;
  },
};
