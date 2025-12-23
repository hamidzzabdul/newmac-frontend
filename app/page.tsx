// import Categories from "@/components/homepage/Categories";
import Hero from "@/components/homepage/Hero";
import Product from "@/components/Product";

export default function Home() {
  return (
    <main>
      <Hero />
      <div className="w-[80%] max-w-350 mx-auto">
        {/* <Categories /> */}
        <Product />
      </div>
    </main>
  );
}
