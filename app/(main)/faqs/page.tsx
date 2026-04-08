"use client";

import { useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import { FaTruck, FaCreditCard, FaBox, FaPhoneAlt } from "react-icons/fa";

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQ[] = [
  {
    category: "Ordering",
    question: "How do I place an order?",
    answer:
      "Browse our shop, add items to your cart, and proceed to checkout. You'll need to create an account or sign in to complete your purchase. Follow the simple steps to add your delivery address and payment method.",
  },
  {
    category: "Ordering",
    question: "Can I modify or cancel my order?",
    answer:
      "You can modify or cancel your order within 1 hour of placing it. Please contact our customer service immediately at +254 XXX XXX XXX or email us at orders@NewMark.com. Once your order is being processed, changes may not be possible.",
  },
  {
    category: "Ordering",
    question: "What payment methods do you accept?",
    answer:
      "We accept M-Pesa, credit/debit cards (Visa, Mastercard), and cash on delivery for orders within Nairobi. All online payments are secure and encrypted.",
  },
  {
    category: "Delivery",
    question: "What are your delivery areas?",
    answer:
      "We currently deliver within Nairobi and its surrounding areas. Enter your location at checkout to confirm if we deliver to your area. We're constantly expanding our delivery zones.",
  },
  {
    category: "Delivery",
    question: "How long does delivery take?",
    answer:
      "Standard delivery takes 2-4 hours within Nairobi CBD and 4-6 hours for surrounding areas. We also offer express delivery (1-2 hours) for an additional fee. All deliveries are made Monday to Saturday.",
  },
  {
    category: "Delivery",
    question: "Is delivery free?",
    answer:
      "Yes! We offer free delivery on all orders above KSh 5,000. Orders below this amount have a delivery fee of KSh 300-500 depending on your location.",
  },
  {
    category: "Products",
    question: "Are your meats fresh?",
    answer:
      "Absolutely! All our meats are freshly sourced daily from certified suppliers. We maintain strict quality control and cold chain management to ensure you receive the freshest products.",
  },
  {
    category: "Products",
    question: "Do you offer organic or grass-fed options?",
    answer:
      "Yes, we have a selection of organic and grass-fed meats. Look for the 'Organic' or 'Grass-Fed' labels on product pages. These premium options are sourced from certified farms.",
  },
  {
    category: "Products",
    question: "How should I store the meat after delivery?",
    answer:
      "Store all meat in your refrigerator immediately upon delivery. Fresh meat should be consumed within 2-3 days or frozen for longer storage. We recommend keeping meat in its original packaging until ready to use.",
  },
  {
    category: "Returns",
    question: "What is your return policy?",
    answer:
      "We stand behind our quality. If you're not satisfied with your order, contact us within 24 hours of delivery. We'll arrange a replacement or full refund. Please note that meat must be unopened and properly refrigerated.",
  },
  {
    category: "Returns",
    question: "What if I receive a damaged order?",
    answer:
      "If your order arrives damaged or incorrect, please take photos and contact us immediately at +254 XXX XXX XXX. We'll arrange a replacement or refund right away. Your satisfaction is our priority.",
  },
];

const categories = ["All", "Ordering", "Delivery", "Products", "Returns"];

function FAQsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filteredFAQs =
    activeCategory === "All"
      ? faqs
      : faqs.filter((faq) => faq.category === activeCategory);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Quick Links */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-red-50 transition-colors cursor-pointer">
              <FaTruck className="text-red-600 text-2xl" />
              <div>
                <p className="font-semibold text-gray-900">Fast Delivery</p>
                <p className="text-sm text-gray-600">2-6 hours</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-red-50 transition-colors cursor-pointer">
              <FaCreditCard className="text-red-600 text-2xl" />
              <div>
                <p className="font-semibold text-gray-900">Secure Payment</p>
                <p className="text-sm text-gray-600">Multiple options</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-red-50 transition-colors cursor-pointer">
              <FaBox className="text-red-600 text-2xl" />
              <div>
                <p className="font-semibold text-gray-900">Fresh Products</p>
                <p className="text-sm text-gray-600">Daily sourced</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-red-50 transition-colors cursor-pointer">
              <FaPhoneAlt className="text-red-600 text-2xl" />
              <div>
                <p className="font-semibold text-gray-900">24/7 Support</p>
                <p className="text-sm text-gray-600">Always here</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 font-medium transition-colors cursor-pointer ${
                activeCategory === category
                  ? "bg-red-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFAQs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex-1">
                  <span className="inline-block px-3 py-1 bg-red-100 text-red-600 text-xs font-semibold mb-2">
                    {faq.category}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {faq.question}
                  </h3>
                </div>
                <IoChevronDown
                  className={`text-gray-400 text-xl transition-transform ml-4 shrink-0 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Still Have Questions */}
        <div className="mt-12 bg-red-600 text-white p-8 text-center">
          <h2 className="text-2xl font-bold mb-3">Still have questions?</h2>
          <p className="mb-6 text-red-100">
            Can&apos;t find the answer you&apos;re looking for? Our customer
            support team is here to help.
          </p>
          <a
            href="/contact"
            className="inline-block px-8 py-3 bg-white text-red-600 font-semibold hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}

export default FAQsPage;
