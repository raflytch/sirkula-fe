import httpClient from "@/lib/http-client";

export const authService = {
  registerUser: async (data) => {
    const response = await httpClient.post(
      "/users/auth/register",
      {
        email: data.email,
        name: data.name,
        password: data.password,
        role: "WARGA",
      },
      { skipAuth: true }
    );
    return response.data;
  },

  registerUmkm: async (data) => {
    const response = await httpClient.post(
      "/users/auth/register",
      {
        email: data.email,
        name: data.name,
        password: data.password,
        role: "UMKM",
        umkmName: data.umkmName,
        umkmDescription: data.umkmDescription,
        umkmAddress: data.umkmAddress,
        umkmCategory: data.umkmCategory,
      },
      { skipAuth: true }
    );
    return response.data;
  },

  verifyOtp: async (data) => {
    const response = await httpClient.post(
      "/users/auth/verify-otp",
      {
        email: data.email,
        code: data.code,
      },
      { skipAuth: true }
    );
    return response.data;
  },

  resendOtp: async (email) => {
    const response = await httpClient.post(
      "/users/auth/resend-otp",
      { email },
      { skipAuth: true }
    );
    return response.data;
  },

  login: async (data) => {
    const response = await httpClient.post(
      "/users/auth/login",
      {
        email: data.email,
        password: data.password,
      },
      { skipAuth: true }
    );
    return response.data;
  },

  getSession: async () => {
    const response = await httpClient.get("/users/session");
    return response.data;
  },

  updateProfile: async (data) => {
    const formData = new FormData();
    if (data.name) formData.append("name", data.name);
    if (data.currentPassword)
      formData.append("currentPassword", data.currentPassword);
    if (data.newPassword) formData.append("newPassword", data.newPassword);
    if (data.avatar) formData.append("avatar", data.avatar);

    const response = await httpClient.patch("/users/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  updateUmkmProfile: async (data) => {
    const formData = new FormData();
    if (data.umkmName) formData.append("umkmName", data.umkmName);
    if (data.umkmDescription)
      formData.append("umkmDescription", data.umkmDescription);
    if (data.umkmAddress) formData.append("umkmAddress", data.umkmAddress);
    if (data.umkmCategory) formData.append("umkmCategory", data.umkmCategory);
    if (data.logo) formData.append("logo", data.logo);

    const response = await httpClient.patch("/users/profile/umkm", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  requestDeleteAccount: async () => {
    const response = await httpClient.post("/users/account/delete/request", {
      confirmation: "DELETE MY ACCOUNT",
    });
    return response.data;
  },

  confirmDeleteAccount: async (otpCode) => {
    const response = await httpClient.delete("/users/account/delete/confirm", {
      data: { otpCode },
    });
    return response.data;
  },

  getAllUsers: async (params = {}) => {
    const response = await httpClient.get("/users", {
      params: {
        page: params.page || 1,
        limit: params.limit || 10,
        sortBy: params.sortBy || "created_at",
        sortOrder: params.sortOrder || "desc",
      },
    });
    return response.data;
  },

  getUserById: async (id) => {
    const response = await httpClient.get(`/users/${id}`);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await httpClient.delete(`/users/admin/${id}`);
    return response.data;
  },
};
