"use client";
import {
  Truck,
  Shield,
  Award,
  Clock,
  Star,
  Users,
  CheckCircle,
  Leaf,
  Link,
} from "lucide-react";
import { useRouter } from "next/navigation";

const stats = [
  { number: "5,000+", label: "Happy customers" },
  { number: "1+", label: "Years in business" },
  { number: "100%", label: "Halal certified" },
  { number: "3", label: "Premium categories" },
];

const values = [
  {
    icon: Star,
    title: "Uncompromising quality",
    description:
      "Every product is hand-selected and inspected before it ever reaches our cold chain.",
  },
  {
    icon: CheckCircle,
    title: "Halal integrity",
    description:
      "Certified by recognised authorities — every product, every time, with full traceability.",
  },
  {
    icon: Clock,
    title: "Speed & freshness",
    description:
      "Same-day delivery isn't just a promise — it's how we maintain freshness from farm to fork.",
  },
  {
    icon: Users,
    title: "Community first",
    description:
      "We support local suppliers and give back to the communities that trust us.",
  },
];

const steps = [
  {
    number: "1",
    title: "Ethical sourcing",
    description:
      "We partner only with certified halal farms that meet our strict animal welfare and quality standards.",
  },
  {
    number: "2",
    title: "Expert butchery",
    description:
      "Skilled butchers prepare each cut to order — portioned, trimmed, and vacuum-sealed for freshness.",
  },
  {
    number: "3",
    title: "Cold-chain dispatch",
    description:
      "Orders are packed in temperature-controlled packaging and dispatched same day via our express network.",
  },
  {
    number: "4",
    title: "Delivered fresh",
    description:
      "Your order arrives chilled and ready — just open, cook, and enjoy the difference quality makes.",
  },
];

const team = [
  { initials: "AH", name: "Ahmed Hassan", role: "Founder & CEO" },
  { initials: "FA", name: "Fatima Ali", role: "Head of Quality & Compliance" },
  { initials: "OS", name: "Omar Sheikh", role: "Head of Logistics" },
  { initials: "ZK", name: "Zara Khan", role: "Customer Experience Lead" },
];

const certifications = [
  { title: "Halal Authority Board", subtitle: "Certified annually" },
  { title: "ISO 22000", subtitle: "Food safety management" },
  { title: "HACCP Compliant", subtitle: "Hazard analysis certified" },
  { title: "Cold Chain Assured", subtitle: "Temperature-controlled logistics" },
];

export default function AboutPage() {
  const router = useRouter();
  return (
    <main className="min-h-[calc(100vh-160px)]">
      {/* Hero */}
      <section className="relative bg-gradient-to-r from-red-600 to-red-700 text-white py-20 px-4 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/3" />
        <div className="relative md:w-[95%] max-w-350 mx-auto text-center">
          <span className="inline-block bg-white/15 text-white text-xs font-medium tracking-widest uppercase px-4 py-2 rounded-full mb-6">
            Our story
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-5 leading-tight">
            Premium halal meat,
            <br />
            delivered with care
          </h1>
          <p className="text-lg text-white/85 max-w-xl mx-auto leading-relaxed">
            We started with a simple mission — make it easy for every family to
            access fresh, certified halal meat without compromise on quality or
            convenience.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="md:w-[95%] max-w-350 mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-red-600 mb-3">
                Founded with purpose
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5 leading-snug">
                From a local butcher to your doorstep
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                What began as a small family butchery in 2026 has grown into a
                trusted online platform serving thousands of households. We
                noticed that finding genuinely fresh, halal-certified meat was
                still a challenge for many families — so we set out to change
                that.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Every cut we deliver is sourced from certified farms, handled
                with care, and dispatched same-day so it reaches you at its
                best. No shortcuts. No compromises.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-10 flex flex-col items-center justify-center text-center min-h-[220px]">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Leaf className="w-8 h-8 text-red-600" />
              </div>
              <p className="text-6xl font-bold text-red-600">2026</p>
              <p className="text-gray-500 text-sm mt-2">Year established</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gray-50 py-14 px-4">
        <div className="md:w-[95%] max-w-350 mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <p className="text-4xl font-bold text-red-600 mb-1">
                  {stat.number}
                </p>
                <p className="text-gray-500 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-20 bg-white">
        <div className="md:w-[95%] max-w-350 mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-widest uppercase text-red-600 mb-3">
              What drives us
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our values
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Everything we do is guided by a commitment to quality,
              transparency, and the trust our customers place in us every time
              they order.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <div
                  key={i}
                  className="bg-gray-50 border border-gray-100 rounded-xl p-6 hover:border-red-200 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="w-11 h-11 bg-red-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-600 transition-colors">
                    <Icon className="w-5 h-5 text-red-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Farm to Door Process */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="md:w-[95%] max-w-350 mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-widest uppercase text-red-600 mb-3">
              How it works
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              From farm to your front door
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Our sourcing and delivery process is built for transparency at
              every step.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {steps.map((step, i) => (
              <div
                key={i}
                className="bg-white border border-gray-100 rounded-xl p-6 flex gap-4 hover:shadow-md transition-shadow cursor-default"
              >
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-sm flex-shrink-0 mt-0.5">
                  {step.number}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {step.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="md:w-[95%] max-w-350 mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-widest uppercase text-red-600 mb-3">
              Trusted & certified
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our certifications
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              We hold rigorous certification across every stage of our supply
              chain so you can buy with complete confidence.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {certifications.map((cert, i) => (
              <div
                key={i}
                className="bg-white border border-gray-100 rounded-xl p-5 flex items-start gap-3 hover:border-red-200 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-red-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {cert.title}
                  </p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    {cert.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="md:w-[95%] max-w-350 mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Ready to taste the difference?
          </h2>
          <p className="text-lg md:text-xl mb-8 opacity-90 max-w-xl mx-auto">
            Join over 5,000 families who trust us for fresh, halal-certified
            meat delivered right to their door.
          </p>
          <button
            className="bg-white text-red-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            onClick={() => router.push("/shop")}
          >
            Shop Now
          </button>
        </div>
      </section>
    </main>
  );
}
