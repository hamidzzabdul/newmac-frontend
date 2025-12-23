import { Mail } from "lucide-react";
import Link from "next/link";
import { FaFacebookSquare, FaInstagramSquare } from "react-icons/fa";
import { FaPhone, FaTiktok } from "react-icons/fa6";

function Footer() {
  return (
    <div className="w-full h-70 relative bg-gray-100 mt-20 flex items-center justify-center">
      <div className="w-[80%] max-w-350 p-4 grid grid-cols-4 gap-8 ">
        <div className=" flex justify-center flex-col gap-2 ">
          <div className="w-37.5 px-2 py-2 flex items-center justify-center bg-black">
            <Link href={"/"}>
              <h1 className="text-lg font-semibold text-white">NewMac</h1>
            </Link>
          </div>
          <span className="text-sm text-red-500 font-bold ita">
            Quality Meat You Can Trust
          </span>
        </div>

        <div className="flex flex-col  gap-2">
          <h3 className="text-lg font-semibold">Customers</h3>
          <ul className="flex flex-col gap-2 text-sm">
            <Link href={"/"}>
              <li>Login</li>
            </Link>
            <Link href={"/"}>
              <li>Shop</li>
            </Link>
            <Link href={"/"}>
              <li>Cart/Bag</li>
            </Link>
            <Link href={"/"}>
              <li>Order History</li>
            </Link>
          </ul>
        </div>
        <div className="flex flex-col  gap-2">
          <h3 className="text-lg font-semibold">Company</h3>
          <ul className="flex flex-col gap-2 text-sm">
            <Link href={"/"}>
              <li>About Us</li>
            </Link>
            <Link href={"/"}>
              <li>Faq&apos;s</li>
            </Link>
          </ul>
        </div>
        <div className="flex flex-col  gap-2">
          <h3 className="text-lg font-semibold">Get In Touch</h3>
          <div className="flex items-center gap-1">
            <FaPhone size={14} className="text-red-500" />
            <p className="text-sm font-semibold"> +254-706-328-544</p>
          </div>
          <div className="flex items-center gap-1">
            <Mail size={16} className="text-red-500" />
            <p className="text-sm font-semibold"> info@newmac.co.ke</p>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <Link href={"/"}>
              <FaTiktok
                size={24}
                className="text-red-500 hover:scale-125 transform  transition duration-300 "
              />
            </Link>
            <Link href={"/"}>
              <FaFacebookSquare
                size={24}
                className="text-red-500 hover:scale-125 transform  transition duration-300 "
              />
            </Link>
            <Link href={"/"}>
              <FaInstagramSquare
                size={24}
                className="text-red-500 hover:scale-125 transform  transition duration-300 "
              />
            </Link>
          </div>
        </div>
      </div>
      <div className="w-full absolute bottom-0 h-10 border border-gray-300 flex items-center justify-center">
        <h2 className="text-sm"> © 2025 NewMac All Rights Reserverd</h2>
      </div>
    </div>
  );
}

export default Footer;
