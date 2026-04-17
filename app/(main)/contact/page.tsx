"use client";

import { useState } from "react";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaWhatsapp,
  FaFacebook,
  FaInstagram,
} from "react-icons/fa";
import { FaTiktok } from "react-icons/fa6";
import { IoSend } from "react-icons/io5";

import { sendContactMessage } from "@/lib/api/contact";
import toast from "react-hot-toast";

function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess(false);

    const loadingToast = toast.loading("Sending message...");

    try {
      await sendContactMessage(formData);

      toast.success("Message sent successfully!", {
        id: loadingToast,
      });

      setSubmitSuccess(true);

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });

      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error: any) {
      toast.error(error.message || "Failed to send message", {
        id: loadingToast,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-red-50">
      {/* Hero Section with Curve */}
      <div className="relative bg-linear-to-r from-red-600 to-red-700 text-white pb-32 pt-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Let's Start a Conversation
            </h1>
            <p className="text-lg text-red-100">
              We're here to help you with anything you need. Reach out and let's
              talk about premium quality meats.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <path
              d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z"
              fill="white"
            />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-10 pb-16">
        {/* Contact Cards - Floating Style */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
            <div className="w-16 h-16 bg-linear-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <FaPhone className="text-white text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Call Us</h3>
            <p className="text-gray-600 mb-4 text-sm">
              Mon-Sat: 7:00 AM - 8:00 PM
            </p>
            <a
              href="tel:+254701347191"
              className="text-red-600 font-semibold hover:text-red-700 cursor-pointer inline-flex items-center gap-2 group"
            >
              +254 701 347 191
              <span className="group-hover:translate-x-1 transition-transform">
                →
              </span>
            </a>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
            <div className="w-16 h-16 bg-linear-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <FaEnvelope className="text-white text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Email Us</h3>
            <p className="text-gray-600 mb-4 text-sm">
              Response within 24 hours
            </p>
            <a
              href="mailto:  newmark.primecuts@gmail.com
"
              className="text-red-600 font-semibold hover:text-red-700 cursor-pointer inline-flex items-center gap-2 group"
            >
              newmark.primecuts@gmail.com
              <span className="group-hover:translate-x-1 transition-transform">
                →
              </span>
            </a>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
            <div className="w-16 h-16 bg-linear-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <FaMapMarkerAlt className="text-white text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Visit Us</h3>
            <p className="text-gray-600 mb-4 text-sm">Come see our store</p>
            <p className="text-red-600 font-semibold">Nairobi, Kenya</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Contact Form - 3/5 width */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Send a Message
              </h2>
              <p className="text-gray-600 mb-8">
                Fill out the form below and we'll get back to you soon.
              </p>

              {submitSuccess && (
                <div className="mb-8 p-5 bg-linear-to-r from-green-50 to-green-100 rounded-2xl border-l-4 border-green-500">
                  <p className="font-semibold text-green-800 mb-1">
                    Message sent successfully! 🎉
                  </p>
                  <p className="text-sm text-green-700">
                    We'll respond to your inquiry within 24 hours.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all cursor-text bg-gray-50 focus:bg-white"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all cursor-text bg-gray-50 focus:bg-white"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all cursor-text bg-gray-50 focus:bg-white"
                      placeholder="+254 700 000 000"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all cursor-pointer bg-gray-50 focus:bg-white"
                    >
                      <option value="">Select a subject</option>
                      <option value="order">Order Inquiry</option>
                      <option value="delivery">Delivery Question</option>
                      <option value="product">Product Information</option>
                      <option value="complaint">Complaint</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none cursor-text bg-gray-50 focus:bg-white"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-linear-to-r from-red-600 to-red-700 text-white font-semibold py-4 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <IoSend className="text-lg" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar - 2/5 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Business Hours Card */}
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <FaClock className="text-red-600 text-xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Business Hours
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-700 font-medium">Mon - Fri</span>
                  <span className="text-gray-900 font-semibold">7AM - 6PM</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-700 font-medium">Saturday</span>
                  <span className="text-gray-900 font-semibold">8AM - 2PM</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-700 font-medium">Sunday</span>
                  <span className="text-red-600 font-semibold">Closed</span>
                </div>
              </div>
            </div>

            {/* Social Media Card */}
            <div className="bg-linear-to-br from-red-600 to-red-700 rounded-3xl p-8 shadow-lg text-white">
              <h3 className="text-xl font-bold mb-3">Connect With Us</h3>
              <p className="text-red-100 mb-6 text-sm">
                Follow us for updates, recipes, and special offers.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href="https://wa.me/254700876201"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-white/20 hover:bg-white/30 rounded-2xl transition-all cursor-pointer backdrop-blur-sm"
                >
                  <FaWhatsapp className="text-white text-2xl" />
                  <span className="font-medium text-sm">WhatsApp</span>
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-white/20 hover:bg-white/30 rounded-2xl transition-all cursor-pointer backdrop-blur-sm"
                >
                  <FaFacebook className="text-white text-2xl" />
                  <span className="font-medium text-sm">Facebook</span>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-white/20 hover:bg-white/30 rounded-2xl transition-all cursor-pointer backdrop-blur-sm"
                >
                  <FaInstagram className="text-white text-2xl" />
                  <span className="font-medium text-sm">Instagram</span>
                </a>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-white/20 hover:bg-white/30 rounded-2xl transition-all cursor-pointer backdrop-blur-sm"
                >
                  <FaTiktok className="text-white text-2xl" />
                  <span className="font-medium text-sm">TikTok</span>
                </a>
              </div>
            </div>

            {/* Quick Call Card */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-red-100">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Need Help Now?
              </h3>
              <p className="text-gray-600 mb-5 text-sm">
                Call us for immediate assistance with orders or delivery.
              </p>
              <a
                href="tel:+254700876201"
                className="flex items-center justify-center gap-2 px-6 py-4 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors cursor-pointer"
              >
                <FaPhone className="text-lg" />
                0700 876 201
              </a>
              <br />
              <a
                href="tel:+254701347191"
                className="flex items-center justify-center gap-2 px-6 py-4 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors cursor-pointer"
              >
                <FaPhone className="text-lg" />
                0701 347 191
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
