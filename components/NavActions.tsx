import { useState } from "react";
import { SignInButton, useClerk, useUser } from "@clerk/nextjs";
import { FaRegUser } from "react-icons/fa6";
import { User, ShoppingBag, LogOut, ChevronRight } from "lucide-react";
import Link from "next/link";
import { IoBagOutline, IoSearchOutline } from "react-icons/io5";
import { useAppSelector } from "@/app/store/hook";
import toast from "react-hot-toast";

interface NavActionsProps {
  setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
  showSearch: boolean;
}

function NavActions({ setShowSearch, showSearch }: NavActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { signOut } = useClerk();
  const { user, isSignedIn } = useUser(); // 👈 get user info
  const cartItems = useAppSelector((state) => state.cart.items);

  const handleSignOut = async () => {
    toast("Logged out successfully");
    await signOut({ redirectUrl: "/" });
  };

  return (
    <div className="flex items-center gap-4">
      {/* User Icon */}
      <div className="relative flex items-center flex-col gap-2">
        {isSignedIn ? (
          <>
            <button
              onMouseEnter={() => setIsOpen(true)}
              className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
            >
              <FaRegUser
                className="text-gray-700 cursor-pointer hover:text-red-600"
                size={20}
              />
            </button>

            {isOpen && (
              <div
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
                className="absolute top-full right-0 mt-3 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 animate-dropdown"
              >
                {/* User info header */}
                <div className="px-4 py-4 border-b border-gray-100 bg-linear-to-r from-red-50 to-red-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                      <User className="text-white" size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-900">
                        {user?.fullName}
                      </p>
                      <p className="text-xs text-gray-600">
                        {user?.emailAddresses[0]?.emailAddress}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Menu items */}
                <div className="py-2">
                  <Link
                    href={"/profile"}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-red-50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-red-100 transition-colors">
                        <User
                          className="text-gray-600 group-hover:text-red-600"
                          size={18}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-700 group-hover:text-red-600">
                        My Profile
                      </span>
                    </div>
                    <ChevronRight
                      className="text-gray-400 group-hover:text-red-600"
                      size={16}
                    />
                  </Link>

                  <Link
                    href={"/orders"}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-red-50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-red-100 transition-colors">
                        <ShoppingBag
                          className="text-gray-600 group-hover:text-red-600"
                          size={18}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-700 group-hover:text-red-600">
                        My Orders
                      </span>
                    </div>
                    <ChevronRight
                      className="text-gray-400 group-hover:text-red-600"
                      size={16}
                    />
                  </Link>
                </div>

                {/* Logout Button */}
                <div className="border-t border-gray-100 p-2 cursor-pointer">
                  <button
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-red-50 rounded-lg transition-colors group cursor-pointer"
                    onClick={handleSignOut}
                  >
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-600 transition-colors">
                      <LogOut
                        className="text-red-600 group-hover:text-white"
                        size={18}
                      />
                    </div>
                    <span className="text-sm font-semibold text-red-600 group-hover:text-red-700">
                      Logout
                    </span>
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          // Sign In button for non-signed-in users
          <SignInButton mode="modal">
            <button className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors">
              <FaRegUser
                className="text-gray-700 cursor-pointer hover:text-red-600"
                size={20}
              />
            </button>
          </SignInButton>
        )}
      </div>

      {/* Search Icon */}
      <button
        onClick={() => setShowSearch(!showSearch)}
        className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
      >
        <IoSearchOutline
          className="text-gray-700 cursor-pointer hover:text-red-600"
          size={24}
        />
      </button>

      {/* Cart Icon */}
      <Link href="/cart">
        <button className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors">
          <IoBagOutline
            className="text-gray-700 cursor-pointer hover:text-red-600"
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
  );
}

export default NavActions;
