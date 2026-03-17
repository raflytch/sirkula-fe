"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  useGetAllVouchers,
  useGetMyClaims,
  useGetWargaStats,
  useUseVoucherClaim,
} from "@/hooks/use-vouchers";
import { useSession } from "@/hooks/use-auth";
import { useDebounce } from "@/hooks/use-debounce";
import { images } from "@/lib/constanst";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { SparklesText } from "@/components/ui/sparkles-text";
import { AuroraText } from "@/components/ui/aurora-text";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import FullscreenLoader from "@/components/ui/fullscreen-loader";
import {
  Gift,
  Coins,
  Clock,
  Store,
  Ticket,
  CheckCircle,
  Timer,
  ArrowRight,
  MapPin,
  Search,
  X,
  Sparkles,
  Copy,
  QrCode,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Skeleton Components
function VoucherCardSkeleton() {
  return (
    <Card className="overflow-hidden border border-zinc-200/60 shadow-sm bg-white">
      <div className="p-3 pb-0">
        <Skeleton className="h-44 w-full rounded-xl" />
      </div>
      <CardContent className="p-4 pt-3 space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-9 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-20" />
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Skeleton className="h-10 w-full rounded-lg" />
      </CardFooter>
    </Card>
  );
}

function StatsCardSkeleton() {
  return (
    <Card className="border border-zinc-200/60 shadow-sm bg-white">
      <CardContent className="p-4 flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-7 w-10" />
        </div>
      </CardContent>
    </Card>
  );
}

function ClaimCardSkeleton() {
  return (
    <Card className="overflow-hidden border border-zinc-200/60 shadow-sm bg-white">
      <div className="flex flex-col sm:flex-row">
        <div className="p-3 pb-3 sm:pb-3 sm:pr-0 shrink-0">
          <Skeleton className="h-32 w-full sm:w-40 rounded-xl" />
        </div>
        <div className="flex-1 p-5 space-y-3">
          <div className="flex justify-between">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-8 w-40 rounded-md" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </Card>
  );
}

// Main Component
export default function RedeemComposite() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("vouchers");

  // Vouchers state
  const [voucherPage, setVoucherPage] = useState(1);
  const [voucherSearch, setVoucherSearch] = useState("");
  const debouncedVoucherSearch = useDebounce(voucherSearch, 500);

  // Claims state
  const [claimPage, setClaimPage] = useState(1);

  // Use voucher state
  const [showUseDialog, setShowUseDialog] = useState(false);
  const [showSuccessUseDialog, setShowSuccessUseDialog] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);

  const { data: session, isLoading: sessionLoading } = useSession();
  const { data: vouchersData, isLoading: vouchersLoading } = useGetAllVouchers({
    page: voucherPage,
    limit: 9,
    search: debouncedVoucherSearch || undefined,
  });
  const { data: claimsData, isLoading: claimsLoading } = useGetMyClaims({
    page: claimPage,
    limit: 10,
  });
  const { data: statsData, isLoading: statsLoading } = useGetWargaStats();
  const { mutate: useVoucherClaim, isPending: isUsingVoucher } =
    useUseVoucherClaim();

  const vouchers = vouchersData?.data || [];
  const voucherMeta = vouchersData?.meta || { totalPages: 1, page: 1 };
  const claims = claimsData?.data || [];
  const claimMeta = claimsData?.meta || { totalPages: 1, page: 1 };
  const stats = statsData?.data || {
    totalClaimed: 0,
    totalUsed: 0,
    totalPending: 0,
    totalPointsSpent: 0,
  };

  // Reset page when search changes
  useEffect(() => {
    setVoucherPage(1);
  }, [debouncedVoucherSearch]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getDiscountLabel = (voucher) => {
    if (voucher.discountType === "PERCENTAGE") {
      return `${voucher.discountValue}%`;
    }
    return `Rp ${voucher.discountValue.toLocaleString("id-ID")}`;
  };

  const handleUseVoucher = (claim) => {
    setSelectedClaim(claim);
    setShowUseDialog(true);
  };

  const confirmUseVoucher = () => {
    if (!selectedClaim) return;
    setShowUseDialog(false);
    useVoucherClaim(selectedClaim.id, {
      onSuccess: () => {
        setShowSuccessUseDialog(true);
      },
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Kode berhasil disalin!");
  };

  const renderPagination = (meta, currentPage, setPage) => {
    if (meta.totalPages <= 1) return null;

    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(meta.totalPages, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <Pagination className="mt-6">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setPage(Math.max(1, currentPage - 1))}
              className={cn(
                "cursor-pointer select-none",
                currentPage === 1 && "pointer-events-none opacity-50"
              )}
            />
          </PaginationItem>
          {pages.map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => setPage(page)}
                isActive={page === currentPage}
                className="cursor-pointer select-none"
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() =>
                setPage(Math.min(meta.totalPages, currentPage + 1))
              }
              className={cn(
                "cursor-pointer select-none",
                currentPage === meta.totalPages &&
                  "pointer-events-none opacity-50"
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <>
      {isUsingVoucher && <FullscreenLoader text="Menggunakan voucher..." />}

      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-xl bg-emerald-600 flex items-center justify-center">
                <Gift className="h-5 w-5 text-white" />
              </div>
              <SparklesText
                colors={{ first: "#10b981", second: "#14b8a6" }}
                className="text-2xl md:text-3xl font-bold"
                sparklesCount={8}
              >
                <AuroraText
                  colors={["#10b981", "#14b8a6", "#0ea5e9", "#10b981"]}
                  className="text-2xl md:text-3xl font-bold"
                  speed={1.5}
                >
                  Tukar Poin
                </AuroraText>
              </SparklesText>
            </div>
            <p className="text-zinc-500 ml-13">
              Tukarkan poin kamu dengan voucher menarik dari UMKM lokal
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {statsLoading || sessionLoading ? (
              <>
                <StatsCardSkeleton />
                <StatsCardSkeleton />
                <StatsCardSkeleton />
                <StatsCardSkeleton />
              </>
            ) : (
              <>
                <Card className="border border-zinc-200 bg-white hover:border-emerald-200 transition-colors">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                      <Coins className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 font-medium">
                        Poin Kamu
                      </p>
                      <p className="text-2xl font-bold text-zinc-900">
                        {session?.totalPoints || 0}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-zinc-200 bg-white hover:border-emerald-200 transition-colors">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                      <Ticket className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 font-medium">
                        Diklaim
                      </p>
                      <p className="text-2xl font-bold text-zinc-900">
                        {stats.totalClaimed}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-zinc-200 bg-white hover:border-emerald-200 transition-colors">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                      <Timer className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 font-medium">
                        Pending
                      </p>
                      <p className="text-2xl font-bold text-zinc-900">
                        {stats.totalPending}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-zinc-200 bg-white hover:border-emerald-200 transition-colors">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 font-medium">
                        Digunakan
                      </p>
                      <p className="text-2xl font-bold text-zinc-900">
                        {stats.totalUsed}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="w-full grid grid-cols-2 mb-6 bg-zinc-100 p-1.5 rounded-xl h-auto">
              <TabsTrigger
                value="vouchers"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg py-2.5 transition-all font-medium"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Voucher Tersedia
              </TabsTrigger>
              <TabsTrigger
                value="claims"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg py-2.5 transition-all font-medium"
              >
                <Ticket className="h-4 w-4 mr-2" />
                Voucher Saya
              </TabsTrigger>
            </TabsList>

            {/* Vouchers Tab */}
            <TabsContent value="vouchers" className="mt-0">
              {/* Search */}
              <div className="mb-6">
                <div className="relative w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                  <Input
                    placeholder="Cari voucher berdasarkan nama atau UMKM..."
                    value={voucherSearch}
                    onChange={(e) => setVoucherSearch(e.target.value)}
                    className="pl-12 pr-12 h-12 bg-white border-zinc-200 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl w-full text-base"
                  />
                  {voucherSearch && (
                    <button
                      onClick={() => setVoucherSearch("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-zinc-200 flex items-center justify-center hover:bg-zinc-300 transition-colors"
                    >
                      <X className="h-3.5 w-3.5 text-zinc-600" />
                    </button>
                  )}
                </div>
              </div>

              {vouchersLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {[...Array(6)].map((_, i) => (
                    <VoucherCardSkeleton key={i} />
                  ))}
                </div>
              ) : vouchers.length === 0 ? (
                <Card className="border border-zinc-200/60 shadow-sm bg-white">
                  <CardContent className="py-20 text-center">
                    <div className="h-16 w-16 rounded-2xl bg-zinc-100 flex items-center justify-center mx-auto mb-4">
                      <Gift className="h-8 w-8 text-zinc-400" />
                    </div>
                    <p className="text-zinc-600 font-medium">
                      {debouncedVoucherSearch
                        ? "Tidak ada voucher yang ditemukan"
                        : "Belum ada voucher tersedia"}
                    </p>
                    <p className="text-sm text-zinc-400 mt-1">
                      {debouncedVoucherSearch
                        ? "Coba kata kunci lain"
                        : "Voucher baru akan segera hadir"}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {vouchers.map((voucher) => (
                      <Card
                        key={voucher.id}
                        className="overflow-hidden border border-zinc-200 bg-white hover:border-emerald-200 hover:shadow-sm transition-all group"
                      >
                        <div className="p-3 pb-0">
                          <div className="relative h-44 bg-zinc-100 overflow-hidden rounded-xl">
                            <Image
                              src={voucher.imageUrl}
                              alt={voucher.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <Badge className="absolute top-3 right-3 px-3 py-1 font-semibold bg-emerald-600 hover:bg-emerald-600">
                              {getDiscountLabel(voucher)}
                            </Badge>
                          </div>
                        </div>

                        <CardContent className="p-4 pt-3 space-y-3">
                          <div className="flex items-center gap-2.5">
                            <div className="h-9 w-9 rounded-full overflow-hidden border-2 border-white shadow-sm">
                              <Image
                                src={voucher.umkm.logoUrl || images.logo.src}
                                alt={voucher.umkm.name}
                                width={36}
                                height={36}
                                className="object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <span className="text-sm font-medium text-zinc-700 truncate block">
                                {voucher.umkm.name}
                              </span>
                              <span className="text-xs text-zinc-400">
                                {voucher.umkm.category}
                              </span>
                            </div>
                          </div>

                          <div>
                            <h3 className="font-semibold text-zinc-900 line-clamp-1 text-base">
                              {voucher.name}
                            </h3>
                            <p className="text-sm text-zinc-500 line-clamp-2 mt-1 leading-relaxed">
                              {voucher.description}
                            </p>
                          </div>

                          <div className="flex items-center justify-between text-sm pt-1">
                            <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                              <Coins className="h-4 w-4" />
                              {voucher.pointsRequired} Poin
                            </div>
                            <div className="flex items-center gap-1.5 text-zinc-500">
                              <Clock className="h-4 w-4" />
                              <span className="text-xs">
                                {voucher.quotaRemaining} tersisa
                              </span>
                            </div>
                          </div>
                        </CardContent>

                        <CardFooter className="p-4 pt-0">
                          <Button
                            className="w-full bg-emerald-600 hover:bg-emerald-700 rounded-lg h-10 font-medium"
                            onClick={() => router.push(`/reedem/${voucher.id}`)}
                          >
                            Lihat Detail
                            <ArrowRight className="h-4 w-4 ml-1.5" />
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>

                  {renderPagination(voucherMeta, voucherPage, setVoucherPage)}
                </>
              )}
            </TabsContent>

            {/* Claims Tab */}
            <TabsContent value="claims" className="mt-0">
              {claimsLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <ClaimCardSkeleton key={i} />
                  ))}
                </div>
              ) : claims.length === 0 ? (
                <Card className="border border-zinc-200/60 shadow-sm bg-white">
                  <CardContent className="py-20 text-center">
                    <div className="h-16 w-16 rounded-2xl bg-zinc-100 flex items-center justify-center mx-auto mb-4">
                      <Ticket className="h-8 w-8 text-zinc-400" />
                    </div>
                    <p className="text-zinc-600 font-medium">
                      Kamu belum memiliki voucher
                    </p>
                    <p className="text-sm text-zinc-400 mt-1">
                      Tukarkan poin untuk mendapatkan voucher
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4 rounded-lg"
                      onClick={() => setActiveTab("vouchers")}
                    >
                      <Gift className="h-4 w-4 mr-2" />
                      Jelajahi Voucher
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <div className="space-y-4">
                    {claims.map((claim) => (
                      <Card
                        key={claim.id}
                        className="overflow-hidden border border-zinc-200 bg-white hover:border-emerald-200 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row">
                          <div className="p-3 pb-0 sm:pb-3 sm:pr-0 shrink-0">
                            <div className="relative h-32 w-full sm:w-40 bg-zinc-100 rounded-xl overflow-hidden">
                              <Image
                                src={claim.voucher.imageUrl}
                                alt={claim.voucher.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </div>

                          <div className="flex-1 p-5">
                            <div className="flex items-start justify-between gap-3 mb-3">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-zinc-900 truncate text-base">
                                  {claim.voucher.name}
                                </h3>
                                <div className="flex items-center gap-2 text-sm text-zinc-500 mt-1">
                                  <Store className="h-4 w-4" />
                                  <span className="truncate">
                                    {claim.voucher.umkm.name}
                                  </span>
                                </div>
                              </div>
                              <Badge
                                className={cn(
                                  "shrink-0 px-3 py-1 font-medium",
                                  claim.status === "PENDING"
                                    ? "bg-amber-50 text-amber-700 hover:bg-amber-50"
                                    : "bg-emerald-50 text-emerald-700 hover:bg-emerald-50"
                                )}
                              >
                                {claim.status === "PENDING"
                                  ? "Belum Digunakan"
                                  : "Sudah Digunakan"}
                              </Badge>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-zinc-500">
                                  Kode:
                                </span>
                                <div className="flex items-center gap-2">
                                  <code className="px-2.5 py-1 bg-zinc-100 rounded-md text-sm font-mono font-medium text-zinc-700">
                                    {claim.redemptionCode}
                                  </code>
                                  <button
                                    onClick={() =>
                                      copyToClipboard(claim.redemptionCode)
                                    }
                                    className="h-7 w-7 rounded-md bg-zinc-100 flex items-center justify-center hover:bg-zinc-200 transition-colors"
                                  >
                                    <Copy className="h-3.5 w-3.5 text-zinc-600" />
                                  </button>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 text-xs text-zinc-500">
                                <Clock className="h-3.5 w-3.5" />
                                <span>
                                  Diklaim: {formatDate(claim.claimedAt)}
                                </span>
                                {claim.usedAt && (
                                  <>
                                    <span className="text-zinc-300">•</span>
                                    <span>
                                      Digunakan: {formatDate(claim.usedAt)}
                                    </span>
                                  </>
                                )}
                              </div>

                              {claim.status === "PENDING" && (
                                <div className="flex items-center gap-2 text-xs text-zinc-500">
                                  <MapPin className="h-3.5 w-3.5" />
                                  <span>{claim.voucher.umkm.address}</span>
                                </div>
                              )}
                            </div>

                            {claim.status === "PENDING" && (
                              <div className="mt-4 pt-3 border-t border-zinc-100">
                                <Button
                                  size="sm"
                                  className="bg-emerald-600 hover:bg-emerald-700 rounded-lg font-medium"
                                  onClick={() => handleUseVoucher(claim)}
                                >
                                  <QrCode className="h-4 w-4 mr-1.5" />
                                  Gunakan Voucher
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>

                  {renderPagination(claimMeta, claimPage, setClaimPage)}
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Use Voucher Confirm Dialog */}
      <AlertDialog open={showUseDialog} onOpenChange={setShowUseDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-emerald-600" />
              Gunakan Voucher
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-4">
                <p>
                  Apakah kamu yakin ingin menggunakan voucher ini? Pastikan kamu
                  sudah berada di lokasi UMKM.
                </p>
                {selectedClaim && (
                  <div className="bg-zinc-50 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-600">Voucher</span>
                      <span className="font-medium text-zinc-900">
                        {selectedClaim.voucher.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-600">UMKM</span>
                      <span className="font-medium text-zinc-900">
                        {selectedClaim.voucher.umkm.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-600">Kode</span>
                      <code className="px-2 py-0.5 bg-white rounded text-xs font-mono">
                        {selectedClaim.redemptionCode}
                      </code>
                    </div>
                  </div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-lg">Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-emerald-600 hover:bg-emerald-700 rounded-lg"
              onClick={confirmUseVoucher}
            >
              Ya, Gunakan Sekarang
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Success Use Dialog */}
      <AlertDialog
        open={showSuccessUseDialog}
        onOpenChange={setShowSuccessUseDialog}
      >
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-emerald-50 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-emerald-600" />
            </div>
            <AlertDialogTitle className="text-center text-xl">
              Voucher Berhasil Digunakan!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center pt-2">
              Tunjukkan konfirmasi ini kepada UMKM untuk mendapatkan diskon.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center">
            <AlertDialogAction
              className="bg-emerald-600 hover:bg-emerald-700 rounded-lg w-full sm:w-auto px-8"
              onClick={() => setShowSuccessUseDialog(false)}
            >
              Selesai
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
