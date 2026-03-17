"use client";

import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  useGreenActionById,
  useDeleteGreenAction,
  useRetryVerification,
} from "@/hooks/use-green-actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import FullscreenLoader from "@/components/ui/fullscreen-loader";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  RefreshCw,
  MapPin,
  Calendar,
  Award,
  Sparkles,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Map = dynamic(() => import("@/components/map"), { ssr: false });

export default function GreenActionDetailComposite({ id }) {
  const router = useRouter();
  const { data, isLoading } = useGreenActionById(id);
  const deleteMutation = useDeleteGreenAction();
  const retryMutation = useRetryVerification();

  const handleDelete = () => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        router.push("/sirkula-green-action");
      },
    });
  };

  const handleRetry = () => {
    retryMutation.mutate(id);
  };

  if (deleteMutation.isPending || retryMutation.isPending) {
    return (
      <FullscreenLoader
        text={
          deleteMutation.isPending ? "Deleting..." : "Retrying verification..."
        }
      />
    );
  }

  if (isLoading) {
    return (
      <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 space-y-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-24" />
        </div>
        <Card className="border-slate-200">
          <CardHeader>
            <Skeleton className="h-7 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-96 w-full rounded-lg" />
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const action = data?.data;

  if (!action) {
    return (
      <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Alert variant="destructive" className="border-rose-200">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Not Found</AlertTitle>
          <AlertDescription>
            Green action not found or has been removed.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    if (status === "VERIFIED") {
      return (
        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 text-sm sm:text-base py-1.5 px-3">
          <CheckCircle2 className="h-4 w-4 mr-1.5" />
          Verified
        </Badge>
      );
    } else if (status === "REJECTED") {
      return (
        <Badge className="bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-50 text-sm sm:text-base py-1.5 px-3">
          <XCircle className="h-4 w-4 mr-1.5" />
          Rejected
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50 text-sm sm:text-base py-1.5 px-3">
          <Clock className="h-4 w-4 mr-1.5" />
          Pending
        </Badge>
      );
    }
  };

  return (
    <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="gap-2 w-fit hover:bg-slate-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Aksi
        </Button>
        <div className="flex flex-col sm:flex-row gap-2">
          {action.status === "REJECTED" && (
            <Button
              variant="outline"
              onClick={handleRetry}
              className="gap-2 border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Coba Verifikasi Lagi</span>
              <span className="sm:hidden">Coba Lagi</span>
            </Button>
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="gap-2 bg-rose-600 hover:bg-rose-700"
              >
                <Trash2 className="h-4 w-4" />
                Hapus
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-md">
              <AlertDialogHeader>
                <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                <AlertDialogDescription>
                  Tindakan ini tidak dapat dibatalkan. Ini akan menghapus aksi
                  hijau Anda secara permanen beserta semua data terkait.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-rose-600 hover:bg-rose-700"
                >
                  Hapus
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Card className="border-slate-200 shadow-lg">
        <CardHeader className="bg-slate-50 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-xl sm:text-2xl lg:text-3xl mb-3 wrap-break-word">
                {action.description}
              </CardTitle>
              <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm sm:text-base">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 shrink-0" />
                  {new Date(action.createdAt).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                {action.locationName && (
                  <>
                    <span className="hidden sm:inline text-slate-400">•</span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 shrink-0" />
                      {action.locationName}
                    </span>
                  </>
                )}
              </CardDescription>
            </div>
            <div className="shrink-0">{getStatusBadge(action.status)}</div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="rounded-lg overflow-hidden border-2 border-slate-200">
            {action.mediaType === "IMAGE" ? (
              <img
                src={action.mediaUrl}
                alt="Bukti aksi"
                className="w-full h-auto max-h-[600px] object-contain bg-slate-50"
              />
            ) : (
              <video
                src={action.mediaUrl}
                controls
                className="w-full h-auto max-h-[600px] bg-slate-50"
              />
            )}
          </div>

          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="border-slate-200 hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-600">
                    Poin Didapat
                  </CardTitle>
                  <Award className="h-5 w-5 text-emerald-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-emerald-600">
                    {action.points}
                  </span>
                  <span className="text-sm text-slate-500">poin</span>
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-200 hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-600">
                    Skor AI
                  </CardTitle>
                  <Sparkles className="h-5 w-5 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-slate-900">
                    {action.aiScore}
                  </span>
                  <span className="text-lg text-slate-500">%</span>
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-200 hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Kategori
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold text-slate-900 capitalize">
                  {action.category.replace(/_/g, " ").toLowerCase()}
                </div>
              </CardContent>
            </Card>
          </div>

          {action.aiFeedback && (
            <Alert
              variant={action.status === "VERIFIED" ? "default" : "destructive"}
              className={
                action.status === "VERIFIED"
                  ? "bg-emerald-50 border-emerald-200"
                  : "bg-rose-50 border-rose-200"
              }
            >
              <AlertTitle className="flex items-center gap-2 text-base font-semibold">
                {action.status === "VERIFIED" ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-rose-600" />
                )}
                Umpan Balik AI
              </AlertTitle>
              <AlertDescription className="mt-2 text-sm leading-relaxed">
                {action.aiFeedback}
              </AlertDescription>
            </Alert>
          )}

          {action.aiLabels && (
            <div>
              <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                Item Terdeteksi
              </h3>
              <div className="flex flex-wrap gap-2">
                {JSON.parse(action.aiLabels).map((label, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="py-1.5 px-3 border-slate-300 text-slate-700 capitalize"
                  >
                    {label}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {action.latitude && action.longitude && (
            <div>
              <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-rose-600" />
                Lokasi
              </h3>
              <div className="rounded-lg overflow-hidden border-2 border-slate-200">
                <Map
                  initialPosition={{
                    lat: action.latitude,
                    lng: action.longitude,
                  }}
                  onLocationSelect={() => {}}
                  readOnly={true}
                />
              </div>
              {(action.district || action.city) && (
                <div className="mt-3 text-sm text-slate-600 flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>
                    {action.district && `${action.district}`}
                    {action.district && action.city && ", "}
                    {action.city}
                  </span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
