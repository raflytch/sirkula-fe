"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Store, Ticket, ArrowRight, TrendingUp, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useSession } from "@/hooks/use-auth";
import { useGetMyVouchers, useGetVoucherStats } from "@/hooks/use-vouchers";

export default function UmkmDashboardComposite() {
  const router = useRouter();
  const { data: session, isLoading } = useSession();
  const { data: vouchersData, isLoading: isVouchersLoading } =
    useGetMyVouchers();
  const { data: statsData, isLoading: isStatsLoading } = useGetVoucherStats();

  const vouchers = vouchersData?.data || [];
  const activeVouchers = vouchers.filter((v) => v.isActive);
  const stats = statsData?.data || null;

  const chartData = stats
    ? [
        { name: "Pending", value: stats.claimsByStatus?.pending || 0 },
        { name: "Digunakan", value: stats.claimsByStatus?.used || 0 },
        { name: "Kadaluarsa", value: stats.claimsByStatus?.expired || 0 },
      ]
    : [];

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Selamat Pagi";
    if (hour >= 12 && hour < 15) return "Selamat Siang";
    if (hour >= 15 && hour < 18) return "Selamat Sore";
    return "Selamat Malam";
  };

  useEffect(() => {
    if (!isLoading && (!session || session.role !== "UMKM")) {
      router.push("/");
    }
  }, [isLoading, session, router]);

  if (!isLoading && (!session || session.role !== "UMKM")) {
    return null;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8" suppressHydrationWarning>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-green-800">
            {isLoading
              ? "Dashboard UMKM"
              : `${getGreeting()}, ${session?.name || "UMKM"}!`}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Selamat datang di dashboard UMKM Sirkula
          </p>
        </div>

        <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
          {isStatsLoading ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="border shadow-none">
                  <CardHeader className="p-4 pb-2">
                    <Skeleton className="h-4 w-20" />
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <Skeleton className="h-8 w-16" />
                  </CardContent>
                </Card>
              ))}
            </>
          ) : (
            <>
              <Card className="border shadow-none">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">
                    Total Voucher
                  </CardTitle>
                  <Ticket className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-xl sm:text-2xl font-bold">
                    {stats?.totalVouchers || 0}
                  </div>
                </CardContent>
              </Card>
              <Card className="border shadow-none">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">
                    Total Kuota
                  </CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-xl sm:text-2xl font-bold">
                    {stats?.totalQuota || 0}
                  </div>
                </CardContent>
              </Card>
              <Card className="border shadow-none">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">
                    Total Ditukar
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-xl sm:text-2xl font-bold">
                    {stats?.totalRedeemed || 0}
                  </div>
                </CardContent>
              </Card>
              <Card className="border shadow-none">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">
                    Klaim Pending
                  </CardTitle>
                  <Store className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-xl sm:text-2xl font-bold text-amber-600">
                    {stats?.claimsByStatus?.pending || 0}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          <Card className="border shadow-none">
            <CardContent className="p-4 sm:p-6">
              {isLoading ? (
                <div className="flex flex-col items-center text-center">
                  <Skeleton className="h-20 w-20 sm:h-24 sm:w-24 rounded-full mb-4" />
                  <Skeleton className="h-5 sm:h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-40 mb-2" />
                  <Skeleton className="h-6 w-16" />
                </div>
              ) : (
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-20 w-20 sm:h-24 sm:w-24 mb-4">
                    <AvatarImage
                      src={session?.umkmLogoUrl || session?.avatarUrl}
                      alt={session?.name}
                    />
                    <AvatarFallback className="bg-green-100 text-green-800 text-xl sm:text-2xl">
                      {getInitials(session?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-lg sm:text-xl font-semibold">
                    {session?.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground break-all">
                    {session?.email}
                  </p>
                  <Badge className="mt-2 bg-green-100 text-green-800 hover:bg-green-100">
                    {session?.role}
                  </Badge>
                  {session?.umkmName && (
                    <p className="text-sm font-medium mt-3 text-green-700">
                      {session.umkmName}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border shadow-none lg:col-span-2">
            <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
              <CardTitle className="text-base sm:text-lg">Aksi Cepat</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Akses cepat ke fitur-fitur utama
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 grid gap-3 sm:gap-4 grid-cols-2">
              <Link href="/dashboard/umkm/profile">
                <Button
                  variant="outline"
                  className="w-full h-auto py-4 sm:py-6 flex flex-col items-center gap-1.5 sm:gap-2 border hover:bg-green-50 hover:border-green-200"
                >
                  <Store className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                  <span className="font-medium text-sm sm:text-base">
                    Profil UMKM
                  </span>
                  <span className="text-[10px] sm:text-xs text-muted-foreground text-center">
                    Kelola informasi bisnis
                  </span>
                </Button>
              </Link>
              <Link href="/dashboard/umkm/voucher">
                <Button
                  variant="outline"
                  className="w-full h-auto py-4 sm:py-6 flex flex-col items-center gap-1.5 sm:gap-2 border hover:bg-green-50 hover:border-green-200"
                >
                  <Ticket className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                  <span className="font-medium text-sm sm:text-base">
                    Kelola Voucher
                  </span>
                  <span className="text-[10px] sm:text-xs text-muted-foreground text-center">
                    Buat dan kelola voucher
                  </span>
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {!isStatsLoading &&
          stats &&
          (stats.claimsByStatus?.pending > 0 ||
            stats.claimsByStatus?.used > 0 ||
            stats.claimsByStatus?.expired > 0) && (
            <Card className="border shadow-none">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-base sm:text-lg">
                  Statistik Klaim
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Ringkasan status klaim voucher
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="h-[180px] sm:h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="value"
                        fill="#22c55e"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

        <Card className="border shadow-none">
          <CardHeader className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Ticket className="w-4 h-4 sm:w-5 sm:h-5" />
                Voucher Aktif
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Voucher yang sedang berlaku saat ini
              </CardDescription>
            </div>
            <Link href="/dashboard/umkm/voucher">
              <Button variant="ghost" size="sm" className="text-xs sm:text-sm">
                Lihat Semua
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            {isVouchersLoading ? (
              <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="p-3 sm:p-4 border rounded-lg space-y-2"
                  >
                    <Skeleton className="h-4 sm:h-5 w-3/4" />
                    <Skeleton className="h-3 sm:h-4 w-full" />
                    <div className="flex gap-2">
                      <Skeleton className="h-5 w-14 sm:w-16" />
                      <Skeleton className="h-5 w-14 sm:w-16" />
                    </div>
                  </div>
                ))}
              </div>
            ) : activeVouchers.length === 0 ? (
              <div className="text-center py-6 sm:py-8">
                <Ticket className="w-10 h-10 sm:w-12 sm:h-12 text-zinc-300 mx-auto mb-3" />
                <p className="text-sm sm:text-base text-muted-foreground">
                  Belum ada voucher aktif
                </p>
                <Link href="/dashboard/umkm/voucher">
                  <Button className="mt-3 bg-green-600 hover:bg-green-700 text-sm">
                    Buat Voucher
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {activeVouchers.slice(0, 3).map((voucher) => (
                  <div
                    key={voucher.id}
                    className="p-3 sm:p-4 border rounded-lg space-y-2 hover:bg-zinc-50 transition-colors"
                  >
                    <h4 className="font-medium text-sm sm:text-base line-clamp-1">
                      {voucher.name}
                    </h4>
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
                      {voucher.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 text-xs">
                      <Badge
                        variant="outline"
                        className="text-[10px] sm:text-xs"
                      >
                        {voucher.pointsRequired} Poin
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-[10px] sm:text-xs"
                      >
                        {voucher.discountType === "PERCENTAGE"
                          ? `${voucher.discountValue}%`
                          : `Rp${voucher.discountValue.toLocaleString(
                              "id-ID"
                            )}`}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
