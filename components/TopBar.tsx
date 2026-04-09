import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import NavActions from "./NavActions";
import { FaBars, FaInstagram, FaSquareFacebook } from "react-icons/fa6";
import { FaTiktok } from "react-icons/fa";
import { IoSearchOutline, IoClose } from "react-icons/io5";

const TopBar = () => {
  return (
    <div className="w-full bg-red-600 py-2.5">
      <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-y-2 gap-x-4">
        {/* Phone numbers */}
        <div className="flex items-center flex-wrap gap-2">
          <span className="text-white/80 text-xs font-normal">Contact us</span>
          <span className="bg-white/20 border border-white/35 text-white text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap tracking-wide">
            0700 876 201
          </span>
          <span className="bg-white/20 border border-white/35 text-white text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap tracking-wide">
            0701 347 191
          </span>
        </div>

        {/* Social icons */}
        <div className="flex items-center gap-2.5">
          <Link
            href="https://facebook.com"
            target="_blank"
            className="w-7 h-7 rounded-full bg-white/15 border border-white/30 flex items-center justify-center hover:bg-white/28 transition-colors"
          >
            <FaSquareFacebook size={14} className="text-white" />
          </Link>
          <Link
            href="https://tiktok.com"
            target="_blank"
            className="w-7 h-7 rounded-full bg-white/15 border border-white/30 flex items-center justify-center hover:bg-white/28 transition-colors"
          >
            <FaTiktok size={13} className="text-white" />
          </Link>
          <Link
            href="https://instagram.com"
            target="_blank"
            className="w-7 h-7 rounded-full bg-white/15 border border-white/30 flex items-center justify-center hover:bg-white/28 transition-colors"
          >
            <FaInstagram size={13} className="text-white" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
