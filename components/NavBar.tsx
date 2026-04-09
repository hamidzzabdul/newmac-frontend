"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import NavActions from "./NavActions";
import { FaBars, FaInstagram, FaSquareFacebook } from "react-icons/fa6";
import { FaTiktok } from "react-icons/fa";
import { IoSearchOutline, IoClose } from "react-icons/io5";
import TopBar from "./TopBar";

function NavBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  return (
    <>
      {/* Top Bar */}
      <TopBar />

      {/* Main Navigation */}
      <nav className="w-full bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-red-600 flex items-center justify-center">
                <span className="text-white text-xl font-bold">N</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">NewMark</span>
            </Link>

            {/* Desktop Menu */}
            <ul className="hidden md:flex items-center gap-8">
              <li>
                <Link
                  href="/"
                  className="text-gray-700 font-medium hover:text-red-600 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="text-gray-700 font-medium hover:text-red-600 transition-colors"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  href="/faqs"
                  className="text-gray-700 font-medium hover:text-red-600 transition-colors"
                >
                  FAQ&apos;s
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-700 font-medium hover:text-red-600 transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden text-gray-700"
                aria-label="Menu"
              >
                <FaBars size={24} />
              </button>
              <NavActions />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="fixed inset-0 bg-black/50 z-50 md:hidden">
          <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-gray-900">Menu</h2>
                <button
                  onClick={() => setShowMobileMenu(false)}
                  className="text-gray-500"
                  aria-label="Close"
                >
                  <IoClose size={28} />
                </button>
              </div>

              <ul className="space-y-4">
                <li>
                  <Link
                    href="/"
                    onClick={() => setShowMobileMenu(false)}
                    className="block text-lg text-gray-700 hover:text-red-600 py-2"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop"
                    onClick={() => setShowMobileMenu(false)}
                    className="block text-lg text-gray-700 hover:text-red-600 py-2"
                  >
                    Shop
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faqs"
                    onClick={() => setShowMobileMenu(false)}
                    className="block text-lg text-gray-700 hover:text-red-600 py-2"
                  >
                    FAQ&apos;s
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact-us"
                    onClick={() => setShowMobileMenu(false)}
                    className="block text-lg text-gray-700 hover:text-red-600 py-2"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/account"
                    onClick={() => setShowMobileMenu(false)}
                    className="block text-lg text-gray-700 hover:text-red-600 py-2"
                  >
                    My Account
                  </Link>
                </li>
              </ul>

              <div className="mt-8 pt-8 border-t">
                <div className="flex items-center gap-4">
                  <Link
                    href="https://facebook.com"
                    target="_blank"
                    className="text-gray-600 hover:text-red-600"
                  >
                    <FaSquareFacebook size={24} />
                  </Link>
                  <Link
                    href="https://tiktok.com"
                    target="_blank"
                    className="text-gray-600 hover:text-red-600"
                  >
                    <FaTiktok size={22} />
                  </Link>
                  <Link
                    href="https://instagram.com"
                    target="_blank"
                    className="text-gray-600 hover:text-red-600"
                  >
                    <FaInstagram size={22} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default NavBar;
