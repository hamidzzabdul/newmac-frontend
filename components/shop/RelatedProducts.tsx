import ProductItem from "@/components/ProductItem";

const RelatedProducts = ({ products }) => {
  if (!products.length) return null;
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Related Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <ProductItem key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
