import { Product } from "@/types/product";
import QuantitySelector from "./QuantitySelector";

interface ProductInfoProps {
  product: Product;
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  selectedTotalPrice: number;
  addToCart: (product: Product, quantity: number) => void;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  product,
  quantity,
  setQuantity,
  selectedTotalPrice,
  addToCart,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

      {/* Dynamic price */}
      <div className="flex flex-col">
        <p className="text-3xl font-bold text-red-600">
          KSh {selectedTotalPrice.toLocaleString()}
        </p>

        <span className="text-sm text-gray-500">
          KSh {product.pricePerKg.toLocaleString()} per kg
        </span>
      </div>

      <p className="text-gray-600 capitalize">Category: {product.category}</p>

      <div className="flex flex-col gap-1">
        <p className="text-xl font-bold">Description</p>

        <span className="text-gray-600">{product.description}</span>
      </div>

      <p
        className={`font-semibold ${
          product.stockkg > 0 ? "text-green-600" : "text-red-600"
        }`}
      >
        {product.stockkg > 0 ? "In Stock" : "Out of Stock"}
      </p>

      {/* Quantity options */}
      <div className="mt-2">
        <p className="mb-3 text-sm font-semibold text-gray-700">
          Select quantity
        </p>

        <div className="flex flex-wrap items-center gap-3">
          {[0.5, 1, 1.5].map((kg) => (
            <button
              key={kg}
              type="button"
              onClick={() => setQuantity(kg)}
              className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition ${
                quantity === kg
                  ? "border-red-600 bg-red-600 text-white"
                  : "border-gray-300 bg-white text-gray-700 hover:border-red-500 hover:text-red-600"
              }`}
            >
              {kg === 0.5 ? "½ kg" : `${kg} kg`}
            </button>
          ))}

          <div className="flex items-center gap-2 rounded-full border border-gray-300 px-3 py-2">
            <input
              type="number"
              min="0.5"
              step="0.5"
              value={quantity === 0 ? "" : quantity}
              onChange={(e) => {
                const value = e.target.value;

                // allow empty while typing
                if (value === "") {
                  setQuantity(0);
                  return;
                }

                const numericValue = Number(value);

                if (!isNaN(numericValue)) {
                  setQuantity(numericValue);
                }
              }}
              onBlur={() => {
                // prevent invalid values after leaving input
                if (quantity < 0.5) {
                  setQuantity(0.5);
                }
              }}
              className="w-20 border-none bg-transparent text-sm font-medium outline-none"
              placeholder="Custom"
            />

            <span className="text-sm text-gray-500">kg</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => addToCart(product, quantity)}
        disabled={!product.stockkg}
        className={`mt-4 w-fit rounded-lg px-6 py-3 font-semibold text-white transition ${
          product.stockkg
            ? "cursor-pointer bg-red-600 hover:bg-red-700"
            : "cursor-not-allowed bg-gray-400"
        }`}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductInfo;
