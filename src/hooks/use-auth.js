"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setCookie, getCookie, deleteCookie } from "cookies-next/client";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import {
  setUser,
  clearUser,
  setLoading,
  setError,
} from "@/features/slices/user.slice";
import { toast } from "sonner";

export const useRegisterUser = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: authService.registerUser,
    onSuccess: (data, variables) => {
      toast.success("Registrasi berhasil! Silakan verifikasi email Anda.");
      router.push(`/sign-up/otp?email=${encodeURIComponent(variables.email)}`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Registrasi gagal");
    },
  });
};

export const useRegisterUmkm = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: authService.registerUmkm,
    onSuccess: (data, variables) => {
      toast.success("Registrasi UMKM berhasil! Silakan verifikasi email Anda.");
      router.push(`/sign-up/otp?email=${encodeURIComponent(variables.email)}`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Registrasi gagal");
    },
  });
};

export const useVerifyOtp = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.verifyOtp,
    onSuccess: (data) => {
      const { accessToken, user } = data.data;

      setCookie("token", accessToken, {
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      dispatch(setUser(user));
      queryClient.invalidateQueries({ queryKey: ["session"] });
      toast.success("Verifikasi berhasil!");

      // Use window.location for full page reload to ensure session is refreshed
      switch (user.role) {
        case "WARGA":
          window.location.href = "/";
          break;
        case "UMKM":
          window.location.href = "/dashboard/umkm";
          break;
        case "DLH":
          window.location.href = "/dashboard/dinas";
          break;
        case "ADMIN":
          window.location.href = "/dashboard/admin";
          break;
        default:
          window.location.href = "/";
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Verifikasi OTP gagal");
    },
  });
};

export const useResendOtp = () => {
  return useMutation({
    mutationFn: authService.resendOtp,
    onSuccess: () => {
      toast.success("Kode OTP baru telah dikirim ke email Anda.");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Gagal mengirim ulang OTP");
    },
  });
};

export const useLogin = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      const { accessToken, user } = data.data;

      setCookie("token", accessToken, {
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      dispatch(setUser(user));
      queryClient.invalidateQueries({ queryKey: ["session"] });
      toast.success("Login berhasil!");

      // Use window.location for full page reload to ensure session is refreshed
      switch (user.role) {
        case "WARGA":
          window.location.href = "/";
          break;
        case "UMKM":
          window.location.href = "/dashboard/umkm";
          break;
        case "DLH":
          window.location.href = "/dashboard/dinas";
          break;
        case "ADMIN":
          window.location.href = "/dashboard/admin";
          break;
        default:
          window.location.href = "/";
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Login gagal");
    },
  });
};

export const useSession = () => {
  const dispatch = useDispatch();
  const token = getCookie("token");

  return useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      dispatch(setLoading(true));
      try {
        const data = await authService.getSession();
        dispatch(setUser(data.data));
        return data.data;
      } catch (error) {
        dispatch(setError(error.message));
        dispatch(clearUser());
        deleteCookie("token");
        throw error;
      } finally {
        dispatch(setLoading(false));
      }
    },
    enabled: !!token,
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useLogout = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const logout = () => {
    deleteCookie("token");
    dispatch(clearUser());
    queryClient.clear();
    toast.success("Logout berhasil!");
    // Use window.location for full page reload to ensure auth page is clickable
    window.location.href = "/auth";
  };

  return { logout };
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session"] });
      toast.success("Profil berhasil diperbarui!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Gagal memperbarui profil");
    },
  });
};

export const useUpdateUmkmProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.updateUmkmProfile,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["session"] });
      toast.success("Profil UMKM berhasil diperbarui!");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Gagal memperbarui profil UMKM"
      );
    },
  });
};

export const useRequestDeleteAccount = () => {
  return useMutation({
    mutationFn: authService.requestDeleteAccount,
    onSuccess: () => {
      toast.success("Kode verifikasi telah dikirim ke email Anda.");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Gagal memproses permintaan"
      );
    },
  });
};

export const useConfirmDeleteAccount = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.confirmDeleteAccount,
    onSuccess: () => {
      deleteCookie("token");
      dispatch(clearUser());
      queryClient.clear();
      toast.success("Akun berhasil dihapus.");
      router.push("/");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Gagal menghapus akun");
    },
  });
};

export const useGetAllUsers = (params) => {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => authService.getAllUsers(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetUserById = (id) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => authService.getUserById(id),
    enabled: !!id,
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User berhasil dihapus!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Gagal menghapus user");
    },
  });
};
