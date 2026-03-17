import { Suspense } from "react";
import OtpVerifyComposite from "@/composites/sign-up/otp-verify";
import AuthLayout from "@/components/auth/AuthLayout";
import { Card, CardContent } from "@/components/ui/card";

export default function OTPPage() {
  return (
    <Suspense
      fallback={
        <AuthLayout>
          <Card className="w-full max-w-md border shadow-none">
            <CardContent className="py-8">
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
              </div>
            </CardContent>
          </Card>
        </AuthLayout>
      }
    >
      <OtpVerifyComposite />
    </Suspense>
  );
}
