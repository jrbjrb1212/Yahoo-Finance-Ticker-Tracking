import StockResearch from "@/components/Stock-Research/StockResearch";

export default async function StockDetails({
  params,
}: {
  params: { stock: string };
}) {
  const { stock } = await params;

  return (
    <>
      <StockResearch stockSymbol={stock} />
    </>
  );
}
