import Certifications from "@/components/Certifications";
import Hero from "@/components/homepage/Hero";
import Product from "@/components/Product";
import { getAllProducts } from "@/lib/api/products";
import { Truck, Shield, Award, Clock } from "lucide-react";

const categories = [
  {
    id: 1,
    name: "Beef",
  },
  {
    id: 2,
    name: "Goat",
  },
  {
    id: 3,
    name: "Lamb",
  },
];

const features = [
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Same-day delivery available on all orders",
  },
  {
    icon: Shield,
    title: "Quality Assured",
    description: "100% fresh and halal certified meat",
  },
  {
    icon: Award,
    title: "Premium Selection",
    description: "Carefully selected premium cuts",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Customer service always available",
  },
];

const testimonials = [
  {
    name: "Ahmed Hassan",
    review:
      "Best quality meat I've ever purchased online. Always fresh and delivered on time!",
    rating: 5,
  },
  {
    name: "Fatima Ali",
    review:
      "The convenience and quality is unmatched. My go-to for all meat purchases.",
    rating: 5,
  },
  {
    name: "Omar Sheikh",
    review: "Excellent service and premium cuts. Highly recommend to everyone!",
    rating: 5,
  },
];

export default async function Home() {
  const { docs: products } = await getAllProducts();

  return (
    <main>
      <Hero />

      {/* Promotional Banner */}
      <div className="bg-linear-to-r from-red-600 to-red-700 text-white py-3 px-4">
        <div className="md:w-[95%] max-w-350 mx-auto">
          <p className="text-center text-sm md:text-base font-medium">
            🎉 Limited Time Offer: Get 15% off on your first order! Use code:{" "}
            <span className="font-bold bg-white text-red-600 px-2 py-1 rounded cursor-pointer hover:bg-red-50 transition-colors">
              WELCOME15
            </span>
          </p>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="md:w-[95%] max-w-350 mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-red-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <div className="md:w-[95%] max-w-350 mx-auto py-8 md:py-12">
        <div className="text-center mb-8 md:mb-12 px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Our Premium Selection
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our carefully curated selection of premium halal meats,
            sourced from the finest suppliers and delivered fresh to your door.
          </p>
        </div>

        {categories.map((cat) => (
          <Product key={cat.id} category={cat} products={products} />
        ))}
      </div>

      {/* Why Choose Us Section */}
      <section className="py-12 md:py-16 bg-linear-to-b from-gray-50 to-white">
        <div className="md:w-[95%] max-w-350 mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            Why Choose Us?
          </h2>
          <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
            We&apos;re committed to providing you with the highest quality meats
            and exceptional service.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 cursor-pointer hover:transform hover:scale-105 transition-transform">
              <div className="text-5xl font-bold text-red-600 mb-3">100%</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                Halal Certified
              </h3>
              <p className="text-gray-600">
                All our products are certified halal and meet the highest
                standards of quality.
              </p>
            </div>

            <div className="text-center p-6 cursor-pointer hover:transform hover:scale-105 transition-transform">
              <div className="text-5xl font-bold text-red-600 mb-3">5000+</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                Happy Customers
              </h3>
              <p className="text-gray-600">
                Join thousands of satisfied customers who trust us for their
                meat needs.
              </p>
            </div>

            <div className="text-center p-6 cursor-pointer hover:transform hover:scale-105 transition-transform">
              <div className="text-5xl font-bold text-red-600 mb-3">24/7</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                Customer Support
              </h3>
              <p className="text-gray-600">
                Our dedicated team is always ready to assist you with any
                questions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="md:w-[95%] max-w-350 mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Ready to Experience Premium Quality?
          </h2>
          <p className="text-lg md:text-xl mb-8 opacity-95 max-w-2xl mx-auto">
            Start shopping today and enjoy fresh, halal-certified meat delivered
            right to your doorstep.
          </p>
          <button className="bg-white text-red-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
            Shop Now
          </button>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="md:w-[95%] max-w-350 mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
            Don't just take our word for it - hear from our satisfied customers.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "{testimonial.review}"
                </p>
                <p className="font-semibold text-gray-900">
                  {testimonial.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <div className="md:w-[95%] max-w-350 mx-auto">
        <Certifications />
      </div>

      {/* Newsletter Section */}
      {/* <section className="py-12 md:py-16 bg-gray-50">
        <div className="md:w-[95%] max-w-350 mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Stay Updated with Special Offers
            </h2>
            <p className="text-gray-600 mb-6 max-w-xl mx-auto">
              Subscribe to our newsletter and get exclusive deals, recipes, and
              updates delivered to your inbox.
            </p>
            <form className="flex flex-col md:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 cursor-text"
              />
              <button
                type="submit"
                className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section> */}
    </main>
  );
}
