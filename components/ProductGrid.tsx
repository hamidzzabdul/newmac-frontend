import { Product } from "@/types/product";
import ProductItem from "./ProductItem";
interface ProductProps {
  products: Product[];
}

const ProductsGrid = ({ products }: ProductProps) => {
  //   if (!products.length) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8">
      {products?.map((item) => (
        <ProductItem key={item._id} product={item} />
      ))}
    </div>
  );
};

export default ProductsGrid;
