"use client";

import { useState } from "react";
import Image from "next/image";
import { useLeaderboard, useTopThree } from "@/hooks/use-leaderboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { SparklesText } from "@/components/ui/sparkles-text";
import { AuroraText } from "@/components/ui/aurora-text";
import { images } from "@/lib/constanst";
import {
  Trophy,
  Medal,
  Award,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Star,
  Flame,
} from "lucide-react";

// Helper function for avatar fallback
const AvatarFallbackContent = () => {
  return (
    <Image
      src={images.logo}
      alt="Sirkula"
      className="w-full h-full object-cover"
    />
  );
};

// Rank indicator component
const RankIndicator = ({ rank, size = "md" }) => {
  const sizes = {
    sm: "w-7 h-7 text-xs",
    md: "w-8 h-8 text-xs",
    lg: "w-10 h-10 text-sm",
  };

  const styles = {
    1: "bg-gradient-to-br from-amber-400 to-amber-500 text-white border border-amber-300",
    2: "bg-gradient-to-br from-zinc-300 to-zinc-400 text-white border border-zinc-300",
    3: "bg-gradient-to-br from-orange-400 to-orange-500 text-white border border-orange-300",
  };

  const icons = {
    1: <Trophy className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />,
    2: <Medal className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />,
    3: <Award className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />,
  };

  const baseStyle =
    styles[rank] || "bg-white text-zinc-700 border border-zinc-200";

  return (
    <div
      className={`${sizes[size]} ${baseStyle} rounded-full flex items-center justify-center font-semibold`}
    >
      {icons[rank] || <span>{rank}</span>}
    </div>
  );
};

// Top 3 podium card component
const PodiumCard = ({ user, rank, isWinner = false }) => {
  if (!user) return null;

  const cardWidth = isWinner ? "w-32 sm:w-40" : "w-28 sm:w-32";
  const avatarSize = isWinner
    ? "w-14 h-14 sm:w-16 sm:w-16"
    : "w-11 h-11 sm:w-12 sm:h-12";
  const podiumHeight =
    rank === 1 ? "h-16 sm:h-20" : rank === 2 ? "h-12 sm:h-16" : "h-10 sm:h-12";

  const podiumStyles = {
    1: "bg-gradient-to-br from-amber-400 to-amber-500 text-white border-2 border-amber-300",
    2: "bg-gradient-to-br from-zinc-300 to-zinc-400 text-white border-2 border-zinc-300",
    3: "bg-gradient-to-br from-orange-400 to-orange-500 text-white border-2 border-orange-300",
  };

  const borderColor = {
    1: "border-amber-400",
    2: "border-zinc-400",
    3: "border-orange-400",
  };

  return (
    <div className="flex flex-col items-center">
      {/* Avatar */}
      <div className="relative mb-2 sm:mb-3">
        <Avatar className={`${avatarSize} border-2 ${borderColor[rank]}`}>
          <AvatarImage
            src={user.avatarUrl}
            alt={user.name}
            className="object-cover"
          />
          <AvatarFallback className="bg-white p-1">
            <AvatarFallbackContent />
          </AvatarFallback>
        </Avatar>
        {isWinner && (
          <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-linear-to-br from-amber-400 to-amber-500 border border-amber-300 rounded-full flex items-center justify-center">
            <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white fill-white" />
          </div>
        )}
      </div>

      {/* User info */}
      <div className={`${cardWidth} text-center mb-2`}>
        <p className="font-semibold text-zinc-800 truncate text-xs sm:text-sm px-1 sm:px-2">
          {user.name}
        </p>
        <p
          className={`font-bold ${
            rank === 1
              ? "text-lg sm:text-xl text-amber-600"
              : "text-base sm:text-lg text-zinc-700"
          } mt-0.5`}
        >
          {user.totalPoints?.toLocaleString()}
        </p>
        <p className="text-[10px] sm:text-[11px] text-zinc-400 uppercase tracking-wide">
          poin
        </p>
      </div>

      {/* Podium */}
      <div
        className={`${cardWidth} ${podiumHeight} ${podiumStyles[rank]} rounded-t-xl flex items-center justify-center`}
      >
        <span className="text-base sm:text-lg font-bold">{rank}</span>
      </div>
    </div>
  );
};

// Leaderboard row component
const LeaderboardRow = ({ item, rank }) => {
  const isTopThree = rank <= 3;

  return (
    <div
      className={`group flex items-center gap-2 sm:gap-3 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg transition-all ${
        isTopThree
          ? "bg-zinc-50/80 hover:bg-zinc-100/80"
          : "hover:bg-zinc-50/50"
      }`}
    >
      {/* Rank */}
      <div className="w-8 sm:w-9 flex justify-center shrink-0">
        <RankIndicator rank={rank} size="md" />
      </div>

      {/* Avatar */}
      <Avatar className="w-8 h-8 sm:w-9 sm:h-9 border border-zinc-200 shrink-0">
        <AvatarImage
          src={item.user?.avatarUrl}
          alt={item.user?.name}
          className="object-cover"
        />
        <AvatarFallback className="bg-white p-0.5">
          <AvatarFallbackContent />
        </AvatarFallback>
      </Avatar>

      {/* User Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-zinc-800 truncate text-xs sm:text-sm leading-tight">
          {item.user?.name}
        </p>
        <p className="text-[10px] sm:text-[11px] text-zinc-500 capitalize leading-tight mt-0.5">
          {item.user?.role?.toLowerCase()}
        </p>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3 sm:gap-6 shrink-0">
        <div className="text-right">
          <p className="font-bold text-emerald-600 text-sm sm:text-base leading-tight">
            {item.totalPoints?.toLocaleString()}
          </p>
          <p className="text-[9px] sm:text-[10px] text-zinc-400 uppercase tracking-wide">
            poin
          </p>
        </div>
        <div className="text-right min-w-10 hidden sm:block">
          <p className="font-semibold text-zinc-700 text-sm leading-tight">
            {item.totalActions}
          </p>
          <p className="text-[10px] text-zinc-400 uppercase tracking-wide">
            aksi
          </p>
        </div>
      </div>
    </div>
  );
};

// Loading skeleton for leaderboard
const LeaderboardSkeleton = () => (
  <div className="space-y-2">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="flex items-center gap-3 py-3 px-4">
        <Skeleton className="w-9 h-9 rounded-full" />
        <Skeleton className="w-9 h-9 rounded-full" />
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-3.5 w-28" />
          <Skeleton className="h-2.5 w-16" />
        </div>
        <Skeleton className="h-5 w-14" />
      </div>
    ))}
  </div>
);

// Top 3 skeleton
const TopThreeSkeleton = () => (
  <div className="flex justify-center items-end gap-3">
    {[2, 1, 3].map((rank) => (
      <div key={rank} className="flex flex-col items-center">
        <Skeleton
          className={`${
            rank === 1 ? "w-16 h-16" : "w-12 h-12"
          } rounded-full mb-2`}
        />
        <Skeleton
          className={`${rank === 1 ? "w-44" : "w-36"} h-12 rounded-lg mb-2`}
        />
        <Skeleton
          className={`${
            rank === 1 ? "w-44 h-20" : rank === 2 ? "w-36 h-14" : "w-36 h-10"
          } rounded-t-lg`}
        />
      </div>
    ))}
  </div>
);

const LeaderboardComposite = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: topThree, loading: loadingTop } = useTopThree();
  const {
    data: leaderboardData,
    meta,
    loading: loadingAll,
    error,
  } = useLeaderboard(currentPage, 10);

  return (
    <div className="py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8 sm:mb-12">
          <Badge
            variant="outline"
            className="mb-3 border-emerald-500/40 text-emerald-700 bg-emerald-50 px-3 py-1 text-xs font-semibold"
          >
            <Flame className="w-3 h-3 mr-1.5" />
            Top Kontributor
          </Badge>
          <SparklesText
            colors={{ first: "#10b981", second: "#14b8a6" }}
            className="text-2xl sm:text-3xl font-bold mb-2"
            sparklesCount={8}
          >
            <AuroraText
              colors={["#10b981", "#14b8a6", "#0ea5e9", "#10b981"]}
              className="text-2xl sm:text-3xl font-bold"
              speed={1.5}
            >
              Leaderboard
            </AuroraText>
          </SparklesText>
          <p className="text-zinc-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Kumpulkan poin dari setiap aksi hijau dan tukarkan dengan reward
            menarik
          </p>
        </header>

        {/* Top 3 Podium */}
        <section className="mb-8 sm:mb-12">
          {loadingTop ? (
            <TopThreeSkeleton />
          ) : (
            <div className="flex justify-center items-end gap-1.5 sm:gap-3 md:gap-4">
              {/* Rank 2 */}
              <PodiumCard user={topThree[1]} rank={2} />
              {/* Rank 1 */}
              <PodiumCard user={topThree[0]} rank={1} isWinner />
              {/* Rank 3 */}
              <PodiumCard user={topThree[2]} rank={3} />
            </div>
          )}
        </section>

        {/* Divider */}
        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Separator className="flex-1" />
          <span className="text-[10px] sm:text-xs text-zinc-500 uppercase tracking-wider font-semibold">
            Semua Peringkat
          </span>
          <Separator className="flex-1" />
        </div>

        {/* All Rankings */}
        <Card className="border-2 border-zinc-200 overflow-hidden">
          <CardHeader className="py-3 sm:py-4 px-4 sm:px-5 border-b border-zinc-200 bg-white">
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base font-semibold text-zinc-800">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Peringkat Lengkap
            </CardTitle>
          </CardHeader>
          <CardContent className="p-1.5 sm:p-2">
            {loadingAll ? (
              <LeaderboardSkeleton />
            ) : error ? (
              <div className="text-center py-10">
                <p className="text-neutral-500 text-sm mb-3">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.reload()}
                  className="text-xs"
                >
                  Coba Lagi
                </Button>
              </div>
            ) : (
              <>
                <div className="divide-y divide-neutral-100/80">
                  {leaderboardData.map((item) => (
                    <LeaderboardRow
                      key={item.user?.id}
                      item={item}
                      rank={item.rank}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {meta && meta.totalPages > 1 && (
                  <div className="flex justify-between items-center mt-3 sm:mt-4 pt-3 sm:pt-4 px-2 sm:px-3 border-t border-zinc-100">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={!meta.hasPreviousPage}
                      className="text-xs gap-1 h-7 sm:h-8 px-2 sm:px-3 border-zinc-200"
                    >
                      <ChevronLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      <span className="hidden sm:inline">Prev</span>
                    </Button>

                    <span className="text-[10px] sm:text-xs text-zinc-600">
                      Hal.{" "}
                      <span className="font-bold text-zinc-900">
                        {meta.page}
                      </span>{" "}
                      / {meta.totalPages}
                    </span>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                      disabled={!meta.hasNextPage}
                      className="text-xs gap-1 h-7 sm:h-8 px-2 sm:px-3 border-zinc-200"
                    >
                      <span className="hidden sm:inline">Next</span>
                      <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LeaderboardComposite;
