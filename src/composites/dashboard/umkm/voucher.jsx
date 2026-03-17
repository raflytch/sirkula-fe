"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Ticket,
  Plus,
  Pencil,
  Trash2,
  Calendar,
  Coins,
  Percent,
  ImageIcon,
  TrendingUp,
  Users,
  Package,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { useSession } from "@/hooks/use-auth";
import {
  useGetMyVouchers,
  useGetVoucherStats,
  useCreateVoucher,
  useUpdateVoucher,
  useDeleteVoucher,
} from "@/hooks/use-vouchers";
import { useDebounce } from "@/hooks/use-debounce";
import FullscreenLoader from "@/components/ui/fullscreen-loader";

const DISCOUNT_TYPES = [
  { value: "PERCENTAGE", label: "Persentase (%)" },
  { value: "FIXED_AMOUNT", label: "Potongan Langsung (Rp)" },
];

const initialFormData = {
  name: "",
  description: "",
  pointsRequired: "",
  discountType: "PERCENTAGE",
  discountValue: "",
  quotaTotal: "",
  validFrom: "",
  validUntil: "",
  isActive: true,
};

const CHART_COLORS = ["#fbbf24", "#22c55e", "#ef4444"];

export default function UmkmVoucherComposite() {
  const router = useRouter();
  const imageInputRef = useRef(null);
  const { data: session, isLoading: isSessionLoading } = useSession();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Search state with debounce
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);

  const filterParams = {
    search: debouncedSearch || undefined,
  };

  const { data: vouchersData, isLoading: isVouchersLoading } =
    useGetMyVouchers(filterParams);
  const { data: statsData, isLoading: isStatsLoading } = useGetVoucherStats();
  const { mutate: createVoucher, isPending: isCreating } = useCreateVoucher();
  const { mutate: updateVoucher, isPending: isUpdating } = useUpdateVoucher();
  const { mutate: deleteVoucher, isPending: isDeleting } = useDeleteVoucher();

  const vouchers = vouchersData?.data || [];
  const stats = statsData?.data || null;

  const claimsChartData = stats
    ? [
        { name: "Pending", value: stats.claimsByStatus?.pending || 0 },
        { name: "Digunakan", value: stats.claimsByStatus?.used || 0 },
        { name: "Kadaluarsa", value: stats.claimsByStatus?.expired || 0 },
      ]
    : [];

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setImageFile(null);
    setImagePreview(null);
    setEditingVoucher(null);
  };

  const handleOpenDialog = (voucher = null) => {
    if (voucher) {
      setEditingVoucher(voucher);
      setFormData({
        name: voucher.name || "",
        description: voucher.description || "",
        pointsRequired: voucher.pointsRequired?.toString() || "",
        discountType: voucher.discountType || "PERCENTAGE",
        discountValue: voucher.discountValue?.toString() || "",
        quotaTotal: voucher.quotaTotal?.toString() || "",
        validFrom: voucher.validFrom
          ? new Date(voucher.validFrom).toISOString().slice(0, 16)
          : "",
        validUntil: voucher.validUntil
          ? new Date(voucher.validUntil).toISOString().slice(0, 16)
          : "",
        isActive: voucher.isActive ?? true,
      });
      if (voucher.imageUrl) {
        setImagePreview(voucher.imageUrl);
      }
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      name: formData.name,
      description: formData.description,
      pointsRequired: parseInt(formData.pointsRequired),
      discountType: formData.discountType,
      discountValue: parseInt(formData.discountValue),
      quotaTotal: parseInt(formData.quotaTotal),
      validFrom: new Date(formData.validFrom).toISOString(),
      validUntil: new Date(formData.validUntil).toISOString(),
    };

    if (imageFile) {
      data.image = imageFile;
    }

    if (editingVoucher) {
      data.isActive = formData.isActive;
      updateVoucher(
        { id: editingVoucher.id, data },
        {
          onSuccess: handleCloseDialog,
        }
      );
    } else {
      createVoucher(data, {
        onSuccess: handleCloseDialog,
      });
    }
  };

  const handleDelete = (id) => {
    deleteVoucher(id);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const isMutating = isCreating || isUpdating || isDeleting;

  useEffect(() => {
    if (!isSessionLoading && (!session || session.role !== "UMKM")) {
      router.push("/");
    }
  }, [isSessionLoading, session, router]);

  if (isMutating) {
    return (
      <FullscreenLoader
        text={
          isCreating
            ? "Membuat voucher..."
            : isUpdating
            ? "Memperbarui voucher..."
            : "Menghapus voucher..."
        }
      />
    );
  }

  if (!isSessionLoading && (!session || session.role !== "UMKM")) {
    return null;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-green-800">
              Kelola Voucher
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Buat dan kelola voucher untuk pelanggan Anda
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-green-600 hover:bg-green-700 text-sm w-full sm:w-auto"
                onClick={() => handleOpenDialog()}
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Voucher
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] sm:max-w-lg max-h-[90vh] overflow-y-auto p-4 sm:p-6">
              <DialogHeader className="space-y-2 sm:space-y-3">
                <DialogTitle className="text-lg sm:text-xl">
                  {editingVoucher ? "Edit Voucher" : "Tambah Voucher Baru"}
                </DialogTitle>
                <DialogDescription className="text-xs sm:text-sm">
                  {editingVoucher
                    ? "Perbarui informasi voucher"
                    : "Buat voucher baru untuk pelanggan Anda"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="space-y-3 sm:space-y-4">
                  <Label className="text-sm sm:text-base font-medium">
                    Gambar Voucher
                  </Label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 border-2 border-dashed rounded-lg flex items-center justify-center overflow-hidden bg-zinc-50 shrink-0">
                      {imagePreview ? (
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          width={80}
                          height={80}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <ImageIcon className="w-6 h-6 sm:w-8 sm:h-8 text-zinc-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <input
                        type="file"
                        ref={imageInputRef}
                        onChange={handleImageChange}
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto h-9 sm:h-10 text-xs sm:text-sm"
                        onClick={() => imageInputRef.current?.click()}
                      >
                        Upload Gambar
                      </Button>
                      <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                        Opsional. JPEG, PNG, GIF, WebP
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm sm:text-base">
                    Nama Voucher *
                  </Label>
                  <Input
                    id="name"
                    placeholder="Contoh: Diskon 10% Makanan"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="h-10 sm:h-11 text-sm sm:text-base"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm sm:text-base">
                    Deskripsi *
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Jelaskan detail voucher..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="min-h-20 sm:min-h-24 text-sm sm:text-base resize-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="pointsRequired"
                      className="text-sm sm:text-base"
                    >
                      Poin Dibutuhkan *
                    </Label>
                    <Input
                      id="pointsRequired"
                      type="number"
                      min="1"
                      placeholder="100"
                      value={formData.pointsRequired}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pointsRequired: e.target.value,
                        })
                      }
                      className="h-10 sm:h-11 text-sm sm:text-base"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="quotaTotal"
                      className="text-sm sm:text-base"
                    >
                      Kuota Total *
                    </Label>
                    <Input
                      id="quotaTotal"
                      type="number"
                      min="1"
                      placeholder="50"
                      value={formData.quotaTotal}
                      onChange={(e) =>
                        setFormData({ ...formData, quotaTotal: e.target.value })
                      }
                      className="h-10 sm:h-11 text-sm sm:text-base"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="discountType"
                      className="text-sm sm:text-base"
                    >
                      Tipe Diskon *
                    </Label>
                    <Select
                      value={formData.discountType}
                      onValueChange={(value) =>
                        setFormData({ ...formData, discountType: value })
                      }
                    >
                      <SelectTrigger className="h-10 sm:h-11 text-sm sm:text-base w-full">
                        <SelectValue placeholder="Pilih tipe" />
                      </SelectTrigger>
                      <SelectContent>
                        {DISCOUNT_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="discountValue"
                      className="text-sm sm:text-base"
                    >
                      Nilai Diskon *
                    </Label>
                    <Input
                      id="discountValue"
                      type="number"
                      min="1"
                      placeholder={
                        formData.discountType === "PERCENTAGE" ? "10" : "10000"
                      }
                      value={formData.discountValue}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discountValue: e.target.value,
                        })
                      }
                      className="h-10 sm:h-11 text-sm sm:text-base"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="validFrom" className="text-sm sm:text-base">
                      Berlaku Dari *
                    </Label>
                    <Input
                      id="validFrom"
                      type="datetime-local"
                      value={formData.validFrom}
                      onChange={(e) =>
                        setFormData({ ...formData, validFrom: e.target.value })
                      }
                      className="h-10 sm:h-11 text-sm sm:text-base"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="validUntil"
                      className="text-sm sm:text-base"
                    >
                      Berlaku Sampai *
                    </Label>
                    <Input
                      id="validUntil"
                      type="datetime-local"
                      value={formData.validUntil}
                      onChange={(e) =>
                        setFormData({ ...formData, validUntil: e.target.value })
                      }
                      className="h-10 sm:h-11 text-sm sm:text-base"
                      required
                    />
                  </div>
                </div>

                {editingVoucher && (
                  <div className="space-y-2">
                    <Label htmlFor="isActive" className="text-sm sm:text-base">
                      Status
                    </Label>
                    <Select
                      value={formData.isActive ? "true" : "false"}
                      onValueChange={(value) =>
                        setFormData({ ...formData, isActive: value === "true" })
                      }
                    >
                      <SelectTrigger className="h-10 sm:h-11 text-sm sm:text-base w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Aktif</SelectItem>
                        <SelectItem value="false">Nonaktif</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-3 pt-4 sm:pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseDialog}
                    className="w-full sm:w-auto h-10 sm:h-11 text-sm sm:text-base order-2 sm:order-1"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 w-full sm:w-auto h-10 sm:h-11 text-sm sm:text-base order-1 sm:order-2"
                  >
                    {editingVoucher ? "Simpan Perubahan" : "Buat Voucher"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
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
                  <Users className="h-4 w-4 text-muted-foreground" />
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

        {!isStatsLoading &&
          stats &&
          (stats.claimsByStatus?.pending > 0 ||
            stats.claimsByStatus?.used > 0 ||
            stats.claimsByStatus?.expired > 0) && (
            <Card className="border shadow-none">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-base sm:text-lg">
                  Statistik Klaim Voucher
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Distribusi status klaim voucher Anda
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="h-[200px] sm:h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={claimsChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {claimsChartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={CHART_COLORS[index % CHART_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

        {/* Search Section */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Cari voucher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-sm h-10 max-w-sm"
          />
        </div>

        {isVouchersLoading || isSessionLoading ? (
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border shadow-none">
                <CardHeader className="p-4 pb-3">
                  <Skeleton className="h-28 sm:h-32 w-full rounded-lg" />
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-3">
                  <Skeleton className="h-4 sm:h-5 w-3/4" />
                  <Skeleton className="h-3 sm:h-4 w-full" />
                  <Skeleton className="h-3 sm:h-4 w-2/3" />
                  <div className="flex gap-2">
                    <Skeleton className="h-5 sm:h-6 w-14 sm:w-16" />
                    <Skeleton className="h-5 sm:h-6 w-14 sm:w-16" />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Skeleton className="h-8 sm:h-9 flex-1" />
                    <Skeleton className="h-8 sm:h-9 flex-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : vouchers.length === 0 ? (
          <Card className="border shadow-none">
            <CardContent className="flex flex-col items-center justify-center py-10 sm:py-12 px-4">
              <Ticket className="w-10 h-10 sm:w-12 sm:h-12 text-zinc-300 mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-zinc-600 text-center">
                Belum ada voucher
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-4 text-center">
                Buat voucher pertama Anda untuk menarik pelanggan
              </p>
              <Button
                className="bg-green-600 hover:bg-green-700 text-sm"
                onClick={() => handleOpenDialog()}
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Voucher
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {vouchers.map((voucher) => (
              <Card key={voucher.id} className="border shadow-none">
                <CardHeader className="p-4 pb-3">
                  {voucher.imageUrl ? (
                    <div className="relative h-28 sm:h-32 w-full rounded-lg overflow-hidden bg-zinc-100">
                      <Image
                        src={voucher.imageUrl}
                        alt={voucher.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-28 sm:h-32 w-full rounded-lg bg-linear-to-br from-green-100 to-green-50 flex items-center justify-center">
                      <Ticket className="w-10 h-10 sm:w-12 sm:h-12 text-green-300" />
                    </div>
                  )}
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-2.5 sm:space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-sm sm:text-base line-clamp-1">
                      {voucher.name}
                    </CardTitle>
                    <Badge
                      variant={voucher.isActive ? "default" : "secondary"}
                      className={`text-[10px] sm:text-xs shrink-0 ${
                        voucher.isActive
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : ""
                      }`}
                    >
                      {voucher.isActive ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs sm:text-sm line-clamp-2">
                    {voucher.description}
                  </CardDescription>

                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1 text-[10px] sm:text-xs"
                    >
                      <Coins className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      {voucher.pointsRequired} Poin
                    </Badge>
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1 text-[10px] sm:text-xs"
                    >
                      <Percent className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      {voucher.discountType === "PERCENTAGE"
                        ? `${voucher.discountValue}%`
                        : `Rp${voucher.discountValue.toLocaleString("id-ID")}`}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] sm:text-xs">
                      Kuota: {voucher.quotaRemaining}/{voucher.quotaTotal}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground">
                    <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    {formatDate(voucher.validFrom)} -{" "}
                    {formatDate(voucher.validUntil)}
                  </div>

                  <div className="flex gap-2 pt-1.5 sm:pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs sm:text-sm h-8 sm:h-9"
                      onClick={() => handleOpenDialog(voucher)}
                    >
                      <Pencil className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 text-xs sm:text-sm h-8 sm:h-9"
                        >
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          Hapus
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Hapus Voucher?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Voucher &quot;
                            {voucher.name}&quot; akan dihapus secara permanen.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(voucher.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Hapus
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
