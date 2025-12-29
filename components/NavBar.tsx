"use client";

import { useState } from "react";
import {
  FaBars,
  FaInstagram,
  FaRegUser,
  FaSquareFacebook,
} from "react-icons/fa6";
import { FaTiktok } from "react-icons/fa";
import Link from "next/link";
import { IoBagOutline, IoSearchOutline, IoClose } from "react-icons/io5";
import { useAppSelector } from "@/app/store/hook";
import { useRouter } from "next/navigation";

function NavBar() {
  const cartItems = useAppSelector((state) => state.cart.items);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      {/* Top Banner */}
      <div className="w-full bg-linear-to-r from-red-600 to-red-700 py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-4 flex-wrap">
          <p className="text-white font-semibold text-sm md:text-base text-center">
            🚚 Free delivery for orders above KSh 5,000
          </p>
          <div className="hidden md:flex items-center gap-3">
            <span className="text-white/90 text-sm font-medium">
              Follow us:
            </span>
            <div className="flex items-center gap-2">
              <Link
                href="https://facebook.com"
                target="_blank"
                className="hover:scale-110 transition-transform"
              >
                <FaSquareFacebook
                  className="text-white hover:text-red-200"
                  size={18}
                />
              </Link>
              <Link
                href="https://tiktok.com"
                target="_blank"
                className="hover:scale-110 transition-transform"
              >
                <FaTiktok className="text-white hover:text-red-200" size={17} />
              </Link>
              <Link
                href="https://instagram.com"
                target="_blank"
                className="hover:scale-110 transition-transform"
              >
                <FaInstagram
                  className="text-white hover:text-red-200"
                  size={17}
                />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="w-full bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-20">
            {/* Left - Menu Items (Desktop) */}
            <div className="flex items-center gap-8">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden text-gray-700 hover:text-red-600 transition-colors"
              >
                <FaBars size={22} />
              </button>

              {/* Desktop Menu */}
              <ul className="hidden md:flex items-center gap-8">
                <li>
                  <Link
                    href="/"
                    className="text-gray-700 font-semibold hover:text-red-600 transition-colors relative group"
                  >
                    Home
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop"
                    className="text-gray-700 font-semibold hover:text-red-600 transition-colors relative group"
                  >
                    Shop
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faqs"
                    className="text-gray-700 font-semibold hover:text-red-600 transition-colors relative group"
                  >
                    FAQ&apos;s
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact-us"
                    className="text-gray-700 font-semibold hover:text-red-600 transition-colors relative group"
                  >
                    Contact Us
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Center - Logo */}
            <Link
              href="/"
              className="absolute left-1/2 transform -translate-x-1/2"
            >
              <div className="bg-red-600 px-6 py-2 rounded-lg hover:bg-red-700 transition-all duration-300 shadow-md hover:shadow-lg">
                <h1 className="text-xl md:text-2xl font-bold text-white">
                  NewMac
                </h1>
              </div>
            </Link>

            {/* Right - Actions */}
            <div className="flex items-center gap-4">
              {/* User Icon */}
              <Link href="/account">
                <button className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors">
                  <FaRegUser
                    className="text-gray-700 hover:text-red-600"
                    size={20}
                  />
                </button>
              </Link>

              {/* Search Icon */}
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
              >
                <IoSearchOutline
                  className="text-gray-700 hover:text-red-600"
                  size={24}
                />
              </button>

              {/* Cart Icon */}
              <Link href="/cart">
                <button className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors">
                  <IoBagOutline
                    className="text-gray-700 hover:text-red-600"
                    size={22}
                  />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md">
                      {cartItems.length}
                    </span>
                  )}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Search Overlay */}
      {showSearch && (
        <div className="fixed inset-0 bg-black/50 z-50 animate-fade-in">
          <div className="w-full bg-white shadow-2xl">
            <div className="max-w-4xl mx-auto px-6 py-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Search Products
                </h2>
                <button
                  onClick={() => setShowSearch(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <IoClose size={32} />
                </button>
              </div>

              <form onSubmit={handleSearch} className="relative">
                <IoSearchOutline
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={24}
                />
                <input
                  type="text"
                  placeholder="Search for beef, goat, lamb, chicken..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full pl-14 pr-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                >
                  Search
                </button>
              </form>

              {/* Popular Searches */}
              <div className="mt-6">
                <p className="text-sm text-gray-600 mb-3">Popular searches:</p>
                <div className="flex flex-wrap gap-2">
                  {["Beef", "Goat", "Lamb", "Chicken", "Steak"].map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setSearchQuery(term);
                        router.push(`/shop?search=${term}`);
                        setShowSearch(false);
                      }}
                      className="px-4 py-2 bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-600 rounded-full text-sm font-medium transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="fixed inset-0 bg-black/50 z-50 md:hidden">
          <div className="absolute left-0 top-0 h-full w-80 bg-white shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-gray-900">Menu</h2>
                <button
                  onClick={() => setShowMobileMenu(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <IoClose size={28} />
                </button>
              </div>

              <ul className="space-y-4">
                <li>
                  <Link
                    href="/"
                    onClick={() => setShowMobileMenu(false)}
                    className="block text-lg font-semibold text-gray-700 hover:text-red-600 py-2"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop"
                    onClick={() => setShowMobileMenu(false)}
                    className="block text-lg font-semibold text-gray-700 hover:text-red-600 py-2"
                  >
                    Shop
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faqs"
                    onClick={() => setShowMobileMenu(false)}
                    className="block text-lg font-semibold text-gray-700 hover:text-red-600 py-2"
                  >
                    FAQ&apos;s
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact-us"
                    onClick={() => setShowMobileMenu(false)}
                    className="block text-lg font-semibold text-gray-700 hover:text-red-600 py-2"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/account"
                    onClick={() => setShowMobileMenu(false)}
                    className="block text-lg font-semibold text-gray-700 hover:text-red-600 py-2"
                  >
                    My Account
                  </Link>
                </li>
              </ul>

              {/* Social Media Links in Mobile Menu */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-4">Follow us:</p>
                <div className="flex items-center gap-4">
                  <Link href="https://facebook.com" target="_blank">
                    <FaSquareFacebook
                      className="text-gray-700 hover:text-red-600"
                      size={24}
                    />
                  </Link>
                  <Link href="https://tiktok.com" target="_blank">
                    <FaTiktok
                      className="text-gray-700 hover:text-red-600"
                      size={22}
                    />
                  </Link>
                  <Link href="https://instagram.com" target="_blank">
                    <FaInstagram
                      className="text-gray-700 hover:text-red-600"
                      size={22}
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </>
  );
}

export default NavBar;
