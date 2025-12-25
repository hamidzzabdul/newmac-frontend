import Image from "next/image";
import { Shield, Award, CheckCircle2 } from "lucide-react";

const certifications = [
  {
    id: 1,
    name: "Halal Certification",
    description: "Certified by Kenya Halal Board",
    img: "/certifications/halal-cert.jpg",
    issuedBy: "Kenya Halal Board",
    validUntil: "2026",
  },
  {
    id: 2,
    name: "Food Safety License",
    description: "Kenya Bureau of Standards Approved",
    img: "/certifications/kebs-cert.jpg",
    issuedBy: "KEBS",
    validUntil: "2026",
  },
  {
    id: 3,
    name: "Business License",
    description: "Nairobi County Government",
    img: "/certifications/business-license.jpg",
    issuedBy: "County Government",
    validUntil: "2025",
  },
  {
    id: 4,
    name: "Health Inspection",
    description: "Public Health Department Certified",
    img: "/certifications/health-cert.jpg",
    issuedBy: "Ministry of Health",
    validUntil: "2026",
  },
];

const Certifications = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 bg-green-50 text-green-700 font-semibold text-sm rounded-full mb-4">
            TRUST & QUALITY
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our <span className="text-red-600">Certifications</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            We maintain the highest standards of quality and safety. All our
            products are certified and comply with local and international
            regulations.
          </p>
        </div>
        {/* Certification Certificates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-gray-100 overflow-hidden"
            >
              {/* Certificate Image */}
              <div className="relative h-64 bg-linear-to-br from-gray-100 to-gray-200 overflow-hidden">
                <Image
                  src={cert.img}
                  alt={cert.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />

                {/* Verified Badge */}
                <div className="absolute top-3 right-3">
                  <div className="bg-green-600 rounded-full p-2 shadow-lg">
                    <CheckCircle2 className="text-white" size={20} />
                  </div>
                </div>
              </div>

              {/* Certificate Details */}
              <div className="p-5 space-y-2">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                  {cert.name}
                </h3>
                <p className="text-sm text-gray-600">{cert.description}</p>

                <div className="pt-3 border-t border-gray-100 space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500 font-medium">
                      Issued by:
                    </span>
                    <span className="text-gray-900 font-semibold">
                      {cert.issuedBy}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-linear-to-br from-green-50 to-green-100 rounded-xl p-6 text-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="text-white" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">100% Halal</h3>
            <p className="text-gray-600 text-sm">
              All our meat is slaughtered according to Islamic law and certified
              halal
            </p>
          </div>

          <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="text-white" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Licensed & Regulated
            </h3>
            <p className="text-gray-600 text-sm">
              Fully licensed by all relevant government authorities and
              regulatory bodies
            </p>
          </div>

          <div className="bg-linear-to-br from-red-50 to-red-100 rounded-xl p-6 text-center">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="text-white" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Health Approved
            </h3>
            <p className="text-gray-600 text-sm">
              Regular health inspections and compliance with food safety
              standards
            </p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 bg-linear-to-r from-red-600 to-red-700 rounded-2xl p-8 md:p-12 text-center text-white">
          <Shield className="mx-auto mb-4" size={48} />
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Your Trust is Our Priority
          </h3>
          <p className="text-red-100 text-lg max-w-2xl mx-auto mb-6">
            We maintain transparency in all our operations and welcome inquiries
            about our certifications and quality standards.
          </p>
          <a
            href="mailto:info@newmac.co.ke"
            className="inline-block px-8 py-4 bg-white text-red-600 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Contact Us for More Information
          </a>
        </div>
      </div>
    </section>
  );
};

export default Certifications;
