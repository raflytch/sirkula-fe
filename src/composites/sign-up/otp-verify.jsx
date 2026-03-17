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
      <Card className="w-full max-w-md border shadow-none relative overflow-hidden">
        <BorderBeam size={250} duration={12} delay={9} />
        <CardHeader className="text-center">
          <Link
            href="/sign-up"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Link>
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-green-100">
              <Mail className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Verifikasi Email</CardTitle>
          <CardDescription>
            Masukkan kode OTP yang telah dikirim ke{" "}
            <span className="font-medium text-foreground">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} className="border" />
                <InputOTPSlot index={1} className="border" />
                <InputOTPSlot index={2} className="border" />
                <InputOTPSlot index={3} className="border" />
                <InputOTPSlot index={4} className="border" />
                <InputOTPSlot index={5} className="border" />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button
            onClick={handleVerify}
            className="w-full bg-green-600 hover:bg-green-700"
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
                className="text-green-600 hover:text-green-700"
              >
                {isResending ? "Mengirim..." : "Kirim ulang kode OTP"}
              </Button>
            ) : (
              <p className="text-sm text-muted-foreground">
                Kirim ulang kode dalam{" "}
                <span className="font-medium text-foreground">{countdown}</span>{" "}
                detik
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
