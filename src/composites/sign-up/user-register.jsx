"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Store } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import AuthLayout from "@/components/auth/AuthLayout";
import { useRegisterUser } from "@/hooks/use-auth";
import FullscreenLoader from "@/components/ui/fullscreen-loader";
import { BorderBeam } from "@/components/ui/border-beam";
import { images } from "@/lib/constanst";

export default function UserRegisterComposite() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { mutate: register, isPending } = useRegisterUser();

  const handleSubmit = (e) => {
    e.preventDefault();
    register(formData);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
            <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight">
              Buat Akun
            </CardTitle>
            <CardDescription className="text-base mt-1">
              Daftar untuk mulai berkontribusi dalam pengelolaan sampah
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 sm:px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Nama Lengkap
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="h-11 border border-gray-200 rounded-xl px-4 focus:border-green-400 focus:ring-green-400/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="nama@email.com"
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
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                disabled={isPending}
              >
                {isPending ? "Memproses..." : "Daftar"}
              </Button>
            </form>

            <div className="my-6">
              <div className="relative">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs text-gray-400">
                  atau
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full h-11 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors font-medium"
              onClick={() => {
                window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/users/auth/google`;
              }}
            >
              <Image
                src={images.googleLogo}
                alt="Google"
                width={20}
                height={20}
                className="mr-2.5"
              />
              Daftar dengan Google
            </Button>

            <div className="mt-6 text-center space-y-3">
              <p className="text-sm text-gray-500">
                Sudah punya akun?{" "}
                <Link
                  href="/auth"
                  className="text-green-600 hover:text-green-700 font-semibold transition-colors"
                >
                  Masuk di sini
                </Link>
              </p>
              <Link
                href="/sign-up/umkm"
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 font-medium transition-colors"
              >
                <Store className="w-4 h-4" />
                Ingin daftar sebagai UMKM?
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthLayout>
  );
}
