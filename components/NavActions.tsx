"use client";

import { useEffect, useRef, useState } from "react";
import { FaRegUser } from "react-icons/fa6";
import {
  User,
  ShoppingBag,
  LogOut,
  ChevronRight,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useAppSelector } from "@/app/store/hook";
import toast from "react-hot-toast";
import AuthModal from "./AuthModal";
import { useAuth } from "@/hooks/UseAuth";

type NavActionsProps = {
  onOpenAuth?: (tab: "login" | "register") => void;
};

function NavActions({ onOpenAuth }: NavActionsProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [cartBump, setCartBump] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");

  const { user, isSignedIn, login, logout, loading } = useAuth();
  const cartItems = useAppSelector((state) => state.cart.items);
  const prevCartCount = useRef(cartItems.length);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (cartItems.length > prevCartCount.current) {
      setCartBump(true);
      setTimeout(() => setCartBump(false), 450);
    }
    prevCartCount.current = cartItems.length;
  }, [cartItems.length]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleSignOut = () => {
    logout();
    setDropdownOpen(false);
    toast.success("Logged out successfully");
  };

  const openAuth = (tab: "login" | "register") => {
    if (onOpenAuth) {
      onOpenAuth(tab);
      setDropdownOpen(false);
      return;
    }

    setAuthTab(tab);
    setAuthModalOpen(true);
    setDropdownOpen(false);
  };

  const toggleMobileDropdown = () => {
    if (!loading) {
      setDropdownOpen((prev) => !prev);
    }
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
          toast.success(
            `Welcome${userData.fullName ? `, ${userData.fullName.split(" ")[0]}` : ""}!`,
          );
        }}
      />

      <div className="flex items-center gap-3">
        {/* ─── User Area ─── */}
        <div ref={dropdownRef} className="relative flex items-center">
          {!loading && isSignedIn ? (
            <>
              {/* Desktop signed-in pill */}
              <button
                onMouseEnter={() => setDropdownOpen(true)}
                className="hidden sm:flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all duration-200 cursor-pointer group"
              >
                <div className="relative w-7 h-7 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {user?.fullName?.charAt(0).toUpperCase() ?? (
                    <User size={14} />
                  )}
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
                </div>

                <span className="text-sm font-semibold text-gray-700 group-hover:text-red-600 transition-colors max-w-20 truncate">
                  {user?.fullName?.split(" ")[0]}
                </span>
              </button>

              {/* Mobile signed-in icon */}
              <button
                onClick={toggleMobileDropdown}
                className="sm:hidden relative flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all duration-200 cursor-pointer"
                aria-label="Open account menu"
              >
                <div className="relative w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white text-sm font-bold">
                  {user?.fullName?.charAt(0).toUpperCase() ?? (
                    <User size={16} />
                  )}
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
                </div>
              </button>
            </>
          ) : (
            <>
              {/* Desktop guest pill */}
              <div className="hidden sm:flex items-center gap-1 rounded-full border border-gray-200 overflow-hidden">
                <button
                  onClick={!loading ? () => openAuth("login") : undefined}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-150 cursor-pointer"
                >
                  <FaRegUser size={14} />
                  Login
                </button>
                <span className="text-gray-300 text-sm select-none">|</span>
                <button
                  onClick={!loading ? () => openAuth("register") : undefined}
                  className="flex items-center px-3 py-1.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-all duration-150 cursor-pointer"
                >
                  Sign up
                </button>
              </div>

              {/* Mobile guest icon */}
              <button
                onClick={toggleMobileDropdown}
                className="sm:hidden flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all duration-200 cursor-pointer"
                aria-label="Open login menu"
              >
                <FaRegUser size={18} className="text-gray-700" />
              </button>
            </>
          )}

          {/* Desktop dropdown for signed-in user */}
          {!loading && isSignedIn && dropdownOpen && (
            <div
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
              className="hidden sm:block absolute top-full right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
              style={{
                animation:
                  "dropdown-in 0.18s cubic-bezier(0.16,1,0.3,1) forwards",
              }}
            >
              <div className="px-4 py-4 border-b border-gray-100 bg-linear-to-r from-red-50 to-rose-100">
                <div className="flex items-center gap-3">
                  <div className="relative w-11 h-11 bg-red-600 rounded-full flex items-center justify-center shadow-md shadow-red-200 text-white font-bold text-lg">
                    {user?.fullName?.charAt(0).toUpperCase() ?? (
                      <User size={20} />
                    )}
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-gray-900 truncate">
                      {user?.fullName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="py-2">
                <Link
                  href="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-red-50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-red-100 transition-colors">
                      <User
                        className="text-gray-500 group-hover:text-red-600 transition-colors"
                        size={16}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-red-600 transition-colors">
                      My Profile
                    </span>
                  </div>
                  <ChevronRight
                    className="text-gray-300 group-hover:text-red-400 transition-colors"
                    size={15}
                  />
                </Link>

                <Link
                  href="/orders"
                  onClick={() => setDropdownOpen(false)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-red-50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-red-100 transition-colors">
                      <ShoppingBag
                        className="text-gray-500 group-hover:text-red-600 transition-colors"
                        size={16}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-red-600 transition-colors">
                      My Orders
                    </span>
                  </div>
                  <ChevronRight
                    className="text-gray-300 group-hover:text-red-400 transition-colors"
                    size={15}
                  />
                </Link>

                {user?.role === "admin" && (
                  <Link
                    href="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-red-50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-red-100 transition-colors">
                        <LayoutDashboard
                          className="text-gray-500 group-hover:text-red-600 transition-colors"
                          size={16}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-700 group-hover:text-red-600 transition-colors">
                        Admin Dashboard
                      </span>
                    </div>
                    <ChevronRight
                      className="text-gray-300 group-hover:text-red-400 transition-colors"
                      size={15}
                    />
                  </Link>
                )}
                {(user?.role === "worker" || user?.role === "admin") && (
                  <Link
                    href="/butcher/orders"
                    onClick={() => setDropdownOpen(false)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-red-50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-red-100 transition-colors">
                        <ShoppingBag
                          className="text-gray-500 group-hover:text-red-600 transition-colors"
                          size={16}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-700 group-hover:text-red-600 transition-colors">
                        Order Desk
                      </span>
                    </div>
                    <ChevronRight
                      className="text-gray-300 group-hover:text-red-400 transition-colors"
                      size={15}
                    />
                  </Link>
                )}
              </div>

              <div className="border-t border-gray-100 p-2">
                <button
                  onClick={handleSignOut}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-red-50 rounded-xl transition-colors group cursor-pointer"
                >
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-600 transition-colors">
                    <LogOut
                      className="text-red-600 group-hover:text-white transition-colors"
                      size={16}
                    />
                  </div>
                  <span className="text-sm font-semibold text-red-600 group-hover:text-red-700 transition-colors">
                    Logout
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Mobile dropdown */}
          {dropdownOpen && (
            <div
              className="sm:hidden absolute top-full right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
              style={{
                animation:
                  "dropdown-in 0.18s cubic-bezier(0.16,1,0.3,1) forwards",
              }}
            >
              {!loading && isSignedIn ? (
                <>
                  <div className="px-4 py-4 border-b border-gray-100 bg-linear-to-r from-red-50 to-rose-100">
                    <div className="flex items-center gap-3">
                      <div className="relative w-11 h-11 bg-red-600 rounded-full flex items-center justify-center shadow-md shadow-red-200 text-white font-bold text-lg">
                        {user?.fullName?.charAt(0).toUpperCase() ?? (
                          <User size={20} />
                        )}
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-sm text-gray-900 truncate">
                          {user?.fullName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="py-2">
                    <Link
                      href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-red-50 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-red-100 transition-colors">
                          <User
                            className="text-gray-500 group-hover:text-red-600 transition-colors"
                            size={16}
                          />
                        </div>
                        <span className="text-sm font-semibold text-gray-700 group-hover:text-red-600 transition-colors">
                          My Account
                        </span>
                      </div>
                      <ChevronRight
                        className="text-gray-300 group-hover:text-red-400 transition-colors"
                        size={15}
                      />
                    </Link>

                    <Link
                      href="/orders"
                      onClick={() => setDropdownOpen(false)}
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-red-50 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-red-100 transition-colors">
                          <ShoppingBag
                            className="text-gray-500 group-hover:text-red-600 transition-colors"
                            size={16}
                          />
                        </div>
                        <span className="text-sm font-semibold text-gray-700 group-hover:text-red-600 transition-colors">
                          My Orders
                        </span>
                      </div>
                      <ChevronRight
                        className="text-gray-300 group-hover:text-red-400 transition-colors"
                        size={15}
                      />
                    </Link>

                    {user?.role === "admin" && (
                      <Link
                        href="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="w-full px-4 py-3 flex items-center justify-between hover:bg-red-50 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-red-100 transition-colors">
                            <LayoutDashboard
                              className="text-gray-500 group-hover:text-red-600 transition-colors"
                              size={16}
                            />
                          </div>
                          <span className="text-sm font-semibold text-gray-700 group-hover:text-red-600 transition-colors">
                            Admin Dashboard
                          </span>
                        </div>
                        <ChevronRight
                          className="text-gray-300 group-hover:text-red-400 transition-colors"
                          size={15}
                        />
                      </Link>
                    )}
                  </div>

                  <div className="border-t border-gray-100 p-2">
                    <button
                      onClick={handleSignOut}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-red-50 rounded-xl transition-colors group cursor-pointer"
                    >
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-600 transition-colors">
                        <LogOut
                          className="text-red-600 group-hover:text-white transition-colors"
                          size={16}
                        />
                      </div>
                      <span className="text-sm font-semibold text-red-600 group-hover:text-red-700 transition-colors">
                        Logout
                      </span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="px-4 py-4 border-b border-gray-100 bg-gray-50">
                    <p className="font-bold text-sm text-gray-900">Welcome</p>
                    <p className="text-xs text-gray-500">
                      Log in or create an account
                    </p>
                  </div>

                  <div className="p-2">
                    <button
                      onClick={() => openAuth("login")}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                    >
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        <FaRegUser size={14} className="text-gray-600" />
                      </div>
                      <span className="text-sm font-semibold text-gray-700">
                        Login
                      </span>
                    </button>

                    <button
                      onClick={() => openAuth("register")}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                    >
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                        <FaRegUser size={14} className="text-red-600" />
                      </div>
                      <span className="text-sm font-semibold text-red-600">
                        Sign Up
                      </span>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* ─── Cart ─── */}
        <Link href="/cart">
          <button className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
            <ShoppingCart
              className={`text-gray-700 hover:text-red-600 transition-colors ${cartBump ? "cart-bump" : ""}`}
              size={22}
            />
            {!loading && cartItems.length > 0 && (
              <span
                key={cartItems.length}
                className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md badge-pop"
              >
                {cartItems.length}
              </span>
            )}
          </button>
        </Link>
      </div>

      <style jsx global>{`
        @keyframes dropdown-in {
          from {
            opacity: 0;
            transform: translateY(-6px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes cart-bump {
          0% {
            transform: scale(1) rotate(0deg);
          }
          25% {
            transform: scale(1.3) rotate(-12deg);
          }
          50% {
            transform: scale(1.2) rotate(10deg);
          }
          75% {
            transform: scale(1.15) rotate(-6deg);
          }
          100% {
            transform: scale(1) rotate(0deg);
          }
        }

        @keyframes badge-pop {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          70% {
            transform: scale(1.3);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .cart-bump {
          animation: cart-bump 0.45s cubic-bezier(0.36, 0.07, 0.19, 0.97);
        }

        .badge-pop {
          animation: badge-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </>
  );
}

export default NavActions;
