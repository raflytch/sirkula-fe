"use client";

import { usePathname } from "next/navigation";
import { Navbar01 } from "@/components/ui/shadcn-io/navbar-01";
import { AppSidebar } from "@/components/layout/AppSidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export default function ClientLayout({ children }) {
  const pathname = usePathname();

  const hideNavbar =
    pathname.startsWith("/auth") || pathname.startsWith("/sign-up");

  const isDashboard = pathname.startsWith("/dashboard");

  if (isDashboard) {
    return (
      <SidebarProvider defaultOpen={false}>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <SidebarInset className="flex-1">
            <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-white px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <span className="text-sm font-medium text-muted-foreground">
                Dashboard
              </span>
            </header>
            <main className="bg-zinc-50">{children}</main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#f5faf7] relative overflow-x-hidden">
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 80% 60% at 10% 90%, rgba(110, 231, 183, 0.25), transparent 50%),
            radial-gradient(ellipse 60% 50% at 85% 20%, rgba(56, 189, 248, 0.15), transparent 50%),
            radial-gradient(ellipse 50% 40% at 50% 50%, rgba(167, 243, 208, 0.2), transparent 50%),
            radial-gradient(ellipse 40% 50% at 20% 30%, rgba(196, 181, 253, 0.12), transparent 50%),
            radial-gradient(ellipse 45% 35% at 75% 75%, rgba(253, 230, 138, 0.1), transparent 50%)`,
        }}
      />
      <div className="relative z-10">
        {!hideNavbar && <Navbar01 />}
        <div className={!hideNavbar ? "pt-14" : ""}>{children}</div>
      </div>
    </div>
  );
}
