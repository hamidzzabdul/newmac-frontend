import { Mail, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaFacebookSquare, FaInstagramSquare } from "react-icons/fa";
import { FaPhone, FaTiktok } from "react-icons/fa6";
import Logo from "@/public/logo.jpeg";

function Footer() {
  return (
    <footer className="w-full bg-linear-to-b from-gray-900 to-black text-gray-300 ">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-8 border-b border-gray-800">
          {/* Brand Section */}
          <div className="flex flex-col gap-4">
            <div className="inline-block w-fit">
              <Link href="/">
                <div className=" w-67.5 overflow-hidden">
                  <Image
                    src={Logo}
                    alt="newmark logo"
                    width={2000}
                    height={2000}
                    className="w-[90%] h-full"
                  />
                </div>
              </Link>
            </div>
            <p className="text-red-400 font-semibold italic text-sm">
              Quality Meat You Can Trust
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Premium cuts delivered fresh to your door. Your trusted partner
              for quality meat in Nairobi.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white text-lg font-bold">Quick Links</h3>
            <ul className="flex flex-col gap-3">
              <li>
                <Link
                  href="/shop"
                  className="text-gray-400 hover:text-red-500 transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="w-0 h-0.5 bg-red-500 group-hover:w-4 transition-all duration-300"></span>
                  Shop Products
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="text-gray-400 hover:text-red-500 transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="w-0 h-0.5 bg-red-500 group-hover:w-4 transition-all duration-300"></span>
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link
                  href="/orders"
                  className="text-gray-400 hover:text-red-500 transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="w-0 h-0.5 bg-red-500 group-hover:w-4 transition-all duration-300"></span>
                  Order History
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-red-500 transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="w-0 h-0.5 bg-red-500 group-hover:w-4 transition-all duration-300"></span>
                  Contact us
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Info */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white text-lg font-bold">Company</h3>
            <ul className="flex flex-col gap-3">
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-red-500 transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="w-0 h-0.5 bg-red-500 group-hover:w-4 transition-all duration-300"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-gray-400 hover:text-red-500 transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="w-0 h-0.5 bg-red-500 group-hover:w-4 transition-all duration-300"></span>
                  FAQ&apos;s
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-gray-400 hover:text-red-500 transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="w-0 h-0.5 bg-red-500 group-hover:w-4 transition-all duration-300"></span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-service"
                  className="text-gray-400 hover:text-red-500 transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="w-0 h-0.5 bg-red-500 group-hover:w-4 transition-all duration-300"></span>
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white text-lg font-bold">Get In Touch</h3>
            <div className="flex flex-col gap-3">
              <a
                href="tel:+254706328544"
                className="flex items-center gap-3 text-gray-400 hover:text-red-500 transition-colors group"
              >
                <div className="p-2 bg-gray-800 rounded-md group-hover:bg-red-600 transition-colors">
                  <FaPhone
                    size={14}
                    className="text-red-500 group-hover:text-white"
                  />
                </div>
                <span className="text-sm">+254 700 876 201</span>
              </a>

              <a
                href="mailto:newmark.primecuts@gmail.com"
                className="flex items-center gap-3 text-gray-400 hover:text-red-500 transition-colors group"
              >
                <div className="p-2 bg-gray-800 rounded-md group-hover:bg-red-600 transition-colors">
                  <Mail
                    size={16}
                    className="text-red-500 group-hover:text-white"
                  />
                </div>
                <span className="text-sm">newmark.primecut@gmail.com</span>
              </a>

              <div className="flex items-center gap-3 text-gray-400">
                <div className="p-2 bg-gray-800 rounded-md">
                  <MapPin size={16} className="text-red-500" />
                </div>
                <span className="text-sm">
                  Nairobi, Kenya Bishan Plaza Westlands
                </span>
              </div>
            </div>

            {/* Social Media */}
            <div className="mt-2">
              <p className="text-white text-sm font-semibold mb-3">Follow Us</p>
              <div className="flex items-center gap-3">
                <Link
                  href="/"
                  className="p-2 bg-gray-800 rounded-md hover:bg-red-600 transition-all duration-300 group"
                >
                  <FaTiktok
                    size={20}
                    className="text-gray-400 group-hover:text-white transition-colors"
                  />
                </Link>
                <Link
                  href="/"
                  className="p-2 bg-gray-800 rounded-md hover:bg-red-600 transition-all duration-300 group"
                >
                  <FaFacebookSquare
                    size={20}
                    className="text-gray-400 group-hover:text-white transition-colors"
                  />
                </Link>
                <Link
                  href="/"
                  className="p-2 bg-gray-800 rounded-md hover:bg-red-600 transition-all duration-300 group"
                >
                  <FaInstagramSquare
                    size={20}
                    className="text-gray-400 group-hover:text-white transition-colors"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} NewMark. All Rights Reserved.</p>
          <div className="flex gap-6">
            <Link
              href="/privacy-policy"
              className="hover:text-red-500 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms-of-service"
              className="hover:text-red-500 transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/cookies"
              className="hover:text-red-500 transition-colors"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
