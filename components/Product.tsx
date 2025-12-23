import { dummyProducts } from "@/services/data";
import ProductItem from "./ProductItem";

function Product() {
  return (
    <div className="mt-10 p-4">
      <div className=" mx-auto flex flex-col gap-3">
        <div className="w-full flex items-center justify-center">
          <h2 className="text-3xl font-bold text-red-500">Shop Now</h2>
        </div>
        <div className="grid grid-cols-4 gap-6 mt-10 ">
          {dummyProducts.map((item) => (
            <ProductItem key={item.id} product={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Product;
