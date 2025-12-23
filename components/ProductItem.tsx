import Link from "next/link";

type Product = {
  id: string;
  name: string;
  category: string;
  pricePerKg: number;
  image: string;
};

const ProductItem = ({ product }: { product: Product }) => {
  return (
    <Link href={"/"}>
      <div className="w-full h-50 rounded-md border overflow-hidden"></div>
    </Link>
  );
};

export default ProductItem;
