"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import dynamic from "next/dynamic";
import {
  useMyGreenActions,
  useMyGreenActionStats,
  useGreenActionCategories,
  useCreateGreenAction,
} from "@/hooks/use-green-actions";
import {
  setSelectedLocation,
  setSelectedCategory,
  setSelectedSubCategory,
  resetGreenActionForm,
} from "@/features/slices/green-action.slice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import FullscreenLoader from "@/components/ui/fullscreen-loader";
import {
  Plus,
  Upload,
  Recycle,
  TreePine,
  ShoppingBag,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Sparkles,
  Award,
  Target,
  X,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SparklesText } from "@/components/ui/sparkles-text";
import { AuroraText } from "@/components/ui/aurora-text";

const Map = dynamic(() => import("@/components/map"), { ssr: false });

const categoryIcons = {
  PILAH_SAMPAH: Recycle,
  TANAM_POHON: TreePine,
  KONSUMSI_HIJAU: ShoppingBag,
  AKSI_KOLEKTIF: Users,
};

export default function SirkulaGreenActionComposite() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);
  const [showFileSizeDialog, setShowFileSizeDialog] = useState(false);
  const [createdActionId, setCreatedActionId] = useState(null);
  const [formData, setFormData] = useState({
    category: "",
    subCategory: "",
    description: "",
    media: null,
  });
  const [selectedLocation, setLocation] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);

  const { data: categoriesData, isLoading: categoriesLoading } =
    useGreenActionCategories();
  const { data: actionsData, isLoading: actionsLoading } = useMyGreenActions();
  const { data: statsData, isLoading: statsLoading } = useMyGreenActionStats();
  const createMutation = useCreateGreenAction();

  useEffect(() => {
    if (createdActionId) {
      router.push(`/sirkula-green-action/${createdActionId}`);
    }
  }, [createdActionId, router]);

  const handleLocationSelect = (location) => {
    setLocation(location);
    dispatch(setSelectedLocation(location));
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validasi ukuran file maksimal 1MB (1 * 1024 * 1024 bytes)
      const maxSize = 1 * 1024 * 1024;
      if (file.size > maxSize) {
        setShowFileSizeDialog(true);
        e.target.value = ""; // Reset input file
        return;
      }
      setFormData({ ...formData, media: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedLocation) {
      return;
    }

    const submitData = new FormData();
    submitData.append("category", formData.category);
    submitData.append("subCategory", formData.subCategory);
    submitData.append("description", formData.description);
    submitData.append("latitude", selectedLocation.lat);
    submitData.append("longitude", selectedLocation.lng);
    submitData.append("media", formData.media);

    createMutation.mutate(submitData, {
      onSuccess: (data) => {
        setShowForm(false);
        setFormData({
          category: "",
          subCategory: "",
          description: "",
          media: null,
        });
        setLocation(null);
        setMediaPreview(null);
        dispatch(resetGreenActionForm());

        // Set created action ID untuk trigger redirect via useEffect
        if (data?.data?.id) {
          setCreatedActionId(data.data.id);
        }
      },
    });
  };

  const categories = categoriesData?.data || {};
  const actions = actionsData?.data || [];
  const stats = statsData?.data || {};

  const selectedCategoryData = formData.category
    ? categories[formData.category]
    : null;

  const getStatusBadge = (status) => {
    if (status === "VERIFIED") {
      return (
        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Terverifikasi
        </Badge>
      );
    } else if (status === "REJECTED") {
      return (
        <Badge className="bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-50">
          <XCircle className="h-3 w-3 mr-1" />
          Ditolak
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50">
          <Clock className="h-3 w-3 mr-1" />
          Menunggu
        </Badge>
      );
    }
  };

  if (createMutation.isPending) {
    return <FullscreenLoader text="Mengirimkan aksi hijau Anda..." />;
  }

  return (
    <>
      {/* Alert Dialog untuk ukuran file terlalu besar */}
      <AlertDialog
        open={showFileSizeDialog}
        onOpenChange={setShowFileSizeDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <XCircle className="h-5 w-5" />
              Ukuran File Terlalu Besar
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              File yang Anda pilih melebihi batas maksimal <strong>1MB</strong>.
              Silakan pilih file dengan ukuran yang lebih kecil atau kompres
              file Anda terlebih dahulu.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction className="bg-emerald-600 hover:bg-emerald-700">
              Mengerti
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-8 w-8 text-emerald-600" />
              <SparklesText
                colors={{ first: "#10b981", second: "#14b8a6" }}
                className="text-2xl sm:text-3xl lg:text-4xl font-bold"
                sparklesCount={8}
              >
                <AuroraText
                  colors={["#10b981", "#14b8a6", "#0ea5e9", "#10b981"]}
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold"
                  speed={1.5}
                >
                  Sirkula Green Action
                </AuroraText>
              </SparklesText>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground">
              Lacak dan verifikasi aksi berkelanjutan Anda dengan AI
            </p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto"
            size="lg"
          >
            <Plus className="h-5 w-5" />
            {showForm ? "Batal" : "Aksi Baru"}
          </Button>
        </div>

        {statsLoading ? (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="border-slate-200">
                <CardHeader className="pb-3">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="border-slate-200 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-600">
                    Total Aksi
                  </CardTitle>
                  <Target className="h-5 w-5 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">
                  {stats.totalActions || 0}
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-200 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-600">
                    Total Poin
                  </CardTitle>
                  <Award className="h-5 w-5 text-amber-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold bg-linear-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                  {stats.totalPoints || 0}
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-200 hover:shadow-lg transition-shadow sm:col-span-2 lg:col-span-1">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-600">
                    Aksi Terverifikasi
                  </CardTitle>
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-emerald-600">
                  {stats.verifiedActions || 0}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {showForm && (
          <Card className="border-slate-200 shadow-lg">
            <CardHeader className="bg-linear-to-r border-b border-slate-200 py-2">
              <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-emerald-600" />
                Kirim Aksi Hijau Baru
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Upload bukti aksi berkelanjutan Anda dan dapatkan poin
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm font-medium">
                      Kategori *
                    </Label>
                    {categoriesLoading ? (
                      <Skeleton className="h-11 w-full" />
                    ) : (
                      <Select
                        value={formData.category}
                        onValueChange={(value) => {
                          setFormData({
                            ...formData,
                            category: value,
                            subCategory: "",
                          });
                          dispatch(setSelectedCategory(value));
                        }}
                        required
                      >
                        <SelectTrigger
                          id="category"
                          className="h-11 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 w-full"
                        >
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {Object.entries(categories).map(([key, cat]) => {
                            const Icon = categoryIcons[key] || Recycle;
                            return (
                              <SelectItem
                                key={key}
                                value={key}
                                className="py-2.5"
                              >
                                <div className="flex items-center justify-center gap-2.5 w-full">
                                  <Icon className="h-4 w-4 text-emerald-600 shrink-0" />
                                  <span className="font-medium">
                                    {cat.name}
                                  </span>
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="subCategory"
                      className="text-sm font-medium"
                    >
                      Sub Kategori *
                    </Label>
                    {selectedCategoryData ? (
                      <Select
                        value={formData.subCategory}
                        onValueChange={(value) => {
                          setFormData({ ...formData, subCategory: value });
                          dispatch(setSelectedSubCategory(value));
                        }}
                        required
                      >
                        <SelectTrigger
                          id="subCategory"
                          className="h-11 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 w-full"
                        >
                          <SelectValue placeholder="Pilih sub kategori" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {selectedCategoryData.subCategories.map((sub) => (
                            <SelectItem
                              key={sub.id}
                              value={sub.id}
                              className="py-2.5"
                            >
                              <div className="flex items-center justify-center w-full">
                                <span className="font-medium">{sub.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Select disabled>
                        <SelectTrigger
                          disabled
                          className="h-11 border-slate-300 w-full"
                        >
                          <SelectValue placeholder="Pilih kategori terlebih dahulu" />
                        </SelectTrigger>
                      </Select>
                    )}
                  </div>
                </div>

                {formData.subCategory && selectedCategoryData && (
                  <Alert className="bg-emerald-50 border-emerald-200">
                    <Sparkles className="h-4 w-4 text-emerald-600" />
                    <AlertDescription className="text-sm text-emerald-800">
                      <strong>Kriteria:</strong>{" "}
                      {
                        selectedCategoryData.subCategories.find(
                          (s) => s.id === formData.subCategory
                        )?.criteria
                      }
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Deskripsi (Opsional)
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Jelaskan aksi hijau Anda secara detail..."
                    rows={3}
                    className="resize-none border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Pilih Lokasi di Peta *
                  </Label>
                  <Map
                    onLocationSelect={handleLocationSelect}
                    initialPosition={selectedLocation}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="media" className="text-sm font-medium">
                    Upload Media (Gambar/Video) *{" "}
                    <span className="text-xs text-muted-foreground">
                      (Maks. 1MB)
                    </span>
                  </Label>
                  <Input
                    id="media"
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleMediaChange}
                    required
                    className="h-11 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                  />
                  {mediaPreview && (
                    <div className="mt-3 relative">
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 rounded-full z-10 shadow-lg"
                        onClick={() => {
                          setMediaPreview(null);
                          setFormData({ ...formData, media: null });
                          document.getElementById("media").value = "";
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      {formData.media?.type.startsWith("image/") ? (
                        <img
                          src={mediaPreview}
                          alt="Preview"
                          className="max-h-64 w-full object-contain rounded-lg border-2 border-slate-200"
                        />
                      ) : (
                        <video
                          src={mediaPreview}
                          controls
                          className="max-h-64 w-full rounded-lg border-2 border-slate-200"
                        />
                      )}
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full gap-2 h-12 bg-emerald-600 hover:bg-emerald-700 text-base font-medium"
                  disabled={
                    !selectedLocation ||
                    !formData.media ||
                    !formData.category ||
                    !formData.subCategory
                  }
                >
                  <Upload className="h-5 w-5" />
                  Kirim Aksi Hijau
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        <Card className="border-slate-200">
          <CardHeader className="border-b border-slate-200">
            <CardTitle className="text-xl sm:text-2xl">
              Aksi Hijau Saya
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Lihat semua aksi yang telah Anda kirimkan
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {actionsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row gap-4 p-4 border border-slate-200 rounded-lg"
                  >
                    <Skeleton className="h-48 sm:h-28 sm:w-28 w-full rounded-lg shrink-0" />
                    <div className="flex-1 space-y-2 w-full">
                      <Skeleton className="h-5 w-full max-w-xs" />
                      <Skeleton className="h-4 w-full max-w-[200px]" />
                      <Skeleton className="h-4 w-full max-w-md" />
                    </div>
                  </div>
                ))}
              </div>
            ) : actions.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 mb-4">
                  <Recycle className="h-8 w-8 text-emerald-600" />
                </div>
                <p className="text-lg font-medium text-slate-900 mb-1">
                  Belum ada aksi hijau
                </p>
                <p className="text-sm text-muted-foreground">
                  Mulai dengan mengirimkan aksi pertama Anda!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {actions.map((action) => {
                  const Icon = categoryIcons[action.category] || Recycle;
                  return (
                    <div
                      key={action.id}
                      className="flex flex-col sm:flex-row gap-4 p-4 border border-slate-200 rounded-lg hover:shadow-md transition-all hover:border-emerald-200"
                    >
                      <div className="relative h-48 sm:h-28 sm:w-28 shrink-0 rounded-lg overflow-hidden">
                        {action.mediaType === "IMAGE" ? (
                          <img
                            src={action.mediaUrl}
                            alt="Action"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <video
                            src={action.mediaUrl}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                          <div className="flex items-start gap-2 min-w-0 flex-1">
                            <Icon className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                            <h3 className="font-semibold text-base sm:text-lg overflow-wrap-anywhere line-clamp-2">
                              {action.description}
                            </h3>
                          </div>
                          {getStatusBadge(action.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {action.locationName} •{" "}
                          {new Date(action.createdAt).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                          <span className="text-sm font-semibold text-emerald-600 flex items-center gap-1">
                            <Award className="h-4 w-4" />
                            {action.points} poin
                          </span>
                          <span className="text-sm text-slate-600">
                            Skor AI: <strong>{action.aiScore}%</strong>
                          </span>
                        </div>
                      </div>
                      <div className="flex sm:flex-col gap-2 sm:shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            router.push(`/sirkula-green-action/${action.id}`)
                          }
                          className="gap-2 flex-1 sm:flex-none border-slate-300 hover:bg-emerald-50 hover:border-emerald-500 hover:text-emerald-700"
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sm:hidden lg:inline">
                            Lihat Detail
                          </span>
                          <span className="hidden sm:inline lg:hidden">
                            Detail
                          </span>
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
