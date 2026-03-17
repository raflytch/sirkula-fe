"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, ArrowLeft, Building2 } from "lucide-react";
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
import AuthLayout from "@/components/auth/AuthLayout";
import { useLogin } from "@/hooks/use-auth";
import FullscreenLoader from "@/components/ui/fullscreen-loader";
import { BorderBeam } from "@/components/ui/border-beam";

export default function DinasLoginComposite() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { mutate: login, isPending } = useLogin();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (isPending) {
    return <FullscreenLoader text="Sedang masuk..." />;
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-md px-4">
        <Card className="w-full border border-gray-100 rounded-2xl overflow-hidden relative">
          <BorderBeam size={250} duration={12} delay={9} />
          <CardHeader className="text-center pb-2 pt-8 px-6 sm:px-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-5 w-fit transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Beranda
            </Link>
            <div className="flex items-center justify-center gap-2.5 mb-1">
              <div className="p-2 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100">
                <Building2 className="w-5 h-5 text-green-600" />
              </div>
              <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight">
                Portal Dinas
              </CardTitle>
            </div>
            <CardDescription className="text-base mt-1">
              Masuk untuk mengakses portal Dinas Lingkungan Hidup
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 sm:px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-5 mt-2">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Dinas
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="dinas@pemkot.go.id"
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
                    placeholder="Masukkan password"
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
              <Button
                type="submit"
                className="w-full h-11 rounded-xl text-base font-semibold bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white border-0 transition-all duration-200"
                disabled={isPending}
              >
                {isPending ? "Memproses..." : "Masuk"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-400">
                Halaman ini hanya untuk petugas Dinas Lingkungan Hidup.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthLayout>
  );
}
