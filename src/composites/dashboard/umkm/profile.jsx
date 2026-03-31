"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Store,
  MapPin,
  FileText,
  Camera,
  Save,
  Pencil,
  Tag,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useFileValidation,
  FileSizeAlertDialog,
} from "@/hooks/use-file-validation";
import { useSession, useUpdateUmkmProfile } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-mobile";
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

function EditForm({
  umkmData,
  setUmkmData,
  logoPreview,
  onLogoChange,
  logoInputRef,
  categories,
}) {
  return (
    <div className="space-y-4">
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
            onChange={onLogoChange}
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
          <Tag className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1.5 sm:mr-2" />
          Kategori UMKM
        </Label>
        <Select
          value={umkmData.umkmCategory || undefined}
          onValueChange={(value) =>
            setUmkmData({ ...umkmData, umkmCategory: value })
          }
        >
          <SelectTrigger className="border w-full text-sm">
            <SelectValue placeholder="Pilih kategori" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
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
        <Label htmlFor="umkmDescription" className="text-xs sm:text-sm">
          <FileText className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1.5 sm:mr-2" />
          Deskripsi UMKM
        </Label>
        <Textarea
          id="umkmDescription"
          placeholder="Ceritakan tentang bisnis Anda, produk yang dijual, dll."
          value={umkmData.umkmDescription}
          onChange={(e) =>
            setUmkmData({ ...umkmData, umkmDescription: e.target.value })
          }
          className="border min-h-[100px] sm:min-h-[120px] text-sm"
        />
      </div>
    </div>
  );
}

export default function UmkmProfileComposite() {
  const router = useRouter();
  const logoInputRef = useRef(null);
  const isMobile = useIsMobile();
  const { data: session, isLoading } = useSession();
  const { mutate: updateUmkmProfile, isPending: isUpdating } =
    useUpdateUmkmProfile();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [umkmData, setUmkmData] = useState({
    umkmName: "",
    umkmDescription: "",
    umkmAddress: "",
    umkmCategory: "",
  });
  const { validateFile, showFileSizeDialog, setShowFileSizeDialog } =
    useFileValidation();
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

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

  const handleOpenEdit = () => {
    if (session) {
      setUmkmData({
        umkmName: session.umkmName || "",
        umkmDescription: session.umkmDescription || "",
        umkmAddress: session.umkmAddress || "",
        umkmCategory: session.umkmCategory || "",
      });
      setLogoPreview(session.umkmLogoUrl || null);
      setLogoFile(null);
    }
    setIsEditOpen(true);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!validateFile(file)) {
        e.target.value = "";
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

  const handleSubmit = () => {
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
          setIsEditOpen(false);
        },
      });
    }
  };

  const categories = [
    ...new Set([
      ...UMKM_CATEGORIES,
      ...(umkmData.umkmCategory &&
      !UMKM_CATEGORIES.includes(umkmData.umkmCategory)
        ? [umkmData.umkmCategory]
        : []),
    ]),
  ];

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

  const editFormContent = (
    <EditForm
      umkmData={umkmData}
      setUmkmData={setUmkmData}
      logoPreview={logoPreview}
      onLogoChange={handleLogoChange}
      logoInputRef={logoInputRef}
      categories={categories}
    />
  );

  return (
    <>
      <FileSizeAlertDialog
        open={showFileSizeDialog}
        onOpenChange={setShowFileSizeDialog}
      />

      {isMobile ? (
        <Drawer open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Edit Profil UMKM</DrawerTitle>
              <DrawerDescription>
                Perbarui informasi bisnis UMKM Anda
              </DrawerDescription>
            </DrawerHeader>
            <div className="px-4 overflow-y-auto max-h-[60vh]">
              {editFormContent}
            </div>
            <DrawerFooter>
              <Button
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-700 text-sm w-full"
                disabled={isUpdating}
              >
                <Save className="w-4 h-4 mr-2" />
                Simpan Perubahan
              </Button>
              <DrawerClose asChild>
                <Button variant="outline" className="w-full">
                  Batal
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Profil UMKM</DialogTitle>
              <DialogDescription>
                Perbarui informasi bisnis UMKM Anda
              </DialogDescription>
            </DialogHeader>
            {editFormContent}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Batal
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-700 text-sm"
                disabled={isUpdating}
              >
                <Save className="w-4 h-4 mr-2" />
                Simpan Perubahan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

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
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Store className="w-4 h-4 sm:w-5 sm:h-5" />
                    Informasi UMKM
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm mt-1">
                    Informasi bisnis UMKM Anda
                  </CardDescription>
                </div>
                {!isLoading && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleOpenEdit}
                    className="text-xs sm:text-sm"
                  >
                    <Pencil className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" />
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              {isLoading ? (
                <div className="space-y-5 sm:space-y-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <Skeleton className="h-16 w-16 sm:h-20 sm:w-20 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-32 sm:w-40" />
                      <Skeleton className="h-3 sm:h-4 w-24 sm:w-32" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                </div>
              ) : (
                <div className="space-y-5 sm:space-y-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
                      <AvatarImage
                        src={session?.umkmLogoUrl || ""}
                        alt="Logo UMKM"
                      />
                      <AvatarFallback className="bg-green-50 border-2 border-dashed border-green-200">
                        <Store className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-base sm:text-lg">
                        {session?.umkmName || "-"}
                      </h3>
                      <span className="inline-block mt-1 text-xs sm:text-sm bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                        {session?.umkmCategory || "-"}
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div className="space-y-1">
                      <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                        Alamat
                      </p>
                      <p className="text-sm sm:text-base">
                        {session?.umkmAddress || "-"}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5">
                        <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                        Deskripsi
                      </p>
                      <p className="text-sm sm:text-base whitespace-pre-wrap">
                        {session?.umkmDescription || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
