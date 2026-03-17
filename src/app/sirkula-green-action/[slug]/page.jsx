import GreenActionDetailComposite from "@/composites/sirkula-green-action/detail";

export default async function GreenActionDetailPage({ params }) {
  const { slug } = await params;
  return <GreenActionDetailComposite id={slug} />;
}
