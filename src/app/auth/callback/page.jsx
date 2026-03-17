import { Suspense } from "react";
import AuthCallbackComposite from "@/composites/auth/auth-callback";
import FullscreenLoader from "@/components/ui/fullscreen-loader";

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<FullscreenLoader text="Memuat..." />}>
      <AuthCallbackComposite />
    </Suspense>
  );
}
