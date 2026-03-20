"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/use-auth";
import {
  useGetAllGreenActions,
  useGetDistricts,
  useDownloadReportPdf,
  useDownloadReportExcel,
} from "@/hooks/use-green-actions";
import dynamic from "next/dynamic";
import Image from "next/image";
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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Calendar,
  Eye,
  Filter,
  Search,
  X,
  Building2,
  MapPinned,
  FileDown,
  FileSpreadsheet,
  Loader2,
  BarChart3,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
  Leaf,
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

const STATUS_COLORS = {
  VERIFIED: "#22c55e",
  REJECTED: "#ef4444",
  PENDING: "#eab308",
  NEEDS_IMPROVEMENT: "#f97316",
};

const CATEGORY_LABELS = {
  PILAH_SAMPAH: "Pilah Sampah",
  TANAM_POHON: "Tanam Pohon",
  KONSUMSI_HIJAU: "Konsumsi Hijau",
  AKSI_KOLEKTIF: "Aksi Kolektif",
};

const CATEGORY_COLORS = {
  PILAH_SAMPAH: "#22c55e",
  TANAM_POHON: "#16a34a",
  KONSUMSI_HIJAU: "#4ade80",
  AKSI_KOLEKTIF: "#86efac",
};

const statusChartConfig = {
  verified: { label: "Terverifikasi", color: "#22c55e" },
  rejected: { label: "Ditolak", color: "#ef4444" },
  pending: { label: "Pending", color: "#eab308" },
  needsImprovement: { label: "Perlu Perbaikan", color: "#f97316" },
};

const categoryChartConfig = {
  PILAH_SAMPAH: { label: "Pilah Sampah", color: "#22c55e" },
  TANAM_POHON: { label: "Tanam Pohon", color: "#16a34a" },
  KONSUMSI_HIJAU: { label: "Konsumsi Hijau", color: "#4ade80" },
  AKSI_KOLEKTIF: { label: "Aksi Kolektif", color: "#86efac" },
};

const districtChartConfig = {
  total: { label: "Total Aksi", color: "#22c55e" },
};

export default function DinasDashboardComposite() {
  const router = useRouter();
  const { data: session, isLoading: sessionLoading } = useSession();
  const [selectedAction, setSelectedAction] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");

  const debouncedSearch = useDebounce(searchQuery, 500);
  const debouncedDistrict = useDebounce(districtFilter, 500);
  const debouncedCity = useDebounce(cityFilter, 500);

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
  const { data: districtsData, isLoading: districtsLoading } =
    useGetDistricts();
  const downloadPdf = useDownloadReportPdf();
  const downloadExcel = useDownloadReportExcel();

  const greenActions = greenActionsData?.data || [];
  const filteredActions = greenActions;
  const districts = districtsData?.data || [];

  const stats = useMemo(() => {
    return {
      total: greenActions.length,
      verified: greenActions.filter((a) => a.status === "VERIFIED").length,
      rejected: greenActions.filter((a) => a.status === "REJECTED").length,
      pending: greenActions.filter((a) => a.status === "PENDING").length,
      needsImprovement: greenActions.filter(
        (a) => a.status === "NEEDS_IMPROVEMENT",
      ).length,
    };
  }, [greenActions]);

  const statusChartData = useMemo(
    () => [
      { name: "Terverifikasi", value: stats.verified, fill: "#22c55e" },
      { name: "Ditolak", value: stats.rejected, fill: "#ef4444" },
      { name: "Pending", value: stats.pending, fill: "#eab308" },
      {
        name: "Perlu Perbaikan",
        value: stats.needsImprovement,
        fill: "#f97316",
      },
    ],
    [stats],
  );

  const categoryChartData = useMemo(() => {
    const counts = {};
    greenActions.forEach((a) => {
      counts[a.category] = (counts[a.category] || 0) + 1;
    });
    return Object.entries(counts).map(([key, value]) => ({
      name: CATEGORY_LABELS[key] || key,
      total: value,
      fill: CATEGORY_COLORS[key] || "#22c55e",
    }));
  }, [greenActions]);

  const districtChartData = useMemo(() => {
    const counts = {};
    greenActions.forEach((a) => {
      const key = a.district || "Tidak diketahui";
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);
  }, [greenActions]);

  const mapCenter = useMemo(() => {
    if (filteredActions.length === 0) {
      return { lat: -6.2088, lng: 106.8456 };
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

  const handleDownloadPdf = () => {
    if (selectedDistrict) {
      downloadPdf.mutate(selectedDistrict);
    }
  };

  const handleDownloadExcel = () => {
    if (selectedDistrict) {
      downloadExcel.mutate(selectedDistrict);
    }
  };

  const hasActiveFilters =
    searchQuery ||
    statusFilter ||
    categoryFilter ||
    districtFilter ||
    cityFilter;

  if (!mounted || sessionLoading) {
    return <FullscreenLoader />;
  }

  if (!session || session.role !== "DLH") {
    return null;
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 sm:space-y-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="rounded-2xl bg-linear-to-r from-green-50 to-emerald-50 border border-green-100 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-green-600" />
              <h1 className="text-2xl sm:text-3xl font-bold text-green-800">
                Dashboard Monitoring
              </h1>
            </div>
            <p className="text-sm sm:text-base text-green-600/80">
              Dinas Lingkungan Hidup &mdash; Monitoring Green Action
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm text-green-700/70">
            <BarChart3 className="h-4 w-4" />
            <span>{stats.total} total laporan</span>
          </div>
        </div>
      </div>

      {/* Overview Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-green-100 bg-linear-to-br from-green-50/50 to-white p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-zinc-500">Total Laporan</p>
              <p className="text-xl sm:text-2xl font-bold text-zinc-800">
                {stats.total}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-green-100 bg-linear-to-br from-green-50/50 to-white p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-zinc-500">Terverifikasi</p>
              <p className="text-xl sm:text-2xl font-bold text-green-600">
                {stats.verified}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-red-100 bg-linear-to-br from-red-50/30 to-white p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-red-100 p-2">
              <XCircle className="h-4 w-4 text-red-500" />
            </div>
            <div>
              <p className="text-xs text-zinc-500">Ditolak</p>
              <p className="text-xl sm:text-2xl font-bold text-red-500">
                {stats.rejected}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-yellow-100 bg-linear-to-br from-yellow-50/30 to-white p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-yellow-100 p-2">
              <Clock className="h-4 w-4 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs text-zinc-500">Pending</p>
              <p className="text-xl sm:text-2xl font-bold text-yellow-600">
                {stats.pending}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution Pie Chart */}
        <div className="rounded-xl border border-zinc-200/60 bg-white p-5 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-zinc-800 mb-1">
            Distribusi Status
          </h3>
          <p className="text-xs text-zinc-500 mb-4">
            Persentase status laporan green action
          </p>
          {actionsLoading ? (
            <Skeleton className="h-[250px] w-full rounded-lg" />
          ) : stats.total === 0 ? (
            <div className="h-[250px] flex items-center justify-center text-sm text-zinc-400">
              Belum ada data
            </div>
          ) : (
            <ChartContainer
              config={statusChartConfig}
              className="h-[250px] w-full"
            >
              <PieChart>
                <Pie
                  data={statusChartData.filter((d) => d.value > 0)}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  strokeWidth={2}
                  stroke="#fff"
                >
                  {statusChartData
                    .filter((d) => d.value > 0)
                    .map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
              </PieChart>
            </ChartContainer>
          )}
        </div>

        {/* Category Bar Chart */}
        <div className="rounded-xl border border-zinc-200/60 bg-white p-5 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-zinc-800 mb-1">
            Aksi per Kategori
          </h3>
          <p className="text-xs text-zinc-500 mb-4">
            Jumlah green action berdasarkan kategori
          </p>
          {actionsLoading ? (
            <Skeleton className="h-[250px] w-full rounded-lg" />
          ) : categoryChartData.length === 0 ? (
            <div className="h-[250px] flex items-center justify-center text-sm text-zinc-400">
              Belum ada data
            </div>
          ) : (
            <ChartContainer
              config={categoryChartConfig}
              className="h-[250px] w-full"
            >
              <BarChart data={categoryChartData} layout="vertical">
                <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                <XAxis type="number" allowDecimals={false} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={100}
                  tick={{ fontSize: 12 }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="total" radius={[0, 6, 6, 0]}>
                  {categoryChartData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          )}
        </div>
      </div>

      {/* District Distribution Chart */}
      <div className="rounded-xl border border-zinc-200/60 bg-white p-5 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-zinc-800 mb-1">
          Top 10 Kelurahan
        </h3>
        <p className="text-xs text-zinc-500 mb-4">
          Kelurahan dengan jumlah green action terbanyak
        </p>
        {actionsLoading ? (
          <Skeleton className="h-[300px] w-full rounded-lg" />
        ) : districtChartData.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-sm text-zinc-400">
            Belum ada data
          </div>
        ) : (
          <ChartContainer
            config={districtChartConfig}
            className="h-[300px] w-full"
          >
            <BarChart data={districtChartData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11 }}
                angle={-30}
                textAnchor="end"
                height={60}
              />
              <YAxis allowDecimals={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="total" fill="#22c55e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ChartContainer>
        )}
      </div>

      {/* Report Generation */}
      <div className="rounded-xl border border-green-200/60 bg-linear-to-r from-green-50/60 to-emerald-50/60 p-5 sm:p-6">
        <div className="flex flex-col gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FileDown className="h-5 w-5 text-green-600" />
              <h3 className="text-base sm:text-lg font-semibold text-zinc-800">
                Generate Laporan
              </h3>
            </div>
            <p className="text-xs text-zinc-500">
              Pilih kelurahan untuk mengunduh laporan green action
            </p>
            <div className="max-w-sm space-y-1.5">
              <Label htmlFor="pdf-district" className="text-xs text-zinc-600">
                Kelurahan
              </Label>
              <Select
                value={selectedDistrict}
                onValueChange={setSelectedDistrict}
              >
                <SelectTrigger id="pdf-district" className="text-sm bg-white">
                  <SelectValue placeholder="Pilih kelurahan..." />
                </SelectTrigger>
                <SelectContent>
                  {districtsLoading ? (
                    <SelectItem value="_loading" disabled>
                      Memuat data...
                    </SelectItem>
                  ) : districts.length === 0 ? (
                    <SelectItem value="_empty" disabled>
                      Tidak ada kelurahan
                    </SelectItem>
                  ) : (
                    districts.map((d) => (
                      <SelectItem key={d.district} value={d.district}>
                        {d.district} — {d.city}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleDownloadPdf}
              disabled={!selectedDistrict || downloadPdf.isPending}
              className="bg-green-600 hover:bg-green-700 text-white gap-2"
            >
              {downloadPdf.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileDown className="h-4 w-4" />
              )}
              {downloadPdf.isPending ? "Mengunduh..." : "Unduh PDF"}
            </Button>
            <Button
              onClick={handleDownloadExcel}
              disabled={!selectedDistrict || downloadExcel.isPending}
              variant="outline"
              className="gap-2 border-green-300 text-green-700 hover:bg-green-50"
            >
              {downloadExcel.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileSpreadsheet className="h-4 w-4" />
              )}
              {downloadExcel.isPending ? "Mengunduh..." : "Unduh Excel"}
            </Button>
          </div>
        </div>
      </div>

      <Separator />

      {/* Filters & Data Section */}
      <Tabs defaultValue="map" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <TabsList>
            <TabsTrigger value="map">Peta</TabsTrigger>
            <TabsTrigger value="table">Tabel</TabsTrigger>
          </TabsList>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-xs text-zinc-500"
            >
              <X className="h-3 w-3 mr-1" />
              Hapus filter
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="rounded-xl border border-zinc-200/60 bg-white p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="h-4 w-4 text-zinc-500" />
            <span className="text-sm font-medium text-zinc-700">
              Filter Data
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            <div className="space-y-1.5 sm:col-span-2 lg:col-span-3 xl:col-span-1">
              <Label htmlFor="search" className="text-xs text-zinc-500">
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

            <div className="space-y-1.5">
              <Label htmlFor="status" className="text-xs text-zinc-500">
                Status
              </Label>
              <Select
                value={statusFilter || "all"}
                onValueChange={(v) => setStatusFilter(v === "all" ? "" : v)}
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

            <div className="space-y-1.5">
              <Label htmlFor="category" className="text-xs text-zinc-500">
                Kategori
              </Label>
              <Select
                value={categoryFilter || "all"}
                onValueChange={(v) => setCategoryFilter(v === "all" ? "" : v)}
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

            <div className="space-y-1.5">
              <Label
                htmlFor="district"
                className="text-xs text-zinc-500 flex items-center gap-1"
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

            <div className="space-y-1.5">
              <Label
                htmlFor="city"
                className="text-xs text-zinc-500 flex items-center gap-1"
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
            <div className="mt-3 pt-3 border-t flex flex-wrap gap-1.5">
              {searchQuery && (
                <Badge
                  variant="secondary"
                  className="text-xs gap-1 cursor-pointer"
                  onClick={() => setSearchQuery("")}
                >
                  Cari: {searchQuery}
                  <X className="h-3 w-3" />
                </Badge>
              )}
              {statusFilter && (
                <Badge
                  variant="secondary"
                  className="text-xs gap-1 cursor-pointer"
                  onClick={() => setStatusFilter("")}
                >
                  Status: {statusFilter}
                  <X className="h-3 w-3" />
                </Badge>
              )}
              {categoryFilter && (
                <Badge
                  variant="secondary"
                  className="text-xs gap-1 cursor-pointer"
                  onClick={() => setCategoryFilter("")}
                >
                  Kategori: {categoryFilter}
                  <X className="h-3 w-3" />
                </Badge>
              )}
              {districtFilter && (
                <Badge
                  variant="secondary"
                  className="text-xs gap-1 cursor-pointer"
                  onClick={() => setDistrictFilter("")}
                >
                  Kelurahan: {districtFilter}
                  <X className="h-3 w-3" />
                </Badge>
              )}
              {cityFilter && (
                <Badge
                  variant="secondary"
                  className="text-xs gap-1 cursor-pointer"
                  onClick={() => setCityFilter("")}
                >
                  Kota: {cityFilter}
                  <X className="h-3 w-3" />
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Map Tab */}
        <TabsContent value="map">
          <div className="rounded-xl border border-zinc-200/60 bg-white p-4 sm:p-5">
            <div className="mb-3">
              <h3 className="text-base font-semibold text-zinc-800">
                Peta Lokasi Laporan
              </h3>
              <p className="text-xs text-zinc-500">
                Visualisasi lokasi green action di wilayah
              </p>
            </div>
            {actionsLoading ? (
              <Skeleton className="h-[350px] sm:h-[450px] w-full rounded-lg" />
            ) : (
              <ActionsMap
                actions={filteredActions}
                initialPosition={mapCenter}
                onMarkerClick={handleViewDetail}
              />
            )}
          </div>
        </TabsContent>

        {/* Table Tab */}
        <TabsContent value="table">
          <div className="rounded-xl border border-zinc-200/60 bg-white overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-zinc-100">
              <h3 className="text-base font-semibold text-zinc-800">
                Daftar Laporan
              </h3>
              <p className="text-xs text-zinc-500">
                {filteredActions.length} laporan ditemukan
              </p>
            </div>
            {actionsLoading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3 p-3 border rounded-lg">
                    <Skeleton className="h-12 w-12 rounded shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredActions.length === 0 ? (
              <div className="text-center py-16 text-zinc-400">
                <MapPin className="h-10 w-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm">
                  {hasActiveFilters
                    ? "Tidak ada laporan sesuai filter"
                    : "Belum ada laporan"}
                </p>
                {hasActiveFilters && (
                  <Button
                    variant="link"
                    size="sm"
                    onClick={clearFilters}
                    className="mt-1 text-xs"
                  >
                    Hapus semua filter
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-zinc-50/80">
                      <TableHead className="text-xs">Media</TableHead>
                      <TableHead className="text-xs">Kategori</TableHead>
                      <TableHead className="text-xs">Lokasi</TableHead>
                      <TableHead className="text-xs">Kelurahan</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                      <TableHead className="text-xs">Tanggal</TableHead>
                      <TableHead className="text-xs w-[60px]" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredActions.map((action) => (
                      <TableRow key={action.id} className="hover:bg-zinc-50/50">
                        <TableCell className="py-2">
                          <div className="relative h-10 w-10 rounded overflow-hidden bg-zinc-100 shrink-0">
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
                        </TableCell>
                        <TableCell className="text-xs font-medium">
                          {CATEGORY_LABELS[action.category] || action.category}
                        </TableCell>
                        <TableCell className="text-xs text-zinc-600 max-w-[150px] truncate">
                          {action.locationName}
                        </TableCell>
                        <TableCell className="text-xs text-zinc-600">
                          {action.district}, {action.city}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={cn(
                              "text-[10px] px-1.5 py-0.5",
                              getStatusBadgeColor(action.status),
                            )}
                          >
                            {action.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-zinc-500">
                          {formatDate(action.createdAt)}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={() => handleViewDetail(action)}
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

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

              <div className="grid gap-3">
                <div>
                  <p className="text-xs font-medium text-zinc-500">Kategori</p>
                  <p className="text-sm text-zinc-900">
                    {CATEGORY_LABELS[selectedAction.category] ||
                      selectedAction.category}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-zinc-500">Status</p>
                  <Badge
                    className={cn(
                      "text-xs mt-0.5",
                      getStatusBadgeColor(selectedAction.status),
                    )}
                  >
                    {selectedAction.status}
                  </Badge>
                </div>

                {selectedAction.description && (
                  <div>
                    <p className="text-xs font-medium text-zinc-500">
                      Deskripsi
                    </p>
                    <p className="text-sm text-zinc-900">
                      {selectedAction.description}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-xs font-medium text-zinc-500">Lokasi</p>
                  <p className="text-sm text-zinc-900">
                    {selectedAction.locationName}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {selectedAction.district}, {selectedAction.city}
                  </p>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {selectedAction.latitude}, {selectedAction.longitude}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-zinc-500">AI Score</p>
                  <p className="text-sm text-zinc-900">
                    {selectedAction.aiScore}
                  </p>
                </div>

                {selectedAction.aiFeedback && (
                  <div>
                    <p className="text-xs font-medium text-zinc-500">
                      AI Feedback
                    </p>
                    <p className="text-sm text-zinc-900">
                      {selectedAction.aiFeedback}
                    </p>
                  </div>
                )}

                {selectedAction.points > 0 && (
                  <div>
                    <p className="text-xs font-medium text-zinc-500">Poin</p>
                    <p className="text-sm font-semibold text-green-600">
                      {selectedAction.points} poin
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-xs font-medium text-zinc-500">
                    Tanggal Dibuat
                  </p>
                  <p className="text-sm text-zinc-900">
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
