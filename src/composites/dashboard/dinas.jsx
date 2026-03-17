"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/use-auth";
import { useGetAllGreenActions } from "@/hooks/use-green-actions";
import dynamic from "next/dynamic";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  Calendar,
  Eye,
  Video,
  Filter,
  Search,
  X,
  Building2,
  MapPinned,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FullscreenLoader from "@/components/ui/fullscreen-loader";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";

const ActionsMap = dynamic(() => import("./actions-map"), {
  ssr: false,
  loading: () => <Skeleton className="h-[400px] w-full rounded-lg" />,
});

export default function DinasDashboardComposite() {
  const router = useRouter();
  const { data: session, isLoading: sessionLoading } = useSession();
  const [selectedAction, setSelectedAction] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");

  // Debounced filter values
  const debouncedSearch = useDebounce(searchQuery, 500);
  const debouncedDistrict = useDebounce(districtFilter, 500);
  const debouncedCity = useDebounce(cityFilter, 500);

  // Build query params
  const queryParams = useMemo(() => {
    const params = {};
    if (searchQuery) params.search = searchQuery;
    if (statusFilter) params.status = statusFilter;
    if (categoryFilter) params.category = categoryFilter;
    if (districtFilter) params.district = districtFilter;
    if (cityFilter) params.city = cityFilter;
    return params;
  }, [searchQuery, statusFilter, categoryFilter, districtFilter, cityFilter]);

  const { data: greenActionsData, isLoading: actionsLoading } =
    useGetAllGreenActions(queryParams);

  // Prepare data before early returns
  const greenActions = greenActionsData?.data || [];
  const filteredActions = greenActions; // Already filtered by backend

  const stats = useMemo(() => {
    return {
      total: greenActions.length,
      verified: greenActions.filter((a) => a.status === "VERIFIED").length,
      rejected: greenActions.filter((a) => a.status === "REJECTED").length,
      pending: greenActions.filter((a) => a.status === "PENDING").length,
    };
  }, [greenActions]);

  // Hitung center map dari rata-rata koordinat yang ada
  const mapCenter = useMemo(() => {
    if (filteredActions.length === 0) {
      return { lat: -6.2088, lng: 106.8456 }; // Default Jakarta
    }
    const avgLat =
      filteredActions.reduce((sum, action) => sum + action.latitude, 0) /
      filteredActions.length;
    const avgLng =
      filteredActions.reduce((sum, action) => sum + action.longitude, 0) /
      filteredActions.length;
    return { lat: avgLat, lng: avgLng };
  }, [filteredActions]);

  useEffect(() => {
    if (!sessionLoading && (!session || session.role !== "DLH")) {
      router.push("/");
    }
  }, [session, router, sessionLoading]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "VERIFIED":
        return "bg-green-100 text-green-700 border-green-300";
      case "REJECTED":
        return "bg-red-100 text-red-700 border-red-300";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getCategoryLabel = (category) => {
    const labels = {
      PILAH_SAMPAH: "Pilah Sampah",
      TANAM_POHON: "Tanam Pohon",
      KONSUMSI_HIJAU: "Konsumsi Hijau",
      AKSI_KOLEKTIF: "Aksi Kolektif",
    };
    return labels[category] || category;
  };

  const handleViewDetail = (action) => {
    setSelectedAction(action);
    setDetailDialogOpen(true);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    setCategoryFilter("");
    setDistrictFilter("");
    setCityFilter("");
  };

  const hasActiveFilters =
    searchQuery ||
    statusFilter ||
    categoryFilter ||
    districtFilter ||
    cityFilter;

  if (sessionLoading) {
    return <FullscreenLoader />;
  }

  if (!session || session.role !== "DLH") {
    return null;
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-700">
          Dashboard Dinas Lingkungan Hidup
        </h1>
        <p className="text-sm sm:text-base text-zinc-600">
          Monitoring laporan green action wilayah
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardHeader className="pb-2 sm:pb-3">
            <CardDescription className="text-xs sm:text-sm">
              Total Laporan
            </CardDescription>
            <CardTitle className="text-2xl sm:text-3xl">
              {stats.total}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2 sm:pb-3">
            <CardDescription className="text-xs sm:text-sm">
              Terverifikasi
            </CardDescription>
            <CardTitle className="text-2xl sm:text-3xl text-green-600">
              {stats.verified}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2 sm:pb-3">
            <CardDescription className="text-xs sm:text-sm">
              Ditolak
            </CardDescription>
            <CardTitle className="text-2xl sm:text-3xl text-red-600">
              {stats.rejected}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2 sm:pb-3">
            <CardDescription className="text-xs sm:text-sm">
              Pending
            </CardDescription>
            <CardTitle className="text-2xl sm:text-3xl text-yellow-600">
              {stats.pending}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Filter className="h-5 w-5" />
              Filter Laporan
            </CardTitle>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs sm:text-sm"
              >
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
            {/* Search */}
            <div className="space-y-2 sm:col-span-2 lg:col-span-3 xl:col-span-1">
              <Label htmlFor="search" className="text-xs sm:text-sm">
                Cari
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input
                  id="search"
                  placeholder="Lokasi, deskripsi, nama..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 text-sm"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <Label htmlFor="status" className="text-xs sm:text-sm">
                Status
              </Label>
              <Select
                value={statusFilter || "all"}
                onValueChange={(value) =>
                  setStatusFilter(value === "all" ? "" : value)
                }
              >
                <SelectTrigger id="status" className="text-sm w-full">
                  <SelectValue placeholder="Semua Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="VERIFIED">Terverifikasi</SelectItem>
                  <SelectItem value="REJECTED">Ditolak</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="NEEDS_IMPROVEMENT">
                    Perlu Perbaikan
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-xs sm:text-sm">
                Kategori
              </Label>
              <Select
                value={categoryFilter || "all"}
                onValueChange={(value) =>
                  setCategoryFilter(value === "all" ? "" : value)
                }
              >
                <SelectTrigger id="category" className="text-sm w-full">
                  <SelectValue placeholder="Semua Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  <SelectItem value="PILAH_SAMPAH">Pilah Sampah</SelectItem>
                  <SelectItem value="TANAM_POHON">Tanam Pohon</SelectItem>
                  <SelectItem value="KONSUMSI_HIJAU">Konsumsi Hijau</SelectItem>
                  <SelectItem value="AKSI_KOLEKTIF">Aksi Kolektif</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* District Filter */}
            <div className="space-y-2">
              <Label
                htmlFor="district"
                className="text-xs sm:text-sm flex items-center gap-1"
              >
                <MapPinned className="h-3 w-3" />
                Kelurahan
              </Label>
              <Input
                id="district"
                placeholder="Cari kelurahan..."
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
                className="text-sm"
              />
            </div>

            {/* City Filter */}
            <div className="space-y-2">
              <Label
                htmlFor="city"
                className="text-xs sm:text-sm flex items-center gap-1"
              >
                <Building2 className="h-3 w-3" />
                Kota
              </Label>
              <Input
                id="city"
                placeholder="Cari kota..."
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="text-sm"
              />
            </div>
          </div>

          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex flex-wrap gap-2">
                <span className="text-xs sm:text-sm text-zinc-600">
                  Filter aktif:
                </span>
                {searchQuery && (
                  <Badge variant="secondary" className="text-xs">
                    Cari: {searchQuery}
                    <X
                      className="h-3 w-3 ml-1 cursor-pointer"
                      onClick={() => setSearchQuery("")}
                    />
                  </Badge>
                )}
                {statusFilter && (
                  <Badge variant="secondary" className="text-xs">
                    Status: {statusFilter}
                    <X
                      className="h-3 w-3 ml-1 cursor-pointer"
                      onClick={() => setStatusFilter("")}
                    />
                  </Badge>
                )}
                {categoryFilter && (
                  <Badge variant="secondary" className="text-xs">
                    Kategori: {categoryFilter}
                    <X
                      className="h-3 w-3 ml-1 cursor-pointer"
                      onClick={() => setCategoryFilter("")}
                    />
                  </Badge>
                )}
                {districtFilter && (
                  <Badge variant="secondary" className="text-xs">
                    Kelurahan: {districtFilter}
                    <X
                      className="h-3 w-3 ml-1 cursor-pointer"
                      onClick={() => setDistrictFilter("")}
                    />
                  </Badge>
                )}
                {cityFilter && (
                  <Badge variant="secondary" className="text-xs">
                    Kota: {cityFilter}
                    <X
                      className="h-3 w-3 ml-1 cursor-pointer"
                      onClick={() => setCityFilter("")}
                    />
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Map */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">
            Peta Lokasi Laporan
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Visualisasi lokasi green action di wilayah
          </CardDescription>
        </CardHeader>
        <CardContent>
          {actionsLoading ? (
            <Skeleton className="h-[300px] sm:h-[400px] w-full rounded-lg" />
          ) : (
            <ActionsMap
              actions={filteredActions}
              initialPosition={mapCenter}
              onMarkerClick={handleViewDetail}
            />
          )}
        </CardContent>
      </Card>

      {/* Actions List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Daftar Laporan</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            {filteredActions.length} laporan ditemukan
          </CardDescription>
        </CardHeader>
        <CardContent>
          {actionsLoading ? (
            <div className="space-y-3 sm:space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg"
                >
                  <Skeleton className="h-14 w-14 sm:h-16 sm:w-16 rounded shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredActions.length === 0 ? (
            <div className="text-center py-12 text-zinc-500">
              <MapPin className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm sm:text-base">
                {hasActiveFilters
                  ? "Tidak ada laporan yang sesuai dengan filter"
                  : "Tidak ada laporan ditemukan"}
              </p>
              {hasActiveFilters && (
                <Button
                  variant="link"
                  size="sm"
                  onClick={clearFilters}
                  className="mt-2 text-xs sm:text-sm"
                >
                  Clear semua filter
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {filteredActions.map((action) => (
                <div
                  key={action.id}
                  className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg hover:bg-zinc-50 transition-colors"
                >
                  <div className="relative h-40 sm:h-16 w-full sm:w-16 rounded overflow-hidden bg-zinc-100 shrink-0">
                    {action.mediaType === "IMAGE" ? (
                      <Image
                        src={action.mediaUrl}
                        alt="Action"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <video
                        src={action.mediaUrl}
                        className="h-full w-full object-cover"
                        muted
                        playsInline
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm sm:text-base text-zinc-900 truncate">
                          {getCategoryLabel(action.category)}
                        </h4>
                        <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1 text-xs sm:text-sm text-zinc-600">
                          <MapPin className="h-3 w-3 shrink-0" />
                          <span className="truncate">
                            {action.locationName}
                          </span>
                          <span className="text-zinc-400 hidden sm:inline">
                            •
                          </span>
                          <span className="truncate">
                            {action.district}, {action.city}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2 mt-1 text-xs text-zinc-500">
                          <Calendar className="h-3 w-3 shrink-0" />
                          <span>{formatDate(action.createdAt)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                        <Badge
                          className={cn(
                            "text-xs whitespace-nowrap",
                            getStatusBadgeColor(action.status)
                          )}
                        >
                          {action.status}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetail(action)}
                          className="text-xs"
                        >
                          <Eye className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-0" />
                          <span className="sm:hidden ml-1">Detail</span>
                        </Button>
                      </div>
                    </div>
                    {action.description && (
                      <p className="text-xs sm:text-sm text-zinc-600 mt-2 line-clamp-2">
                        {action.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Laporan Green Action</DialogTitle>
            <DialogDescription>
              Informasi lengkap laporan green action
            </DialogDescription>
          </DialogHeader>
          {selectedAction && (
            <div className="space-y-4">
              {/* Media */}
              <div className="relative w-full h-48 sm:h-64 rounded-lg overflow-hidden bg-zinc-100">
                {selectedAction.mediaType === "IMAGE" ? (
                  <Image
                    src={selectedAction.mediaUrl}
                    alt="Action media"
                    fill
                    className="object-contain"
                  />
                ) : (
                  <video
                    src={selectedAction.mediaUrl}
                    controls
                    className="w-full h-full"
                  />
                )}
              </div>

              {/* Info */}
              <div className="grid gap-3 sm:gap-4">
                <div>
                  <label className="text-xs sm:text-sm font-medium text-zinc-700">
                    Kategori
                  </label>
                  <p className="text-sm sm:text-base text-zinc-900">
                    {getCategoryLabel(selectedAction.category)}
                  </p>
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-medium text-zinc-700">
                    Status
                  </label>
                  <div className="mt-1">
                    <Badge
                      className={cn(
                        "text-xs",
                        getStatusBadgeColor(selectedAction.status)
                      )}
                    >
                      {selectedAction.status}
                    </Badge>
                  </div>
                </div>

                {selectedAction.description && (
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-zinc-700">
                      Deskripsi
                    </label>
                    <p className="text-sm sm:text-base text-zinc-900">
                      {selectedAction.description}
                    </p>
                  </div>
                )}

                <div>
                  <label className="text-xs sm:text-sm font-medium text-zinc-700">
                    Lokasi
                  </label>
                  <p className="text-sm sm:text-base text-zinc-900">
                    {selectedAction.locationName}
                  </p>
                  <p className="text-xs sm:text-sm text-zinc-600">
                    {selectedAction.district}, {selectedAction.city}
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">
                    Koordinat: {selectedAction.latitude},{" "}
                    {selectedAction.longitude}
                  </p>
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-medium text-zinc-700">
                    AI Score
                  </label>
                  <p className="text-sm sm:text-base text-zinc-900">
                    {selectedAction.aiScore}
                  </p>
                </div>

                {selectedAction.aiFeedback && (
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-zinc-700">
                      AI Feedback
                    </label>
                    <p className="text-sm sm:text-base text-zinc-900">
                      {selectedAction.aiFeedback}
                    </p>
                  </div>
                )}

                {selectedAction.points > 0 && (
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-zinc-700">
                      Poin
                    </label>
                    <p className="text-sm sm:text-base font-semibold text-green-600">
                      {selectedAction.points} poin
                    </p>
                  </div>
                )}

                <div>
                  <label className="text-xs sm:text-sm font-medium text-zinc-700">
                    Tanggal Dibuat
                  </label>
                  <p className="text-sm sm:text-base text-zinc-900">
                    {formatDate(selectedAction.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
