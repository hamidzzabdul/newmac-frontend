"use client";

import { useState } from "react";
import { FaRegUser } from "react-icons/fa6";
import { User, ShoppingBag, LogOut, ChevronRight } from "lucide-react";
import Link from "next/link";
import { IoBagOutline, IoSearchOutline } from "react-icons/io5";
import { useAppSelector } from "@/app/store/hook";
import toast from "react-hot-toast";
import AuthModal from "./AuthModal";
import { useAuth } from "@/hooks/UseAuth";

interface NavActionsProps {
  setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
  showSearch: boolean;
}

function NavActions({ setShowSearch, showSearch }: NavActionsProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");

  const { user, isSignedIn, login, logout, loading } = useAuth(); // 👈 loading added
  const cartItems = useAppSelector((state) => state.cart.items);

  const handleSignOut = () => {
    logout();
    setDropdownOpen(false);
    toast.success("Logged out successfully");
  };

  const openAuth = (tab: "login" | "register") => {
    setAuthTab(tab);
    setAuthModalOpen(true);
  };

  return (
    <>
      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab={authTab}
        onLoginSuccess={(userData) => {
          login(userData);
          toast.success(
            `Welcome${userData.fullName ? `, ${userData.fullName.split(" ")[0]}` : ""}!`,
          );
        }}
      />

      <div className="flex items-center gap-4">
        {/* User Icon + Dropdown */}
        <div className="relative flex items-center flex-col gap-2">
          {!loading && isSignedIn ? ( // 👈 wait for localStorage to load
            <>
              <button
                onMouseEnter={() => setDropdownOpen(true)}
                className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <FaRegUser
                  className="text-gray-700 hover:text-red-600 transition-colors"
                  size={20}
                />
              </button>

              {dropdownOpen && (
                <div
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                  className="absolute top-full right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
                  style={{
                    animation:
                      "dropdown-in 0.18s cubic-bezier(0.16,1,0.3,1) forwards",
                  }}
                >
                  {/* User header */}
                  <div className="px-4 py-4 border-b border-gray-100 bg-gradient-to-r from-red-50 to-rose-100">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-red-600 rounded-full flex items-center justify-center shadow-md shadow-red-200">
                        <User className="text-white" size={20} />
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

                  {/* Menu items */}
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

                    <Link
                      href="/dashboard"
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
                          Admin Dashboard
                        </span>
                      </div>
                      <ChevronRight
                        className="text-gray-300 group-hover:text-red-400 transition-colors"
                        size={15}
                      />
                    </Link>
                  </div>

                  {/* Logout */}
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
            </>
          ) : (
            // 👇 Renders during loading AND when signed out — same element both times,
            //    so SSR, loading state, and guest state all show the identical icon
            <button
              onClick={!loading ? () => openAuth("login") : undefined}
              className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <FaRegUser
                className="text-gray-700 hover:text-red-600 transition-colors"
                size={20}
              />
            </button>
          )}
        </div>

        {/* Search */}
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <IoSearchOutline
            className="text-gray-700 hover:text-red-600 transition-colors"
            size={24}
          />
        </button>

        {/* Cart */}
        <Link href="/cart">
          <button className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
            <IoBagOutline
              className="text-gray-700 hover:text-red-600 transition-colors"
              size={22}
            />
            {!loading &&
              cartItems.length > 0 && ( // 👈 gate badge on loading too
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md">
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
      `}</style>
    </>
  );
}

export default NavActions;
