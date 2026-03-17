"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
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
import { useLogin } from "@/hooks/use-auth";
import FullscreenLoader from "@/components/ui/fullscreen-loader";
import { BorderBeam } from "@/components/ui/border-beam";
import { images } from "@/lib/constanst";

export default function UserLoginComposite() {
  const router = useRouter();
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
            href="/auth"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Link>
          <CardTitle className="text-2xl font-bold">
            Masuk sebagai Pengguna
          </CardTitle>
          <CardDescription>
            Masuk untuk melanjutkan ke akun Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="nama@email.com"
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
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={isPending}
            >
              {isPending ? "Memproses..." : "Masuk"}
            </Button>
          </form>

          <div className="my-6">
            <div className="relative">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-muted-foreground">
                atau
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full border hover:bg-gray-50 transition-colors"
            onClick={() => {
              router.push(
                `${process.env.NEXT_PUBLIC_API_URL}/users/auth/google`
              );
            }}
          >
            <Image
              src={images.googleLogo}
              alt="Google"
              width={20}
              height={20}
              className="mr-2"
            />
            Masuk dengan Google
          </Button>

          <div className="pt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Belum punya akun?{" "}
              <Link
                href="/sign-up/user"
                className="text-green-600 hover:underline font-medium"
              >
                Daftar sekarang
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
