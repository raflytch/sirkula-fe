import { useState, useEffect } from "react";
import { leaderboardService } from "@/services/leaderboard.service";

export const useLeaderboard = (page = 1, limit = 10) => {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await leaderboardService.getLeaderboard({
          page,
          limit,
        });

        if (response.statusCode === 200) {
          setData(response.data);
          setMeta(response.meta);
        } else {
          setError("Failed to fetch leaderboard");
        }
      } catch (err) {
        setError(
          err.response?.data?.message || err.message || "An error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [page, limit]);

  return { data, meta, loading, error };
};

export const useTopThree = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopThree = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await leaderboardService.getTopThree();

        if (response.statusCode === 200) {
          setData(response.data);
        } else {
          setError("Failed to fetch top three");
        }
      } catch (err) {
        setError(
          err.response?.data?.message || err.message || "An error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTopThree();
  }, []);

  return { data, loading, error };
};
