"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Store, MapPin, FileText, Camera, Save, XCircle } from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useSession, useUpdateUmkmProfile } from "@/hooks/use-auth";
import FullscreenLoader from "@/components/ui/fullscreen-loader";

const UMKM_CATEGORIES = [
  "Daur Ulang Sampah",
  "Produk Ramah Lingkungan",
  "Makanan & Minuman Organik",
  "Kerajinan dari Bahan Daur Ulang",
  "Fashion Berkelanjutan",
  "Bank Sampah",
  "Kompos & Pupuk Organik",
  "Green Energy & Teknologi",
  "Eco-friendly Packaging",
  "Zero Waste Store",
  "Lainnya",
];

export default function UmkmProfileComposite() {
  const router = useRouter();
  const logoInputRef = useRef(null);
  const { data: session, isLoading } = useSession();
  const { mutate: updateUmkmProfile, isPending: isUpdating } =
    useUpdateUmkmProfile();

  const [umkmData, setUmkmData] = useState({
    umkmName: "",
    umkmDescription: "",
    umkmAddress: "",
    umkmCategory: "",
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [showFileSizeDialog, setShowFileSizeDialog] = useState(false);

  useEffect(() => {
    if (session) {
      setUmkmData({
        umkmName: session.umkmName || "",
        umkmDescription: session.umkmDescription || "",
        umkmAddress: session.umkmAddress || "",
        umkmCategory: session.umkmCategory || "",
      });
      if (session.umkmLogoUrl) {
        setLogoPreview(session.umkmLogoUrl);
      }
    }
  }, [session]);

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validasi ukuran file maksimal 1MB (1 * 1024 * 1024 bytes)
      const maxSize = 1 * 1024 * 1024;
      if (file.size > maxSize) {
        setShowFileSizeDialog(true);
        e.target.value = ""; // Reset input file
        return;
      }
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {};
    if (umkmData.umkmName) data.umkmName = umkmData.umkmName;
    if (umkmData.umkmDescription)
      data.umkmDescription = umkmData.umkmDescription;
    if (umkmData.umkmAddress) data.umkmAddress = umkmData.umkmAddress;
    if (umkmData.umkmCategory) data.umkmCategory = umkmData.umkmCategory;
    if (logoFile) data.logo = logoFile;

    if (Object.keys(data).length > 0) {
      updateUmkmProfile(data, {
        onSuccess: () => {
          setLogoFile(null);
        },
      });
    }
  };

  useEffect(() => {
    if (!isLoading && (!session || session.role !== "UMKM")) {
      router.push("/");
    }
  }, [isLoading, session, router]);

  if (isUpdating) {
    return <FullscreenLoader text="Menyimpan perubahan..." />;
  }

  if (!isLoading && (!session || session.role !== "UMKM")) {
    return null;
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

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-green-800">
              Profil UMKM
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Kelola informasi bisnis UMKM Anda
            </p>
          </div>

        <Card className="border shadow-none">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Store className="w-4 h-4 sm:w-5 sm:h-5" />
              Informasi UMKM
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Perbarui informasi bisnis UMKM Anda agar lebih mudah ditemukan
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            {isLoading ? (
              <div className="space-y-5 sm:space-y-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <Skeleton className="h-16 w-16 sm:h-20 sm:w-20 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-8 sm:h-9 w-24 sm:w-28" />
                    <Skeleton className="h-3 sm:h-4 w-32 sm:w-40" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3 sm:h-4 w-20 sm:w-24" />
                  <Skeleton className="h-9 sm:h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3 sm:h-4 w-20 sm:w-24" />
                  <Skeleton className="h-9 sm:h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3 sm:h-4 w-20 sm:w-24" />
                  <Skeleton className="h-9 sm:h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3 sm:h-4 w-20 sm:w-24" />
                  <Skeleton className="h-28 sm:h-32 w-full" />
                </div>
                <Skeleton className="h-9 sm:h-10 w-32 sm:w-40" />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
                    <AvatarImage src={logoPreview || ""} alt="Logo UMKM" />
                    <AvatarFallback className="bg-green-50 border-2 border-dashed border-green-200">
                      <Store className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <input
                      type="file"
                      ref={logoInputRef}
                      onChange={handleLogoChange}
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => logoInputRef.current?.click()}
                      className="text-xs sm:text-sm"
                    >
                      <Camera className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                      Upload Logo
                    </Button>
                    <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                      JPEG, PNG, GIF, WebP. Maks 1MB
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="umkmName" className="text-xs sm:text-sm">
                    <Store className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1.5 sm:mr-2" />
                    Nama UMKM
                  </Label>
                  <Input
                    id="umkmName"
                    placeholder="Nama bisnis Anda"
                    value={umkmData.umkmName}
                    onChange={(e) =>
                      setUmkmData({ ...umkmData, umkmName: e.target.value })
                    }
                    className="border text-sm"
                  />
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="umkmCategory" className="text-xs sm:text-sm">
                    Kategori UMKM
                  </Label>
                  <Select
                    value={umkmData.umkmCategory}
                    onValueChange={(value) =>
                      setUmkmData({ ...umkmData, umkmCategory: value })
                    }
                  >
                    <SelectTrigger className="border w-full text-sm">
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {UMKM_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="umkmAddress" className="text-xs sm:text-sm">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1.5 sm:mr-2" />
                    Alamat UMKM
                  </Label>
                  <Input
                    id="umkmAddress"
                    placeholder="Alamat lengkap bisnis Anda"
                    value={umkmData.umkmAddress}
                    onChange={(e) =>
                      setUmkmData({ ...umkmData, umkmAddress: e.target.value })
                    }
                    className="border text-sm"
                  />
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label
                    htmlFor="umkmDescription"
                    className="text-xs sm:text-sm"
                  >
                    <FileText className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1.5 sm:mr-2" />
                    Deskripsi UMKM
                  </Label>
                  <Textarea
                    id="umkmDescription"
                    placeholder="Ceritakan tentang bisnis Anda, produk yang dijual, dll."
                    value={umkmData.umkmDescription}
                    onChange={(e) =>
                      setUmkmData({
                        ...umkmData,
                        umkmDescription: e.target.value,
                      })
                    }
                    className="border min-h-[100px] sm:min-h-[120px] text-sm"
                  />
                </div>

                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-sm"
                  disabled={isUpdating}
                >
                  <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                  Simpan Perubahan
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
}
