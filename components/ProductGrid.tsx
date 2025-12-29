import ProductItem from "./ProductItem";
import { dummyProducts } from "@/services/data";
const ProductsGrid = () => {
  //   if (!products.length) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8">
      {dummyProducts.map((product) => (
        <ProductItem key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductsGrid;
