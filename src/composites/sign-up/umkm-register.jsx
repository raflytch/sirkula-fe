"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, ArrowLeft, Store, ArrowRight } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AuthLayout from "@/components/auth/AuthLayout";
import { useRegisterUmkm } from "@/hooks/use-auth";
import FullscreenLoader from "@/components/ui/fullscreen-loader";
import { BorderBeam } from "@/components/ui/border-beam";

export default function UmkmRegisterComposite() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    umkmName: "",
    umkmDescription: "",
    umkmAddress: "",
    umkmCategory: "",
  });

  const { mutate: register, isPending } = useRegisterUmkm();

  const handleNext = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    register(formData);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value) => {
    setFormData({ ...formData, umkmCategory: value });
  };

  if (isPending) {
    return <FullscreenLoader text="Sedang mendaftar..." />;
  }

  return (
    <AuthLayout>
      <div className="px-4">
        <Card className="w-full max-w-[420px] mx-auto border shadow-none overflow-hidden relative box-border">
          <BorderBeam size={250} duration={12} delay={9} />
          <CardHeader className="text-center p-4 sm:p-6 pb-3 sm:pb-4">
            <Link
              href="/sign-up"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-3 sm:mb-4 w-fit"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </Link>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Store className="w-6 h-6 text-green-600" />
              <CardTitle className="text-2xl font-bold">Daftar UMKM</CardTitle>
            </div>
            <CardDescription>
              {step === 1 ? "Informasi Akun" : "Informasi Bisnis"} - Step {step}{" "}
              of 2
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            {step === 1 ? (
              <form onSubmit={handleNext} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Pemilik</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Nama lengkap pemilik"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Bisnis</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="bisnis@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimal 8 karakter"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="border pr-10"
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
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Ulangi password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="border pr-10"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Lanjut ke Step 2
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="umkmName">Nama Bisnis/Usaha</Label>
                  <Input
                    id="umkmName"
                    name="umkmName"
                    type="text"
                    placeholder="Nama toko/usaha Anda"
                    value={formData.umkmName}
                    onChange={handleChange}
                    required
                    className="border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="umkmCategory">Kategori Usaha</Label>
                  <Select
                    value={formData.umkmCategory}
                    onValueChange={handleSelectChange}
                  >
                    <SelectTrigger className="border w-full">
                      <SelectValue placeholder="Pilih kategori usaha" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Daur Ulang Sampah">
                        Daur Ulang Sampah
                      </SelectItem>
                      <SelectItem value="Produk Ramah Lingkungan">
                        Produk Ramah Lingkungan
                      </SelectItem>
                      <SelectItem value="Makanan & Minuman Organik">
                        Makanan & Minuman Organik
                      </SelectItem>
                      <SelectItem value="Kerajinan dari Bahan Daur Ulang">
                        Kerajinan dari Bahan Daur Ulang
                      </SelectItem>
                      <SelectItem value="Fashion Berkelanjutan">
                        Fashion Berkelanjutan
                      </SelectItem>
                      <SelectItem value="Bank Sampah">Bank Sampah</SelectItem>
                      <SelectItem value="Kompos & Pupuk Organik">
                        Kompos & Pupuk Organik
                      </SelectItem>
                      <SelectItem value="Green Energy & Teknologi">
                        Green Energy & Teknologi
                      </SelectItem>
                      <SelectItem value="Eco-friendly Packaging">
                        Eco-friendly Packaging
                      </SelectItem>
                      <SelectItem value="Zero Waste Store">
                        Zero Waste Store
                      </SelectItem>
                      <SelectItem value="Lainnya">Lainnya</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="umkmDescription">Deskripsi Usaha</Label>
                  <Input
                    id="umkmDescription"
                    name="umkmDescription"
                    type="text"
                    placeholder="Deskripsi singkat usaha Anda"
                    value={formData.umkmDescription}
                    onChange={handleChange}
                    required
                    className="border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="umkmAddress">Alamat Usaha</Label>
                  <Input
                    id="umkmAddress"
                    name="umkmAddress"
                    type="text"
                    placeholder="Alamat lengkap usaha"
                    value={formData.umkmAddress}
                    onChange={handleChange}
                    required
                    className="border"
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="flex-1"
                  >
                    Kembali
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    disabled={isPending}
                  >
                    {isPending ? "Memproses..." : "Daftar UMKM"}
                  </Button>
                </div>
              </form>
            )}

            <div className="pt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Sudah punya akun UMKM?{" "}
                <Link
                  href="/auth/umkm"
                  className="text-green-600 hover:underline font-medium"
                >
                  Masuk di sini
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthLayout>
  );
}
