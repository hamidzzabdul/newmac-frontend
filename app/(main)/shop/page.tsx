import { getAllProducts } from "@/lib/api/products";
import ShopClient from "./ShopClient";

export default async function ShopPage() {
  const data = await getAllProducts();

  return <ShopClient products={data.docs} />;
}
