"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import NavActions from "./NavActions";
import AuthModal from "./AuthModal";
import { useAuth } from "@/hooks/UseAuth";
import { FaBars, FaInstagram, FaSquareFacebook } from "react-icons/fa6";
import { FaTiktok } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { User, ShoppingBag, LogOut, LayoutDashboard } from "lucide-react";
import toast from "react-hot-toast";
import TopBar from "./TopBar";
import Image from "next/image";
import Logo from "@/public/logo.jpeg";

function NavBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");

  const router = useRouter();
  const { user, isSignedIn, logout, login, loading } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    logout();
    setShowMobileMenu(false);
    toast.success("Logged out successfully");
  };

  return (
    <>
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab={authTab}
        onLoginSuccess={(userData) => {
          login(userData);
          setAuthModalOpen(false);
          setShowMobileMenu(false);
          toast.success(
            `Welcome${userData.fullName ? `, ${userData.fullName.split(" ")[0]}` : ""}!`,
          );
        }}
      />

      <TopBar />

      <nav className="w-full bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-67.5 overflow-hidden">
                <Image
                  src={Logo}
                  alt="newmark logo"
                  width={500}
                  height={500}
                  className="w-[50%] sm:w-[70%] md:w-[90%] h-full"
                />
              </div>
            </Link>

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

            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden text-gray-700"
                aria-label="Menu"
              >
                <FaBars size={24} />
              </button>

              <NavActions
                onOpenAuth={(tab) => {
                  setAuthTab(tab);
                  setAuthModalOpen(true);
                }}
              />
            </div>
          </div>
        </div>
      </nav>

      {showMobileMenu && (
        <div className="fixed inset-0 bg-black/50 z-50 md:hidden">
          <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Menu</h2>
                <button
                  onClick={() => setShowMobileMenu(false)}
                  className="text-gray-500"
                  aria-label="Close"
                >
                  <IoClose size={28} />
                </button>
              </div>

              {!loading && isSignedIn && user ? (
                <div className="mb-6 rounded-2xl border border-red-100 bg-gradient-to-r from-red-50 to-rose-100 p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
                      {user.fullName?.charAt(0).toUpperCase() || "U"}
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-gray-900 truncate">
                        {user.fullName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}

              <ul className="space-y-2">
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
                    href="/contact"
                    onClick={() => setShowMobileMenu(false)}
                    className="block text-lg text-gray-700 hover:text-red-600 py-2"
                  >
                    Contact
                  </Link>
                </li>

                {!loading && isSignedIn ? (
                  <>
                    <li className="pt-3 mt-3 border-t border-gray-200">
                      <Link
                        href="/profile"
                        onClick={() => setShowMobileMenu(false)}
                        className="flex items-center gap-3 text-lg text-gray-700 hover:text-red-600 py-2"
                      >
                        <User size={18} />
                        My Account
                      </Link>
                    </li>

                    <li>
                      <Link
                        href="/orders"
                        onClick={() => setShowMobileMenu(false)}
                        className="flex items-center gap-3 text-lg text-gray-700 hover:text-red-600 py-2"
                      >
                        <ShoppingBag size={18} />
                        My Orders
                      </Link>
                    </li>

                    {user?.role === "admin" && (
                      <li>
                        <Link
                          href="/dashboard"
                          onClick={() => setShowMobileMenu(false)}
                          className="flex items-center gap-3 text-lg text-gray-700 hover:text-red-600 py-2"
                        >
                          <LayoutDashboard size={18} />
                          Admin Dashboard
                        </Link>
                      </li>
                    )}

                    <li>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 text-lg text-red-600 hover:text-red-700 py-2 text-left w-full"
                      >
                        <LogOut size={18} />
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <li className="pt-3 mt-3 border-t border-gray-200">
                    <button
                      onClick={() => {
                        setShowMobileMenu(false);
                        setAuthTab("login");
                        setAuthModalOpen(true);
                      }}
                      className="block text-lg text-gray-700 hover:text-red-600 py-2 text-left w-full"
                    >
                      Login / Sign Up
                    </button>
                  </li>
                )}
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
