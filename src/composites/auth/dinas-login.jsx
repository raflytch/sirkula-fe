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
      <Card className="w-full max-w-md border shadow-none relative overflow-hidden">
        <BorderBeam size={250} duration={12} delay={9} />
        <CardHeader className="text-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Building2 className="w-6 h-6 text-blue-600" />
            <CardTitle className="text-2xl font-bold">Portal Dinas</CardTitle>
          </div>
          <CardDescription>
            Masuk untuk mengakses portal Dinas Lingkungan Hidup
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Dinas</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="dinas@pemkot.go.id"
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
                  placeholder="Masukkan password"
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
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isPending}
            >
              {isPending ? "Memproses..." : "Masuk"}
            </Button>
          </form>

          <div className="pt-6 text-center">
            <p className="text-xs text-muted-foreground">
              Halaman ini hanya untuk petugas Dinas Lingkungan Hidup.
            </p>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
