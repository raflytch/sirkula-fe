import httpClient from "@/lib/http-client";

export const quizService = {
  generateQuiz: () => httpClient.get("/quiz/generate"),
  submitQuiz: (payload) => httpClient.post("/quiz/submit", payload),
  getHistory: () => httpClient.get("/quiz/history"),
};
