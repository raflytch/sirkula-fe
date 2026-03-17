"use client";

import Link from "next/link";
import { User, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AuthLayout from "@/components/auth/AuthLayout";
import { BorderBeam } from "@/components/ui/border-beam";

export default function AuthSelectComposite() {
  return (
    <AuthLayout>
      <div className="px-4">
        <Card className="w-full max-w-[420px] mx-auto border shadow-none overflow-hidden relative box-border">
          <BorderBeam size={250} duration={12} delay={9} />
          <CardHeader className="text-center p-4 sm:p-6 pb-3 sm:pb-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground hover:text-foreground mb-3 sm:mb-4 w-fit"
            >
              <svg
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Kembali ke Beranda
            </Link>
            <CardTitle className="text-2xl sm:text-3xl font-bold">
              Selamat Datang
            </CardTitle>
            <CardDescription>
              Masuk ke akun Anda untuk melanjutkan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
            <p className="text-center text-sm text-muted-foreground mb-4">
              Pilih jenis akun untuk masuk
            </p>
            <Link href="/auth/user" className="block">
              <Button
                variant="outline"
                className="w-full h-16 justify-start gap-4 border hover:bg-green-50 hover:border-green-600"
              >
                <div className="p-2 rounded-lg bg-green-100">
                  <User className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Pengguna</p>
                  <p className="text-xs text-muted-foreground">
                    Masuk sebagai warga/pengguna
                  </p>
                </div>
              </Button>
            </Link>
            <Link href="/auth/umkm" className="block">
              <Button
                variant="outline"
                className="w-full h-16 justify-start gap-4 border hover:bg-green-50 hover:border-green-600"
              >
                <div className="p-2 rounded-lg bg-green-100">
                  <Store className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">UMKM</p>
                  <p className="text-xs text-muted-foreground">
                    Masuk sebagai pelaku UMKM
                  </p>
                </div>
              </Button>
            </Link>
            <div className="pt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Belum punya akun?{" "}
                <Link
                  href="/sign-up"
                  className="text-green-600 hover:underline font-medium"
                >
                  Daftar sekarang
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthLayout>
  );
}
