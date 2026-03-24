"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Mail,
  Calendar,
  Award,
  Trash2,
  Camera,
  ArrowLeft,
  Eye,
  EyeOff,
  ShieldCheck,
  KeyRound,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
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
  useFileValidation,
  FileSizeAlertDialog,
} from "@/hooks/use-file-validation";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { SparklesText } from "@/components/ui/sparkles-text";
import { AuroraText } from "@/components/ui/aurora-text";
import {
  useSession,
  useUpdateProfile,
  useRequestDeleteAccount,
  useConfirmDeleteAccount,
} from "@/hooks/use-auth";
import FullscreenLoader from "@/components/ui/fullscreen-loader";

function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50/40 via-white to-teal-50/30">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Skeleton className="h-5 w-40 mb-6" />
        <Skeleton className="h-10 w-52 mb-8" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1 space-y-4">
            <div className="rounded-2xl border border-emerald-100/60 bg-white/80 overflow-hidden">
              <Skeleton className="h-20 w-full" />
              <div className="flex flex-col items-center px-6 pb-6 -mt-10">
                <Skeleton className="h-20 w-20 rounded-full mb-4" />
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-40 mb-3" />
                <Skeleton className="h-6 w-16 rounded-full" />
                <Separator className="my-4" />
                <div className="w-full space-y-3">
                  <Skeleton className="h-9 w-full rounded-lg" />
                  <Skeleton className="h-9 w-full rounded-lg" />
                  <Skeleton className="h-9 w-full rounded-lg" />
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-zinc-100 bg-white/80 p-6">
              <Skeleton className="h-6 w-40 mb-2" />
              <Skeleton className="h-4 w-64 mb-6" />
              <Skeleton className="h-10 w-full mb-6" />
              <div className="space-y-4">
                <Skeleton className="h-14 w-14 rounded-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-36" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfileComposite() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const { data: session, isLoading } = useSession();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();
  const { mutate: requestDelete, isPending: isRequestingDelete } =
    useRequestDeleteAccount();
  const { mutate: confirmDelete, isPending: isConfirmingDelete } =
    useConfirmDeleteAccount();

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    currentPassword: "",
    newPassword: "",
  });
  const { validateFile, showFileSizeDialog, setShowFileSizeDialog } =
    useFileValidation();
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteStep, setDeleteStep] = useState(1);
  const [deleteOtp, setDeleteOtp] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString) => {
    if (!mounted) return "";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!validateFile(file)) {
        e.target.value = "";
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    const data = {};
    if (profileData.name && profileData.name !== session?.name) {
      data.name = profileData.name;
    }
    if (profileData.currentPassword && profileData.newPassword) {
      data.currentPassword = profileData.currentPassword;
      data.newPassword = profileData.newPassword;
    }
    if (avatarFile) {
      data.avatar = avatarFile;
    }
    if (Object.keys(data).length > 0) {
      updateProfile(data);
    }
  };

  const handleDeleteRequest = () => {
    requestDelete(undefined, {
      onSuccess: () => {
        setDeleteStep(2);
      },
    });
  };

  const handleDeleteConfirm = () => {
    if (deleteOtp.length === 6) {
      confirmDelete(deleteOtp);
    }
  };

  useEffect(() => {
    if (!isLoading && !session) {
      router.push("/auth");
    }
  }, [isLoading, session, router]);

  if (isLoading || !mounted) {
    return <ProfileSkeleton />;
  }

  if (isUpdating || isRequestingDelete || isConfirmingDelete) {
    return (
      <FullscreenLoader
        text={
          isUpdating
            ? "Menyimpan perubahan..."
            : isRequestingDelete
            ? "Memproses permintaan..."
            : "Menghapus akun..."
        }
      />
    );
  }

  if (!session) {
    return null;
  }

  return (
    <>
      <FileSizeAlertDialog
        open={showFileSizeDialog}
        onOpenChange={setShowFileSizeDialog}
      />

      <div className="min-h-screen">
        <div className="container mx-auto max-w-4xl px-4 py-6 sm:py-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-emerald-700 transition-colors mb-4 sm:mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Link>

          <div className="flex items-center gap-2 mb-6 sm:mb-8">
            <Sparkles className="h-6 w-6 sm:h-7 sm:w-7 text-emerald-600" />
            <SparklesText
              colors={{ first: "#10b981", second: "#14b8a6" }}
              sparklesCount={8}
              className="text-xl sm:text-2xl font-bold"
            >
              <AuroraText
                colors={["#10b981", "#14b8a6", "#0ea5e9", "#10b981"]}
                className="text-xl sm:text-2xl font-bold"
                speed={1.5}
              >
                Profil Saya
              </AuroraText>
            </SparklesText>
          </div>

          <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1 space-y-4">
              <Card className="border border-emerald-100/60 bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden p-0">
                <div className="h-20 bg-linear-to-r from-emerald-400/20 via-teal-300/20 to-emerald-500/20" />
                <CardContent className="-mt-10 px-5 pb-5 pt-0">
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-20 w-20 ring-4 ring-white">
                      <AvatarImage src={session.avatarUrl} alt={session.name} />
                      <AvatarFallback className="bg-linear-to-br from-emerald-100 to-teal-100 text-emerald-700 text-lg font-semibold">
                        {getInitials(session.name)}
                      </AvatarFallback>
                    </Avatar>
                    <h2 className="text-base sm:text-lg font-semibold text-zinc-900 mt-3 leading-tight">
                      {session.name}
                    </h2>
                    <p
                      className="text-[11px] sm:text-xs text-zinc-500 truncate max-w-full px-1 mt-0.5"
                      title={session.email}
                    >
                      {session.email}
                    </p>
                    <Badge className="mt-2 bg-linear-to-r from-emerald-50 to-teal-50 text-emerald-700 hover:from-emerald-100 hover:to-teal-100 border border-emerald-200/50 font-medium text-[10px] sm:text-xs">
                      <Sparkles className="w-3 h-3 mr-1" />
                      {session.role}
                    </Badge>
                    <Separator className="my-4" />
                    <div className="w-full space-y-2.5">
                      <div className="flex items-center gap-2.5 text-[11px] sm:text-xs p-2 rounded-lg bg-amber-50/60">
                        <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span className="text-zinc-700 font-medium">
                          {session.totalPoints} Poin
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5 text-[11px] sm:text-xs p-2 rounded-lg bg-zinc-50/60">
                        <Calendar className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <span
                          className="text-zinc-600 truncate"
                          title={`Bergabung ${formatDate(session.createdAt)}`}
                        >
                          {formatDate(session.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5 text-[11px] sm:text-xs p-2 rounded-lg bg-emerald-50/40">
                        <Mail className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span
                          className={
                            session.isEmailVerified
                              ? "text-emerald-600 font-medium"
                              : "text-amber-600 font-medium"
                          }
                        >
                          {session.isEmailVerified
                            ? "Terverifikasi"
                            : "Belum Verifikasi"}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border border-zinc-100 bg-white/80 backdrop-blur-sm rounded-2xl lg:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg text-zinc-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Pengaturan Akun
                </CardTitle>
                <CardDescription className="text-[11px] sm:text-xs text-zinc-500">
                  Kelola informasi profil dan keamanan akun Anda
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="profile" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4 bg-zinc-100/70 rounded-xl p-1">
                    <TabsTrigger
                      value="profile"
                      className="text-[11px] sm:text-xs rounded-lg data-[state=active]:bg-white data-[state=active]:text-emerald-700"
                    >
                      <User className="w-3.5 h-3.5 mr-1.5" />
                      Profil
                    </TabsTrigger>
                    <TabsTrigger
                      value="security"
                      className="text-[11px] sm:text-xs rounded-lg data-[state=active]:bg-white data-[state=active]:text-emerald-700"
                    >
                      <KeyRound className="w-3.5 h-3.5 mr-1.5" />
                      Keamanan
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="profile" className="space-y-4">
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                      <div className="flex flex-col sm:flex-row items-center gap-3 p-3 rounded-xl bg-zinc-50/60 border border-zinc-100">
                        <Avatar className="h-12 w-12 sm:h-14 sm:w-14 ring-2 ring-emerald-100">
                          <AvatarImage
                            src={avatarPreview || session.avatarUrl}
                            alt={session.name}
                          />
                          <AvatarFallback className="bg-linear-to-br from-emerald-100 to-teal-100 text-emerald-700 text-sm">
                            {getInitials(session.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-center sm:text-left">
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleAvatarChange}
                            accept="image/jpeg,image/png,image/gif,image/webp"
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Camera className="w-3.5 h-3.5 mr-1.5" />
                            Ganti Foto
                          </Button>
                          <p className="text-[10px] text-muted-foreground mt-1">
                            JPEG, PNG, GIF, WebP. Maks 1MB
                          </p>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="name"
                          className="text-[11px] sm:text-xs text-zinc-700"
                        >
                          Nama Lengkap
                        </Label>
                        <Input
                          id="name"
                          placeholder={session.name}
                          value={profileData.name}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              name: e.target.value,
                            })
                          }
                          className="border border-zinc-200 text-xs h-9 rounded-lg focus-visible:ring-emerald-500/30"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="email"
                          className="text-[11px] sm:text-xs text-zinc-700"
                        >
                          Email
                        </Label>
                        <Input
                          id="email"
                          value={session.email}
                          disabled
                          className="border bg-zinc-50 text-xs h-9 rounded-lg"
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-xs h-9 rounded-lg"
                        disabled={isUpdating}
                      >
                        {isUpdating ? "Menyimpan..." : "Simpan Perubahan"}
                      </Button>
                    </form>
                  </TabsContent>
                  <TabsContent value="security" className="space-y-4">
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="currentPassword"
                          className="text-[11px] sm:text-xs text-zinc-700"
                        >
                          Password Saat Ini
                        </Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            type={showPassword ? "text" : "password"}
                            placeholder="Masukkan password saat ini"
                            value={profileData.currentPassword}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                currentPassword: e.target.value,
                              })
                            }
                            className="border border-zinc-200 pr-10 text-xs h-9 rounded-lg focus-visible:ring-emerald-500/30"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="newPassword"
                          className="text-[11px] sm:text-xs text-zinc-700"
                        >
                          Password Baru
                        </Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            placeholder="Minimal 8 karakter"
                            value={profileData.newPassword}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                newPassword: e.target.value,
                              })
                            }
                            className="border border-zinc-200 pr-10 text-xs h-9 rounded-lg focus-visible:ring-emerald-500/30"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showNewPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      <Button
                        type="submit"
                        className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-xs h-9 rounded-lg"
                        disabled={
                          isUpdating ||
                          !profileData.currentPassword ||
                          !profileData.newPassword
                        }
                      >
                        {isUpdating ? "Menyimpan..." : "Ubah Password"}
                      </Button>
                    </form>

                    <Separator className="my-5" />

                    <div className="p-3 rounded-xl border border-red-100 bg-red-50/30 space-y-3">
                      <h3 className="text-sm sm:text-base font-medium text-red-600">
                        Zona Berbahaya
                      </h3>
                      <p className="text-[11px] sm:text-xs text-muted-foreground">
                        Setelah Anda menghapus akun, tidak ada jalan kembali.
                        Harap pastikan.
                      </p>
                      <Dialog
                        open={deleteDialogOpen}
                        onOpenChange={setDeleteDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="destructive"
                            className="w-full sm:w-auto text-xs h-9 rounded-lg"
                          >
                            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                            Hapus Akun
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-[90vw] sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle className="text-sm sm:text-base">
                              {deleteStep === 1
                                ? "Konfirmasi Hapus Akun"
                                : "Verifikasi OTP"}
                            </DialogTitle>
                            <DialogDescription className="text-[11px] sm:text-xs">
                              {deleteStep === 1
                                ? "Tindakan ini tidak dapat dibatalkan. Akun Anda akan dihapus secara permanen."
                                : "Masukkan kode OTP yang telah dikirim ke email Anda."}
                            </DialogDescription>
                          </DialogHeader>
                          {deleteStep === 1 ? (
                            <DialogFooter className="flex-col sm:flex-row gap-2">
                              <Button
                                variant="outline"
                                onClick={() => setDeleteDialogOpen(false)}
                                className="w-full sm:w-auto"
                              >
                                Batal
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={handleDeleteRequest}
                                disabled={isRequestingDelete}
                                className="w-full sm:w-auto"
                              >
                                {isRequestingDelete
                                  ? "Memproses..."
                                  : "Lanjutkan"}
                              </Button>
                            </DialogFooter>
                          ) : (
                            <div className="space-y-4">
                              <div className="flex justify-center">
                                <InputOTP
                                  maxLength={6}
                                  value={deleteOtp}
                                  onChange={setDeleteOtp}
                                >
                                  <InputOTPGroup>
                                    <InputOTPSlot
                                      index={0}
                                      className="border h-10 w-10 sm:h-12 sm:w-12"
                                    />
                                    <InputOTPSlot
                                      index={1}
                                      className="border h-10 w-10 sm:h-12 sm:w-12"
                                    />
                                    <InputOTPSlot
                                      index={2}
                                      className="border h-10 w-10 sm:h-12 sm:w-12"
                                    />
                                    <InputOTPSlot
                                      index={3}
                                      className="border h-10 w-10 sm:h-12 sm:w-12"
                                    />
                                    <InputOTPSlot
                                      index={4}
                                      className="border h-10 w-10 sm:h-12 sm:w-12"
                                    />
                                    <InputOTPSlot
                                      index={5}
                                      className="border h-10 w-10 sm:h-12 sm:w-12"
                                    />
                                  </InputOTPGroup>
                                </InputOTP>
                              </div>
                              <DialogFooter className="flex-col sm:flex-row gap-2">
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setDeleteStep(1);
                                    setDeleteOtp("");
                                    setDeleteDialogOpen(false);
                                  }}
                                  className="w-full sm:w-auto"
                                >
                                  Batal
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={handleDeleteConfirm}
                                  disabled={
                                    isConfirmingDelete || deleteOtp.length !== 6
                                  }
                                  className="w-full sm:w-auto"
                                >
                                  {isConfirmingDelete
                                    ? "Menghapus..."
                                    : "Hapus Akun"}
                                </Button>
                              </DialogFooter>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
