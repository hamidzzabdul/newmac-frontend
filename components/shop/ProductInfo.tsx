import { Product } from "@/types/product";
import QuantitySelector from "./QuantitySelector";

interface ProductInfoProps {
  product: Product;
  quantity: number;
  setQuantity: (quantity: number) => void;
  addToCart: (product: Product, quantity: number) => void;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  product,
  quantity,
  setQuantity,
  addToCart,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
      <p className="text-red-600 text-2xl font-bold">
        KSh {product.pricePerKg.toLocaleString()}
      </p>
      <p className="text-gray-600">Category: {product.category}</p>
      <div className="flex flex-col gap-1">
        <p className="text-xl font-bold">Description</p>
        <span className="text-gray-600">{product.description}</span>
      </div>
      <p
        className={`font-semibold ${
          product.stockkg > 0 ? "text-green-600" : "text-red-600"
        }`}
      >
        {product.stockkg ? "In Stock" : "Out of Stock"}
      </p>

      <QuantitySelector quantity={quantity} setQuantity={setQuantity} />

      <button
        onClick={() => addToCart(product, quantity)}
        disabled={!product.stockkg}
        className={`w-37.5 mt-3 px-6 py-2 cursor-pointer text-white font-semibold rounded-lg transition ${
          product.stockkg
            ? "bg-red-600 hover:bg-red-700"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductInfo;
