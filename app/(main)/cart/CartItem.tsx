import { Plus, Minus, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "../../store/features/CartSlice";
import { useState } from "react";

interface ProductProps {
  category: string;
  id: string;
  name: string;
  image: string;
  pricePerKg: number;
  quantityKg: number;
}

function CartItem({ product }: { product: ProductProps }) {
  const dispatch = useDispatch();
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  const handleCartIncrease = () => {
    dispatch(
      updateQuantity({ id: product.id, quantity: product.quantityKg + 0.5 }),
    );
  };

  const handleCartDecrease = () => {
    if (product.quantityKg > 0.5) {
      dispatch(
        updateQuantity({ id: product.id, quantity: product.quantityKg - 0.5 }),
      );
    }
  };

  const confirmRemove = () => {
    dispatch(removeFromCart(product.id));
    setShowRemoveModal(false);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-4 flex items-center gap-4">
        <div className="w-24 h-24 md:w-28 md:h-28 shrink-0 rounded-lg overflow-hidden bg-gray-100">
          <Image
            src={product.image}
            alt={product.name}
            unoptimized
            width={100}
            height={100}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-800 text-lg mb-1">
              {product.name}
            </h3>

            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span className="px-2 py-1 bg-yellow-100 rounded">
                {product.category}
              </span>
            </div>

            <p className="text-sm text-gray-600 mt-2">
              KSh {product.pricePerKg.toLocaleString()} per kg
            </p>
          </div>

          <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
            <button
              onClick={handleCartDecrease}
              disabled={product.quantityKg <= 0.5}
              className="w-9 h-9 flex items-center justify-center bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:border-red-300 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Minus size={16} className="text-gray-600" />
            </button>

            <span className="w-12 text-center font-bold text-gray-800">
              {product.quantityKg}kg
            </span>

            <button
              onClick={handleCartIncrease}
              className="w-9 h-9 flex items-center justify-center bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:border-red-300 transition"
            >
              <Plus size={16} className="text-gray-600" />
            </button>
          </div>

          <div className="flex items-center justify-between md:flex-col md:items-end gap-3">
            <span className="text-xl font-bold text-red-600">
              KSh {(product.pricePerKg * product.quantityKg).toLocaleString()}
            </span>

            <button
              className="w-10 h-10 flex items-center justify-center text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
              onClick={() => setShowRemoveModal(true)}
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      </div>

      {showRemoveModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Remove item?
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Are you sure you want to remove{" "}
                  <span className="font-semibold">{product.name}</span> from
                  your cart?
                </p>
              </div>

              <button
                onClick={() => setShowRemoveModal(false)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowRemoveModal(false)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={confirmRemove}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 cursor-pointer"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CartItem;
