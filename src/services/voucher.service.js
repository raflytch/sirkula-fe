import httpClient from "@/lib/http-client";

export const voucherService = {
  // Get all vouchers (public)
  getAllVouchers: async (params = {}) => {
    const response = await httpClient.get("/vouchers", {
      params: {
        page: params.page || 1,
        limit: params.limit || 10,
        ...(params.search && { search: params.search }),
      },
      skipAuth: true,
    });
    return response.data;
  },

  // Get voucher by ID (public)
  getVoucherById: async (id) => {
    const response = await httpClient.get(`/vouchers/${id}`, {
      skipAuth: true,
    });
    return response.data;
  },

  // Warga: Get my claims
  getMyClaims: async (params = {}) => {
    const response = await httpClient.get("/vouchers/warga/my-claims", {
      params: {
        page: params.page || 1,
        limit: params.limit || 10,
      },
    });
    return response.data;
  },

  // Warga: Get stats
  getWargaStats: async () => {
    const response = await httpClient.get("/vouchers/warga/stats");
    return response.data;
  },

  // Warga: Redeem voucher
  redeemVoucher: async (voucherId) => {
    const response = await httpClient.post(`/vouchers/${voucherId}/redeem`);
    return response.data;
  },

  // Warga: Use voucher claim
  useVoucherClaim: async (claimId) => {
    const response = await httpClient.post(
      `/vouchers/warga/claims/${claimId}/use`
    );
    return response.data;
  },

  // UMKM functions below
  createVoucher: async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("pointsRequired", data.pointsRequired);
    formData.append("discountType", data.discountType);
    formData.append("discountValue", data.discountValue);
    formData.append("quotaTotal", data.quotaTotal);
    formData.append("validFrom", data.validFrom);
    formData.append("validUntil", data.validUntil);
    if (data.image) {
      formData.append("image", data.image);
    }

    const response = await httpClient.post("/vouchers", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  updateVoucher: async ({ id, data }) => {
    const formData = new FormData();
    if (data.name) formData.append("name", data.name);
    if (data.description) formData.append("description", data.description);
    if (data.pointsRequired !== undefined)
      formData.append("pointsRequired", data.pointsRequired);
    if (data.discountType) formData.append("discountType", data.discountType);
    if (data.discountValue !== undefined)
      formData.append("discountValue", data.discountValue);
    if (data.quotaTotal !== undefined)
      formData.append("quotaTotal", data.quotaTotal);
    if (data.isActive !== undefined) formData.append("isActive", data.isActive);
    if (data.validFrom) formData.append("validFrom", data.validFrom);
    if (data.validUntil) formData.append("validUntil", data.validUntil);
    if (data.image) formData.append("image", data.image);

    const response = await httpClient.patch(`/vouchers/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  deleteVoucher: async (id) => {
    const response = await httpClient.delete(`/vouchers/${id}`);
    return response.data;
  },

  getVoucherById: async (id) => {
    const response = await httpClient.get(`/vouchers/${id}`);
    return response.data;
  },

  getMyVouchers: async (params = {}) => {
    const response = await httpClient.get("/vouchers/umkm/my-vouchers", {
      params: {
        page: params.page || 1,
        limit: params.limit || 10,
        sortBy: params.sortBy || "created_at",
        sortOrder: params.sortOrder || "desc",
        ...(params.isActive !== undefined && { isActive: params.isActive }),
        ...(params.search && { search: params.search }),
        ...(params.minPoints && { minPoints: params.minPoints }),
        ...(params.maxPoints && { maxPoints: params.maxPoints }),
        ...(params.category && { category: params.category }),
      },
    });
    return response.data;
  },

  getVoucherStats: async () => {
    const response = await httpClient.get("/vouchers/umkm/stats");
    return response.data;
  },

  verifyVoucherClaim: async (claimId) => {
    const response = await httpClient.post(
      `/vouchers/umkm/claims/${claimId}/verify`
    );
    return response.data;
  },
};
