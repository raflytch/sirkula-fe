import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { greenActionService } from "@/services/green-action.service";
import { toast } from "sonner";

export const useGreenActionCategories = () => {
  return useQuery({
    queryKey: ["green-action-categories"],
    queryFn: greenActionService.getCategories,
  });
};

export const useMyGreenActions = (params = {}) => {
  return useQuery({
    queryKey: ["my-green-actions", params],
    queryFn: () => greenActionService.getMyGreenActions(params),
  });
};

export const useMyGreenActionStats = () => {
  return useQuery({
    queryKey: ["my-green-action-stats"],
    queryFn: greenActionService.getMyStats,
  });
};

export const useGreenActionById = (id) => {
  return useQuery({
    queryKey: ["green-action", id],
    queryFn: () => greenActionService.getGreenActionById(id),
    enabled: !!id,
  });
};

export const useCreateGreenAction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: greenActionService.createGreenAction,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["my-green-actions"] });
      queryClient.invalidateQueries({ queryKey: ["my-green-action-stats"] });

      if (data.data.status === "VERIFIED") {
        toast.success("Green action verified successfully!", {
          description: `You earned ${data.data.points} points!`,
        });
      } else if (data.data.status === "REJECTED") {
        toast.error("Green action rejected", {
          description: data.data.aiFeedback,
        });
      } else {
        toast.success("Green action submitted successfully!");
      }
    },
    onError: (error) => {
      toast.error("Failed to submit green action", {
        description: error.response?.data?.message || error.message,
      });
    },
  });
};

export const useDeleteGreenAction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: greenActionService.deleteGreenAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-green-actions"] });
      queryClient.invalidateQueries({ queryKey: ["my-green-action-stats"] });
      toast.success("Green action deleted successfully!");
    },
    onError: (error) => {
      toast.error("Failed to delete green action", {
        description: error.response?.data?.message || error.message,
      });
    },
  });
};

export const useRetryVerification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: greenActionService.retryVerification,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["my-green-actions"] });
      queryClient.invalidateQueries({ queryKey: ["my-green-action-stats"] });
      queryClient.invalidateQueries({
        queryKey: ["green-action", data.data.id],
      });

      if (data.data.status === "VERIFIED") {
        toast.success("Verification successful!", {
          description: `You earned ${data.data.points} points!`,
        });
      } else if (data.data.status === "REJECTED") {
        toast.error("Verification failed", {
          description: data.data.aiFeedback,
        });
      } else {
        toast.info("Verification retry initiated");
      }
    },
    onError: (error) => {
      toast.error("Failed to retry verification", {
        description: error.response?.data?.message || error.message,
      });
    },
  });
};

export const useGetAllGreenActions = (params = {}) => {
  return useQuery({
    queryKey: ["all-green-actions", params],
    queryFn: () => greenActionService.getAllGreenActions(params),
  });
};

export const useGetDistricts = () => {
  return useQuery({
    queryKey: ["green-action-districts"],
    queryFn: greenActionService.getDistricts,
  });
};

export const useDownloadReportPdf = () => {
  return useMutation({
    mutationFn: (district) => greenActionService.downloadReportPdf(district),
    onSuccess: (blob, district) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `laporan-${district}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Laporan berhasil diunduh!");
    },
    onError: (error) => {
      toast.error("Gagal mengunduh laporan", {
        description: error.response?.data?.message || error.message,
      });
    },
  });
};

export const useDownloadReportExcel = () => {
  return useMutation({
    mutationFn: (district) => greenActionService.downloadReportExcel(district),
    onSuccess: (blob, district) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `laporan-${district}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Laporan Excel berhasil diunduh!");
    },
    onError: (error) => {
      toast.error("Gagal mengunduh laporan Excel", {
        description: error.response?.data?.message || error.message,
      });
    },
  });
};

const IMPACT_CACHE_KEY = "green-action-impact-cache";
const IMPACT_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export const useGreenActionImpact = () => {
  return useQuery({
    queryKey: ["green-action-impact"],
    queryFn: async () => {
      // Check localStorage cache before hitting the API
      if (typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem(IMPACT_CACHE_KEY);
          if (raw) {
            const cached = JSON.parse(raw);
            if (Date.now() - cached.timestamp <= IMPACT_CACHE_DURATION) {
              return cached.data;
            }
            localStorage.removeItem(IMPACT_CACHE_KEY);
          }
        } catch {}
      }

      const data = await greenActionService.getImpact();
      try {
        localStorage.setItem(
          IMPACT_CACHE_KEY,
          JSON.stringify({ data, timestamp: Date.now() }),
        );
      } catch {}
      return data;
    },
    staleTime: Infinity,
    gcTime: IMPACT_CACHE_DURATION,
  });
};
