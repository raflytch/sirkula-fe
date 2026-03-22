"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { quizService } from "@/services/quiz.service";
import { toast } from "sonner";

export const useGenerateQuiz = () => {
  return useMutation({
    mutationFn: quizService.generateQuiz,
    onError: (error) => {
      if (error.response?.status === 403) return;
      toast.error(
        error.response?.data?.message || "Gagal memuat soal quiz. Coba lagi.",
      );
    },
  });
};

export const useSubmitQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: quizService.submitQuiz,
    onSuccess: () => {
      toast.success("Quiz berhasil dikirim!");
      queryClient.invalidateQueries({ queryKey: ["quiz-history"] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Gagal mengirim jawaban quiz.",
      );
    },
  });
};

export const useQuizHistory = (options = {}) => {
  return useQuery({
    queryKey: ["quiz-history"],
    queryFn: () => quizService.getHistory(),
    select: (res) => res.data,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};
