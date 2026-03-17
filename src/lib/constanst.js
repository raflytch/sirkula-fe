import {
  BarChart3,
  Trash2,
  Lightbulb,
  TrendingDown,
  AlertCircle,
  TrendingUp,
  Gift,
  Users,
  Bot,
  Target,
  Camera,
  Coins,
  Home,
  Sparkles,
} from "lucide-react";
import logo from "../../public/images/logo-sirkula.png";
import googleLogo from "../../public/images/google-logo.png";

export const images = {
  logo,
  googleLogo,
};

export const DEMO_VIDEO_URL = "https://ik.imagekit.io/72mu50jam/Sirkula.mp4";

export const navigationLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/sirkula-green-action", label: "Sirkula-AI", icon: Sparkles },
  { href: "/leaderboard", label: "Leaderboard", icon: BarChart3 },
  { href: "/reedem", label: "Tukar Poin", icon: Gift },
];

export const problems = [
  {
    icon: <BarChart3 className="w-12 h-12 text-green-600" />,
    title: "60% Sampah dari Rumah Tangga",
    description:
      "Mayoritas sampah Indonesia berasal dari aktivitas rumah tangga, namun hanya sedikit yang memilah sampah dengan benar.",
    bgColor: "bg-green-50",
  },
  {
    icon: <Trash2 className="w-12 h-12 text-gray-600" />,
    title: "30-40% Sampah Terkelola",
    description:
      "Sebagian besar sampah masih tidak terkelola dengan baik, menyebabkan pencemaran lingkungan dan beban TPA.",
    bgColor: "bg-gray-50",
  },
  {
    icon: <Lightbulb className="w-12 h-12 text-orange-600" />,
    title: "Aksi Hijau Belum Jadi Kebiasaan",
    description:
      "Banyak yang tahu harus memilah sampah, tapi merasa ribet dan tidak ada manfaat langsung.",
    bgColor: "bg-orange-50",
  },
  {
    icon: <TrendingDown className="w-12 h-12 text-pink-600" />,
    title: "Kontribusi Tidak Tercatat",
    description:
      "Aksi hijau warga dan UMKM hijau belum tercatat sebagai data dampak yang terukur.",
    bgColor: "bg-pink-50",
  },
];

export const problems2 = [
  {
    icon: <AlertCircle className="w-10 h-10 text-red-600" />,
    title: "Tidak Ada Verifikasi Aksi Hijau",
    description:
      "Warga sulit membuktikan kontribusi nyata mereka terhadap lingkungan. Aksi hijau seperti pemilahan sampah atau penanaman pohon tidak tercatat secara terverifikasi.",
    bgColor: "bg-red-50",
  },
  {
    icon: <TrendingUp className="w-10 h-10 text-blue-600" />,
    title: "Data Dampak Lingkungan Tidak Terintegrasi",
    description:
      "Kelurahan dan bank sampah kesulitan melacak dampak kolektif dari program keberlanjutan. Data tersebar dan tidak real-time.",
    bgColor: "bg-blue-50",
  },
  {
    icon: <Gift className="w-10 h-10 text-purple-600" />,
    title: "Tidak Ada Insentif untuk Aksi Hijau",
    description:
      "Warga tidak mendapat reward atau apresiasi nyata dari aksi hijau mereka, sehingga motivasi untuk konsisten berkurang.",
    bgColor: "bg-purple-50",
  },
  {
    icon: <Users className="w-10 h-10 text-orange-600" />,
    title: "UMKM Hijau Sulit Menjangkau Konsumen",
    description:
      "UMKM yang menjual produk ramah lingkungan kesulitan menemukan target market yang peduli keberlanjutan.",
    bgColor: "bg-orange-50",
  },
];

export const features = [
  {
    icon: <Bot className="w-12 h-12 text-purple-600" />,
    title: "Verifikasi AI Otomatis",
    description:
      "Upload foto atau video aksi hijau Anda.  AI kami akan memverifikasi jenis sampah, tanaman, atau aksi hijau berkelanjutan secara otomatis.",
    tags: [{ label: "Real-time", variant: "secondary" }],
    bgColor: "bg-purple-50",
  },
  {
    icon: <Target className="w-12 h-12 text-pink-600" />,
    title: "Sistem Poin & Reward",
    description:
      "Setiap aksi terverifikasi dikonversi menjadi poin.  Tukar poin dengan voucher UMKM hijau atau sumbangkan untuk impact kolektif.",
    tags: [{ label: "Voucher", variant: "secondary" }],
    bgColor: "bg-pink-50",
  },
  {
    icon: <BarChart3 className="w-12 h-12 text-green-600" />,
    title: "Dashboard Impact",
    description:
      "Lihat dampak kolektif dari aksi hijau Anda dan komunitas.  Data real-time untuk kelurahan, bank sampah, dan UMKM.",
    tags: [
      { label: "Analytics", variant: "secondary" },
      { label: "Visualisasi", variant: "secondary" },
    ],
    bgColor: "bg-green-50",
  },
];

export const steps = [
  {
    number: "01",
    icon: <Camera className="w-16 h-16 text-gray-700" />,
    title: "Lakukan Aksi Hijau",
    description:
      "Pilah sampah, tanam pohon, atau lakukan aksi hijau. Upload foto/video aksi Anda ke platform.",
  },
  {
    number: "02",
    icon: <Bot className="w-16 h-16 text-pink-600" />,
    title: "AI Verifikasi Otomatis",
    description:
      "Teknologi AI mengklasifikasi jenis sampah, tanaman, atau produk hijau dengan skor akurasi tinggi.",
  },
  {
    number: "03",
    icon: <Coins className="w-16 h-16 text-yellow-600" />,
    title: "Dapatkan Poin",
    description:
      "Aksi terverifikasi dikonversi menjadi poin.  Semakin tinggi skor AI, semakin besar poin yang Anda dapat.",
  },
  {
    number: "04",
    icon: <Gift className="w-16 h-16 text-red-600" />,
    title: "Tukar Reward",
    description: "Tukarkan poin dengan voucher UMKM ramah lingkungan.",
  },
];
