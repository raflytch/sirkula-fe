import VoucherDetailComposite from "@/composites/redeem/detail";

export const metadata = {
  title: "Detail Voucher | Sirkula",
  description: "Detail dan penukaran voucher",
};

export default async function VoucherDetailPage({ params }) {
  const { slug } = await params;
  return <VoucherDetailComposite slug={slug} />;
}
