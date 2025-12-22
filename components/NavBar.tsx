import {
  FaBars,
  FaInstagram,
  FaRegUser,
  FaSquareFacebook,
  FaUser,
} from "react-icons/fa6";
import { FaHamburger, FaTiktok } from "react-icons/fa";
import Link from "next/link";
import { IoBagOutline, IoSearchOutline } from "react-icons/io5";

function NavBar() {
  return (
    <div className="">
      <div className="w-full h-14 bg-red-500 flex items-center justify-center p-3">
        <div className="flex items-center justify-center gap-3">
          <h1 className="text-white font-semibold capitalize text-lg">
            Free delivery for order above 5,000 ksh
          </h1>
          {/* <h1 className="text-white font-semibold capitalize text-lg">
          Follow us on
          </h1>
          <div className="flex item-center gap-2">
          <Link href="" className="cursor-pointer">
          <FaSquareFacebook className="text-white" size={18} />
          </Link>
          <Link href="" className="cursor-pointer">
          <FaTiktok className="text-white" size={17} />
          </Link>
          <Link href="" className="cursor-pointer">
          <FaInstagram className="text-white" size={17} />
          </Link>
          </div> */}
        </div>
      </div>

      {/* primary navbar */}
      <div className="w-full bg-white shadow-md">
        <div className="lg:w-[80%] max-w-350 mx-auto flex items-center justify-between p-4">
          <div>
            <ul className="hidden md:flex item-center gap-4 text-black">
              <Link href={"/about-us"}>
                <li className="text-base font-semibold cursor-pointer border-b border-transparent  hover:border-gray-500 transition transform duration-300">
                  About
                </li>
              </Link>
              <Link href={"/shop"}>
                <li className="text-base font-semibold cursor-pointer border-b border-transparent hover:border-gray-500 transition transform duration-300">
                  Shop
                </li>
              </Link>
              <Link href={"/faqs"}>
                <li className="text-base font-semibold cursor-pointer border-b border-transparent  hover:border-gray-500 transition transform duration-300">
                  Faq&apos;s
                </li>
              </Link>
              <Link href={"/contact-us"}>
                <li className="text-base font-semibold cursor-pointer border-b border-transparent  hover:border-gray-500 transition transform duration-300">
                  Contact us
                </li>
              </Link>
            </ul>
            <FaBars
              className="block md:hidden  text-black cursor-pointer"
              size={18}
            />
          </div>
          <div className="px-3 py-2 flex items-center justify-center bg-black">
            <Link href={"/"}>
              <h1 className="text-lg font-semibold text-white">NewMac</h1>
            </Link>
          </div>
          <div className="flex items-center gap-4 text-black">
            <FaRegUser
              className="cursor-pointer hidden md:block hover:scale-120 transform transition duration-300"
              size={20}
            />
            <IoSearchOutline
              className="cursor-pointer hidden md:block hover:scale-120 transform transition duration-300"
              size={22}
            />
            <div className="relative hover:scale-120 transform transition duration-300">
              <IoBagOutline
                className="cursor-pointer hidden md:block "
                size={20}
              />

              <div className="w-4 h-4 absolute -top-1 -right-2.5 bg-red-500 flex item-center justify-center rounded-full  text-white ">
                <span className="text-[.55rem] flex items-center justify-center">
                  2
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
