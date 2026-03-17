import httpClient from "@/lib/http-client";

export const greenActionService = {
  getCategories: async () => {
    const response = await httpClient.get("/green-actions/categories", {
      skipAuth: true,
    });
    return response.data;
  },

  createGreenAction: async (formData) => {
    const response = await httpClient.post("/green-actions", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
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
};
