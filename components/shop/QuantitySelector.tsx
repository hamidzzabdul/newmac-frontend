import { Plus, Minus } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
}

const QuantitySelector = ({ quantity, setQuantity }: QuantitySelectorProps) => (
  <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
    <button
      className="w-9 h-9 flex items-center justify-center bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
      onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
    >
      <Minus size={16} className="text-gray-600" />
    </button>

    <span className="w-12 text-center font-bold text-gray-800">{quantity}</span>

    <button
      className="w-9 h-9 flex items-center justify-center bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
      onClick={() => setQuantity(quantity + 1)}
    >
      <Plus size={16} className="text-gray-600" />
    </button>
  </div>
);

export default QuantitySelector;
