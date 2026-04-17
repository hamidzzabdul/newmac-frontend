import ShopClient from "./ShopClient";
import { getAllProducts } from "@/lib/api/products";

interface ShopPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    page?: string;
    inStock?: string;
    sort?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;

  const search = params.search || "";
  const category = params.category || "All";
  const parsedPage = Number(params.page);
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const sort = params.sort || "default";
  const inStock = params.inStock === "true";

  const { docs, totalPages, total } = await getAllProducts({
    search,
    category: category === "All" ? "" : category,
    page,
    limit: 12,
    sort,
    inStock,
  });

  return (
    <ShopClient
      products={docs}
      totalPages={totalPages}
      totalResults={total}
      initialSearch={search}
      initialCategory={category}
      initialSort={sort}
      initialInStock={inStock}
      initialPage={page}
    />
  );
}
