"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useGetVoucherById, useRedeemVoucher } from "@/hooks/use-vouchers";
import { useSession } from "@/hooks/use-auth";
import { images } from "@/lib/constanst";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import FullscreenLoader from "@/components/ui/fullscreen-loader";
import {
  Gift,
  Coins,
  Clock,
  Store,
  MapPin,
  Calendar,
  Tag,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Ticket,
  Copy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Skeleton for detail page
function VoucherDetailSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Skeleton className="h-8 w-32 mb-6" />
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-64 md:h-80 rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-20 w-full" />
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
            </div>
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VoucherDetailComposite({ slug }) {
  const router = useRouter();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [redeemResult, setRedeemResult] = useState(null);

  const { data: session, isLoading: sessionLoading } = useSession();
  const { data: voucherData, isLoading: voucherLoading } =
    useGetVoucherById(slug);
  const { mutate: redeemVoucher, isPending: isRedeeming } = useRedeemVoucher();

  const voucher = voucherData?.data;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getDiscountLabel = (voucher) => {
    if (!voucher) return "";
    if (voucher.discountType === "PERCENTAGE") {
      return `Diskon ${voucher.discountValue}%`;
    }
    return `Diskon Rp ${voucher.discountValue.toLocaleString("id-ID")}`;
  };

  const canRedeem = () => {
    if (!session || !voucher) return false;
    if (session.totalPoints < voucher.pointsRequired) return false;
    if (voucher.quotaRemaining <= 0) return false;
    if (!voucher.isActive) return false;
    const now = new Date();
    const validFrom = new Date(voucher.validFrom);
    const validUntil = new Date(voucher.validUntil);
    if (now < validFrom || now > validUntil) return false;
    return true;
  };

  const getRedeemButtonText = () => {
    if (!session) return "Masuk untuk Menukar";
    if (!voucher) return "Loading...";
    if (session.totalPoints < voucher.pointsRequired) return "Poin Tidak Cukup";
    if (voucher.quotaRemaining <= 0) return "Stok Habis";
    if (!voucher.isActive) return "Voucher Tidak Aktif";
    const now = new Date();
    const validFrom = new Date(voucher.validFrom);
    const validUntil = new Date(voucher.validUntil);
    if (now < validFrom) return "Belum Berlaku";
    if (now > validUntil) return "Sudah Kadaluarsa";
    return `Tukar dengan ${voucher.pointsRequired} Poin`;
  };

  const handleRedeem = () => {
    setShowConfirmDialog(true);
  };

  const confirmRedeem = () => {
    setShowConfirmDialog(false);
    redeemVoucher(voucher.id, {
      onSuccess: (data) => {
        setRedeemResult(data.data);
        setShowSuccessDialog(true);
      },
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Kode berhasil disalin");
  };

  if (voucherLoading || sessionLoading) {
    return <VoucherDetailSkeleton />;
  }

  if (!voucher) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="border border-zinc-100 shadow-sm max-w-md">
          <CardContent className="py-12 text-center">
            <Gift className="h-12 w-12 text-zinc-300 mx-auto mb-3" />
            <p className="text-zinc-900 font-medium">Voucher tidak ditemukan</p>
            <p className="text-sm text-zinc-500 mt-1">
              Voucher yang kamu cari mungkin sudah tidak tersedia
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => router.push("/reedem")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      {isRedeeming && <FullscreenLoader text="Memproses penukaran..." />}

      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          {/* Back Button */}
          <Button
            variant="ghost"
            size="sm"
            className="mb-6 text-zinc-600 hover:text-zinc-900"
            onClick={() => router.push("/reedem")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Image */}
            <div className="relative">
              <div className="relative aspect-4/3 rounded-lg overflow-hidden border border-zinc-100 shadow-sm bg-white">
                <Image
                  src={voucher.imageUrl}
                  alt={voucher.name}
                  fill
                  className="object-cover"
                />
                <Badge
                  className={cn(
                    "absolute top-3 right-3 text-sm px-3 py-1",
                    voucher.discountType === "PERCENTAGE"
                      ? "bg-green-600 hover:bg-green-600"
                      : "bg-blue-600 hover:bg-blue-600"
                  )}
                >
                  {getDiscountLabel(voucher)}
                </Badge>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-5">
              {/* UMKM Info */}
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full overflow-hidden border border-zinc-200">
                  <Image
                    src={voucher.umkm.logoUrl || images.logo.src}
                    alt={voucher.umkm.name}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium text-zinc-900">
                    {voucher.umkm.name}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {voucher.umkm.category}
                  </p>
                </div>
              </div>

              {/* Voucher Title */}
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-zinc-900">
                  {voucher.name}
                </h1>
                <p className="text-zinc-600 mt-2">{voucher.description}</p>
              </div>

              {/* Info Cards */}
              <div className="grid grid-cols-2 gap-3">
                <Card className="border border-zinc-100 shadow-sm">
                  <CardContent className="p-3 flex items-center gap-2">
                    <Coins className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-xs text-zinc-500">Poin Dibutuhkan</p>
                      <p className="font-semibold text-zinc-900">
                        {voucher.pointsRequired}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-zinc-100 shadow-sm">
                  <CardContent className="p-3 flex items-center gap-2">
                    <Tag className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-xs text-zinc-500">Sisa Kuota</p>
                      <p className="font-semibold text-zinc-900">
                        {voucher.quotaRemaining}/{voucher.quotaTotal}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-zinc-100 shadow-sm">
                  <CardContent className="p-3 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-amber-600" />
                    <div>
                      <p className="text-xs text-zinc-500">Berlaku Mulai</p>
                      <p className="font-semibold text-zinc-900 text-xs">
                        {formatDate(voucher.validFrom)}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-zinc-100 shadow-sm">
                  <CardContent className="p-3 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="text-xs text-zinc-500">Berlaku Hingga</p>
                      <p className="font-semibold text-zinc-900 text-xs">
                        {formatDate(voucher.validUntil)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Location */}
              <Card className="border border-zinc-100 shadow-sm">
                <CardContent className="p-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-zinc-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-zinc-500">Lokasi UMKM</p>
                      <p className="text-sm text-zinc-700">
                        {voucher.umkm.address}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* User Points */}
              {session && (
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
                  <div className="flex items-center gap-2">
                    <Coins className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-green-800">Poin Kamu</span>
                  </div>
                  <span className="font-bold text-green-800">
                    {session.totalPoints}
                  </span>
                </div>
              )}

              {/* Redeem Button */}
              <Button
                className={cn(
                  "w-full h-12 text-base",
                  canRedeem()
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-zinc-300 cursor-not-allowed"
                )}
                disabled={!canRedeem()}
                onClick={handleRedeem}
              >
                <Gift className="h-5 w-5 mr-2" />
                {getRedeemButtonText()}
              </Button>

              {!canRedeem() && session && (
                <p className="text-xs text-center text-zinc-500">
                  {session.totalPoints < voucher.pointsRequired && (
                    <>
                      Kamu butuh {voucher.pointsRequired - session.totalPoints}{" "}
                      poin lagi
                    </>
                  )}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Konfirmasi Penukaran
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p>Apakah kamu yakin ingin menukar voucher ini?</p>
                <div className="bg-zinc-50 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-600">Voucher</span>
                    <span className="font-medium">{voucher?.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-600">Poin dibutuhkan</span>
                    <span className="font-medium text-green-600">
                      {voucher?.pointsRequired} Poin
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-600">Sisa poin kamu</span>
                    <span className="font-medium">
                      {(session?.totalPoints || 0) -
                        (voucher?.pointsRequired || 0)}{" "}
                      Poin
                    </span>
                  </div>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-green-600 hover:bg-green-700"
              onClick={confirmRedeem}
            >
              Ya, Tukar Sekarang
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Success Dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center justify-center gap-2 text-green-600">
              <CheckCircle className="h-6 w-6" />
              Penukaran Berhasil!
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-4 pt-2">
                <p className="text-center">
                  Voucher berhasil ditukar! Simpan kode redemption di bawah ini.
                </p>

                {redeemResult && (
                  <>
                    <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-center">
                      <p className="text-xs text-green-600 mb-1">
                        Kode Redemption
                      </p>
                      <div className="flex items-center justify-center gap-2">
                        <code className="text-lg font-bold text-green-800 font-mono">
                          {redeemResult.redemptionCode}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() =>
                            copyToClipboard(redeemResult.redemptionCode)
                          }
                        >
                          <Copy className="h-4 w-4 text-green-600" />
                        </Button>
                      </div>
                    </div>

                    <div className="bg-zinc-50 rounded-lg p-3 space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-600">Sisa Poin</span>
                        <span className="font-semibold text-green-600">
                          {redeemResult.remainingPoints} Poin
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-500 text-center">
                      Tunjukkan kode ini ke UMKM untuk menggunakan voucher
                    </p>
                  </>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel
              onClick={() => router.push("/reedem")}
              className="w-full sm:w-auto"
            >
              Lihat Voucher Saya
            </AlertDialogCancel>
            <AlertDialogAction
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
              onClick={() => setShowSuccessDialog(false)}
            >
              Tutup
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
