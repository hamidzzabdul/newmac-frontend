// import Categories from "@/components/homepage/Categories";
import Certifications from "@/components/Certifications";
import Categories from "@/components/homepage/Categories";
import Hero from "@/components/homepage/Hero";
import Product from "@/components/Product";

export default function Home() {
  return (
    <main>
      <Hero />
      <div className="md:w-[90%] max-w-350 mx-auto">
        <Categories />
        <Product />
        <Certifications />
      </div>
    </main>
  );
}
