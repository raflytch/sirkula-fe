"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import AuthLayout from "@/components/auth/AuthLayout";
import { useVerifyOtp, useResendOtp } from "@/hooks/use-auth";
import FullscreenLoader from "@/components/ui/fullscreen-loader";
import { BorderBeam } from "@/components/ui/border-beam";

export default function OtpVerifyComposite() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const { mutate: verifyOtp, isPending: isVerifying } = useVerifyOtp();
  const { mutate: resendOtp, isPending: isResending } = useResendOtp();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleVerify = () => {
    if (otp.length === 6) {
      verifyOtp({ email, code: otp });
    }
  };

  const handleResend = () => {
    resendOtp(email);
    setCountdown(60);
    setCanResend(false);
  };

  if (isVerifying || isResending) {
    return (
      <FullscreenLoader
        text={isVerifying ? "Memverifikasi OTP..." : "Mengirim ulang OTP..."}
      />
    );
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
            <div className="flex items-center justify-center mb-4">
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100">
                <Mail className="w-7 h-7 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight">
              Verifikasi Email
            </CardTitle>
            <CardDescription className="text-base mt-1">
              Masukkan kode OTP yang telah dikirim ke{" "}
              <span className="font-semibold text-foreground">{email}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 sm:px-8 pb-8 space-y-6">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="border border-gray-200 rounded-lg h-12 w-12" />
                  <InputOTPSlot index={1} className="border border-gray-200 rounded-lg h-12 w-12" />
                  <InputOTPSlot index={2} className="border border-gray-200 rounded-lg h-12 w-12" />
                  <InputOTPSlot index={3} className="border border-gray-200 rounded-lg h-12 w-12" />
                  <InputOTPSlot index={4} className="border border-gray-200 rounded-lg h-12 w-12" />
                  <InputOTPSlot index={5} className="border border-gray-200 rounded-lg h-12 w-12" />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button
              onClick={handleVerify}
              className="w-full h-11 rounded-xl text-base font-semibold bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white border-0 transition-all duration-200"
              disabled={otp.length !== 6 || isVerifying}
            >
              {isVerifying ? "Memverifikasi..." : "Verifikasi"}
            </Button>

            <div className="text-center">
              {canResend ? (
                <Button
                  variant="link"
                  onClick={handleResend}
                  disabled={isResending}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  {isResending ? "Mengirim..." : "Kirim ulang kode OTP"}
                </Button>
              ) : (
                <p className="text-sm text-gray-500">
                  Kirim ulang kode dalam{" "}
                  <span className="font-semibold text-foreground">
                    {countdown}
                  </span>{" "}
                  detik
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthLayout>
  );
}
