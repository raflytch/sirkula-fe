import httpClient from "@/lib/http-client";

export const leaderboardService = {
  getLeaderboard: async (params = {}) => {
    const response = await httpClient.get("/leaderboard", {
      params,
      skipAuth: true,
    });
    return response.data;
  },

  getTopThree: async () => {
    const response = await httpClient.get("/leaderboard/top-three", {
      skipAuth: true,
    });
    return response.data;
  },
};
