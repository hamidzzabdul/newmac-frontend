import QuantitySelector from "./QuantitySelector";

const ProductInfo = ({ product, quantity, setQuantity, addToCart }) => (
  <div className="flex flex-col gap-4">
    <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
    <p className="text-red-600 text-2xl font-bold">
      KSh {product.pricePerKg.toLocaleString()}
    </p>
    <p className="text-gray-600">Category: {product.category}</p>
    <p className="text-gray-600">Weight: {product.weight}</p>
    <p
      className={`font-semibold ${
        product.inStock ? "text-green-600" : "text-red-600"
      }`}
    >
      {product.inStock ? "In Stock" : "Out of Stock"}
    </p>

    <QuantitySelector quantity={quantity} setQuantity={setQuantity} />

    <button
      onClick={() => addToCart(product, quantity)}
      disabled={!product.inStock}
      className={`w-37.5 mt-3 px-6 py-2 cursor-pointer text-white font-semibold rounded-lg transition ${
        product.inStock
          ? "bg-red-600 hover:bg-red-700"
          : "bg-gray-400 cursor-not-allowed"
      }`}
    >
      Add to Cart
    </button>
  </div>
);

export default ProductInfo;
