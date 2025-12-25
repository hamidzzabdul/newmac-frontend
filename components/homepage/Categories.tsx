import Link from "next/link";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    id: 1,
    name: "Beef",
    description: "Premium cuts of fresh beef",
    image: "/categories/beef.jpg",
    href: "/shop?category=beef",
    color: "from-red-600 to-red-800",
  },
  {
    id: 2,
    name: "Goat",
    description: "Tender and flavorful goat meat",
    image: "/categories/goat.jpg",
    href: "/shop?category=goat",
    color: "from-orange-600 to-orange-800",
  },
  {
    id: 3,
    name: "Lamb",
    description: "Succulent lamb selections",
    image: "/categories/lamb.jpg",
    href: "/shop?category=lamb",
    color: "from-rose-600 to-rose-800",
  },
  {
    id: 4,
    name: "Chicken",
    description: "Fresh chicken, locally sourced",
    image: "/categories/chicken.jpg",
    href: "/shop?category=chicken",
    color: "from-amber-600 to-amber-800",
  },
  {
    id: 5,
    name: "Camel",
    description: "Exotic camel meat cuts",
    image: "/categories/camel.jpg",
    href: "/shop?category=camel",
    color: "from-yellow-700 to-yellow-900",
  },
];

const Categories = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 bg-red-50 text-red-600 font-semibold text-sm rounded-full mb-4">
            EXPLORE OUR SELECTION
          </span>
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Categories
          </h2>
          <p className="text-gray-600 text-sm max-w-2xl  w-2/4 mx-auto">
            Choose from our wide selection of premium meats, all carefully
            sourced and prepared to the highest standards
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {categories.map((category) => (
            <Link key={category.id} href={category.href} className="group">
              <div className="relative h-70 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-gray-200 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{
                    backgroundImage: `url('${category.image}')`,
                  }}
                >
                  {/* Placeholder gradient if no image */}
                  <div
                    className={`absolute inset-0 bg-linear-to-br ${category.color} opacity-80`}
                  ></div>
                </div>

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent"></div>

                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <div className="transform transition-transform duration-300 group-hover:translate-y-0 translate-y-2">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {category.name}
                    </h3>
                    <p className="text-gray-200 text-sm mb-4 opacity-90">
                      {category.description}
                    </p>

                    {/* CTA Button */}
                    <div className="flex items-center gap-2 text-white font-semibold text-sm group-hover:gap-3 transition-all">
                      <span>Shop Now</span>
                      <ArrowRight
                        size={18}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Hover Border Effect */}
                <div className="absolute inset-0 border-4 border-transparent group-hover:border-red-500 rounded-2xl transition-all duration-300"></div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
