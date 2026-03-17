"use client";

import Link from "next/link";
import { User, Store, ArrowLeft } from "lucide-react";
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

export default function SignUpSelectComposite() {
  return (
    <AuthLayout>
      <div className="px-4">
        {/* spacing to avoid touching viewport edges on small screens */}
        <Card className="w-full max-w-[420px] mx-auto border shadow-none overflow-hidden relative box-border">
          <BorderBeam size={250} duration={12} delay={9} />
          <CardHeader className="text-center p-4 sm:p-6 pb-3 sm:pb-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground hover:text-foreground mb-3 sm:mb-4 w-fit"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Beranda
            </Link>
            <CardTitle className="text-2xl sm:text-3xl font-bold">
              Buat Akun
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Pilih jenis akun yang ingin Anda daftarkan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0 overflow-hidden">
            <Link href="/sign-up/user" className="block">
              <Button
                variant="outline"
                className="w-full min-w-0 h-auto py-2.5 sm:py-4 px-3 sm:px-6 flex items-center justify-start gap-3 sm:gap-5 border hover:bg-green-50 hover:border-green-200"
              >
                <div className="p-1.5 sm:p-2 rounded-full bg-green-100 shrink-0">
                  <User className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
                </div>
                <div className="text-left min-w-0 flex-1">
                  <p className="font-semibold text-base sm:text-md leading-tight wrap-break-word">
                    Daftar sebagai Pengguna
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-snug mt-0.5 wrap-break-word">
                    Kelola sampah Anda
                  </p>
                </div>
              </Button>
            </Link>

            <Link href="/sign-up/umkm" className="block">
              <Button
                variant="outline"
                className="w-full min-w-0 h-auto py-2.5 sm:py-4 px-3 sm:px-6 flex items-center justify-start gap-3 sm:gap-5 border hover:bg-green-50 hover:border-green-200"
              >
                <div className="p-1.5 sm:p-2 rounded-full bg-green-100 shrink-0">
                  <Store className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
                </div>
                <div className="text-left min-w-0 flex-1">
                  <p className="font-semibold text-base sm:text-md leading-tight wrap-break-word">
                    Daftar sebagai UMKM
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-snug mt-0.5 wrap-break-word">
                    Kelola limbah bisnis
                  </p>
                </div>
              </Button>
            </Link>

            <div className="pt-3 sm:pt-4 text-center">
              <p className="text-sm sm:text-sm text-muted-foreground">
                Sudah punya akun?{" "}
                <Link
                  href="/auth"
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
