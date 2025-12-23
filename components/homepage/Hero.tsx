import Link from "next/link";

const Hero = () => {
  return (
    <div
      className="w-full h-110 relative"
      style={{
        backgroundImage: "url('/homepage/hero.jpg')",
        background: "cover",
        backgroundPosition: "top",
        backgroundRepeat: "no-repeat",
        width: "100%",
      }}
    >
      <div className="absolute inset-0 bg-black/70"></div>

      <div className="w-[90%] mx-auto max-w-350">
        <div className="w-fit absolute top-[30%] left-[10%] flex flex-col gap-2">
          <span className="text-base text-red-500 font-bold">
            Quality Meat You Can Trust
          </span>
          <h1 className="text-4xl font-semibold capitalize text-white">
            Welcome to NewMac Online Butchery
          </h1>
          <p className="w-3/4 text-white text-xl font-semibold">
            Order premium beef, goat & lamb online and get it delivered same
            day.
          </p>
          <Link href={"/shop"} className="w-fit">
            <button className="mt-2 px-6 py-2 bg-red-500 text-white font-semibold rounded-md cursor-pointer text-lg">
              Shop Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
