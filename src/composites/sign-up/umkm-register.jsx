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
      <div className="w-full max-w-md px-4">
        <Card className="w-full border border-gray-100 rounded-2xl overflow-hidden relative">
          <BorderBeam size={250} duration={12} delay={9} />
          <CardHeader className="text-center pb-2 pt-8 px-6 sm:px-8">
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-5 w-fit transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </Link>
            <div className="flex items-center justify-center gap-2.5 mb-1">
              <div className="p-2 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100">
                <Store className="w-5 h-5 text-green-600" />
              </div>
              <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight">
                Daftar UMKM
              </CardTitle>
            </div>
            <CardDescription className="text-base mt-1">
              {step === 1 ? "Informasi Akun" : "Informasi Bisnis"} — Langkah{" "}
              {step} dari 2
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 sm:px-8 pb-8">
            {step === 1 ? (
              <form onSubmit={handleNext} className="space-y-4 mt-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Nama Pemilik
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Nama lengkap pemilik"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="h-11 border border-gray-200 rounded-xl px-4 focus:border-green-400 focus:ring-green-400/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Bisnis
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="bisnis@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="h-11 border border-gray-200 rounded-xl px-4 focus:border-green-400 focus:ring-green-400/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimal 8 karakter"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="h-11 border border-gray-200 rounded-xl px-4 pr-11 focus:border-green-400 focus:ring-green-400/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4.5 h-4.5" />
                      ) : (
                        <Eye className="w-4.5 h-4.5" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">
                    Konfirmasi Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Ulangi password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="h-11 border border-gray-200 rounded-xl px-4 pr-11 focus:border-green-400 focus:ring-green-400/20"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4.5 h-4.5" />
                      ) : (
                        <Eye className="w-4.5 h-4.5" />
                      )}
                    </button>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full h-11 rounded-xl text-base font-semibold bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white border-0 transition-all duration-200"
                >
                  Lanjut ke Langkah 2
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                <div className="space-y-2">
                  <Label htmlFor="umkmName" className="text-sm font-medium">
                    Nama Bisnis/Usaha
                  </Label>
                  <Input
                    id="umkmName"
                    name="umkmName"
                    type="text"
                    placeholder="Nama toko/usaha Anda"
                    value={formData.umkmName}
                    onChange={handleChange}
                    required
                    className="h-11 border border-gray-200 rounded-xl px-4 focus:border-green-400 focus:ring-green-400/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="umkmCategory" className="text-sm font-medium">
                    Kategori Usaha
                  </Label>
                  <Select
                    value={formData.umkmCategory}
                    onValueChange={handleSelectChange}
                  >
                    <SelectTrigger className="h-11 border border-gray-200 rounded-xl px-4 w-full">
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
                  <Label htmlFor="umkmDescription" className="text-sm font-medium">
                    Deskripsi Usaha
                  </Label>
                  <Input
                    id="umkmDescription"
                    name="umkmDescription"
                    type="text"
                    placeholder="Deskripsi singkat usaha Anda"
                    value={formData.umkmDescription}
                    onChange={handleChange}
                    required
                    className="h-11 border border-gray-200 rounded-xl px-4 focus:border-green-400 focus:ring-green-400/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="umkmAddress" className="text-sm font-medium">
                    Alamat Usaha
                  </Label>
                  <Input
                    id="umkmAddress"
                    name="umkmAddress"
                    type="text"
                    placeholder="Alamat lengkap usaha"
                    value={formData.umkmAddress}
                    onChange={handleChange}
                    required
                    className="h-11 border border-gray-200 rounded-xl px-4 focus:border-green-400 focus:ring-green-400/20"
                  />
                </div>
                <div className="flex gap-3 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="flex-1 h-11 rounded-xl border border-gray-200 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Kembali
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 h-11 rounded-xl text-base font-semibold bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white border-0 transition-all duration-200"
                    disabled={isPending}
                  >
                    {isPending ? "Memproses..." : "Daftar UMKM"}
                  </Button>
                </div>
              </form>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Sudah punya akun UMKM?{" "}
                <Link
                  href="/auth/umkm"
                  className="text-green-600 hover:text-green-700 font-semibold transition-colors"
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
