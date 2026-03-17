import { Suspense } from "react";
import OtpVerifyComposite from "@/composites/sign-up/otp-verify";
import AuthLayout from "@/components/auth/AuthLayout";
import { Card, CardContent } from "@/components/ui/card";

export default function OTPPage() {
  return (
    <Suspense
      fallback={
        <AuthLayout>
          <div className="w-full max-w-md px-4">
            <Card className="w-full border border-gray-100 rounded-2xl">
              <CardContent className="py-10">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </AuthLayout>
      }
    >
      <OtpVerifyComposite />
    </Suspense>
  );
}
