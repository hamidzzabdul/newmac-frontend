import Link from "next/link";
import {
  ShoppingCart,
  Beef,
  Truck,
  PhoneCall,
  CheckCircle2,
} from "lucide-react";

const steps = [
  {
    id: 1,
    icon: ShoppingCart,
    title: "Choose Your Meat",
    description:
      "Browse our premium selection of fresh beef, goat, and lamb cuts prepared for homes, restaurants, and events.",
  },
  {
    id: 2,
    icon: Beef,
    title: "Fresh Preparation",
    description:
      "Each order is prepared with care to maintain freshness, quality, and clean handling standards from source to packaging.",
  },
  {
    id: 3,
    icon: Truck,
    title: "Fast Delivery",
    description:
      "We deliver fresh meat quickly and reliably so your order reaches you in excellent condition and ready for your kitchen.",
  },
  {
    id: 4,
    icon: PhoneCall,
    title: "Easy Support",
    description:
      "Need a custom order or bulk supply? Our team is available to help with product selection, pricing, and delivery coordination.",
  },
];

const highlights = [
  "Fresh halal meat for families, restaurants, and events",
  "Reliable ordering and delivery experience",
  "Carefully handled premium cuts",
  "Responsive customer support for custom requests",
];

const OrderingProcess = () => {
  return (
    <section
      className="py-16 bg-linear-to-b from-white to-gray-50"
      aria-labelledby="ordering-process-heading"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 bg-red-50 text-red-700 font-semibold text-sm rounded-full mb-4">
            FRESHNESS • QUALITY • DELIVERY
          </span>

          <h2
            id="ordering-process-heading"
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            Fresh Halal Meat,{" "}
            <span className="text-red-600">From Order to Delivery</span>
          </h2>

          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Shop premium halal meat online with confidence. We make it easy to
            order fresh beef, goat, and lamb with dependable service, careful
            handling, and convenient delivery to your doorstep.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Content */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Why Customers Choose Us
            </h3>

            <p className="text-gray-600 mb-6 leading-7">
              We focus on delivering fresh, high-quality halal meat with a
              simple ordering experience. Whether you are shopping for your
              household, special occasions, or business needs, our goal is to
              provide premium cuts, trusted service, and on-time delivery.
            </p>

            <div className="space-y-4">
              {highlights.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <CheckCircle2
                    className="text-red-600 mt-0.5 shrink-0"
                    size={20}
                  />
                  <p className="text-gray-700">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors cursor-pointer shadow-md hover:shadow-lg"
              >
                Shop Fresh Meat
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 border border-red-600 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
              >
                Contact Our Team
              </Link>
            </div>
          </div>

          {/* Right Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.id}
                  className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-4 group-hover:bg-red-600 transition-colors">
                    <Icon className="w-7 h-7 text-red-600 group-hover:text-white transition-colors" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {step.title}
                  </h3>

                  <p className="text-gray-600 leading-7 text-sm">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom SEO + CTA strip */}
        <div className="mt-12 bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 md:p-10 text-white text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-3">
            Order Premium Halal Meat Online Today
          </h3>
          <p className="text-red-100 text-lg max-w-3xl mx-auto mb-6">
            Looking for fresh halal beef, goat, or lamb with dependable
            delivery? Explore our selection and enjoy quality meat prepared with
            care for homes, catering, and business orders.
          </p>

          <Link
            href="/shop"
            className="inline-block px-8 py-4 bg-white text-red-600 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 cursor-pointer shadow-lg"
          >
            Start Your Order
          </Link>
        </div>
      </div>
    </section>
  );
};

export default OrderingProcess;
