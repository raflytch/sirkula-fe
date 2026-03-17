import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/providers/redux-provider";
import { QueryProvider } from "@/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";
import ClientLayout from "@/components/layout/ClientLayout";

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "Sirkula - Platform Green Action Berbasis AI",
  description:
    "Platform digital berbasis AI untuk melakukan green action seperti pemilahan sampah, penanaman pohon, dan aksi ramah lingkungan lainnya. Dapatkan poin dan tukarkan dengan voucher menarik!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${jakartaSans.variable} font-sans antialiased`}>
        <ReduxProvider>
          <QueryProvider>
            <ClientLayout>{children}</ClientLayout>
            <Toaster />
          </QueryProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
