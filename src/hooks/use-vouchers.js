"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { voucherService } from "@/services/voucher.service";

// ============ PUBLIC HOOKS ============

export const useGetAllVouchers = (params = {}) => {
  return useQuery({
    queryKey: ["vouchers", params],
    queryFn: () => voucherService.getAllVouchers(params),
  });
};

export const useGetVoucherById = (id) => {
  return useQuery({
    queryKey: ["voucher", id],
    queryFn: () => voucherService.getVoucherById(id),
    enabled: !!id,
  });
};

// ============ WARGA HOOKS ============

export const useGetMyClaims = (params = {}) => {
  return useQuery({
    queryKey: ["my-claims", params],
    queryFn: () => voucherService.getMyClaims(params),
  });
};

export const useGetWargaStats = () => {
  return useQuery({
    queryKey: ["warga-stats"],
    queryFn: voucherService.getWargaStats,
  });
};

export const useRedeemVoucher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: voucherService.redeemVoucher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vouchers"] });
      queryClient.invalidateQueries({ queryKey: ["voucher"] });
      queryClient.invalidateQueries({ queryKey: ["my-claims"] });
      queryClient.invalidateQueries({ queryKey: ["warga-stats"] });
      queryClient.invalidateQueries({ queryKey: ["session"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Gagal menukar voucher");
    },
  });
};

export const useUseVoucherClaim = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: voucherService.useVoucherClaim,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-claims"] });
      queryClient.invalidateQueries({ queryKey: ["warga-stats"] });
      toast.success("Voucher berhasil digunakan");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Gagal menggunakan voucher");
    },
  });
};

// ============ UMKM HOOKS ============

export const useGetMyVouchers = (params = {}) => {
  return useQuery({
    queryKey: ["my-vouchers", params],
    queryFn: () => voucherService.getMyVouchers(params),
  });
};

export const useGetVoucherStats = () => {
  return useQuery({
    queryKey: ["voucher-stats"],
    queryFn: voucherService.getVoucherStats,
  });
};

export const useCreateVoucher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: voucherService.createVoucher,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["my-vouchers"] });
      await queryClient.invalidateQueries({ queryKey: ["voucher-stats"] });
      toast.success("Voucher berhasil dibuat");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Gagal membuat voucher");
    },
  });
};

export const useUpdateVoucher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: voucherService.updateVoucher,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["my-vouchers"] });
      await queryClient.invalidateQueries({ queryKey: ["voucher-stats"] });
      await queryClient.invalidateQueries({ queryKey: ["voucher"] });
      toast.success("Voucher berhasil diperbarui");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Gagal memperbarui voucher");
    },
  });
};

export const useDeleteVoucher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: voucherService.deleteVoucher,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["my-vouchers"] });
      await queryClient.invalidateQueries({ queryKey: ["voucher-stats"] });
      toast.success("Voucher berhasil dihapus");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Gagal menghapus voucher");
    },
  });
};

export const useVerifyVoucherClaim = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: voucherService.verifyVoucherClaim,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-vouchers"] });
      queryClient.invalidateQueries({ queryKey: ["voucher-stats"] });
      toast.success("Klaim voucher berhasil diverifikasi");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Gagal memverifikasi klaim voucher"
      );
    },
  });
};
