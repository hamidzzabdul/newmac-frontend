"use client";

import { useState } from "react";
import {
  X,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { api } from "@/lib/api/client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { parseRegisterError } from "@/utils/helper";

// Zod Schemas
const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z
  .object({
    fullName: z.string().min(1, "Full name is required"),
    email: z.string().min(1, "Email is required").email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "login" | "register";
  onLoginSuccess: (user: {
    fullName: string;
    email: string;
    token?: string;
    role: string;
  }) => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  defaultTab = "login",
  onLoginSuccess,
}: AuthModalProps) {
  const [tab, setTab] = useState<"login" | "register">(defaultTab);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  // React Hook Form
  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleLoginSubmit = loginForm.handleSubmit(async (data) => {
    setLoading(true);
    try {
      const res = await api.post("/users/login", data);

      onLoginSuccess({
        fullName: res.data.user.name, // or .name — match your backend
        email: res.data.user.email,
        token: res.token, // ✅
        role: res.data.user.role, // ✅
      });
      onClose();
    } catch (err: any) {
      loginForm.setError("email", { message: err.message || "Login failed" });
      console.error(err);
    } finally {
      setLoading(false);
    }
  });

  const handleRegisterSubmit = registerForm.handleSubmit(async (data) => {
    setLoading(true);
    try {
      const res = await api.post("/users/signup", {
        name: data.fullName,
        email: data.email,
        password: data.password,
        passwordConfirm: data.confirmPassword,
      });

      onLoginSuccess({
        fullName: res.data.user.fullName, // or .name — match your backend
        email: res.data.user.email,
        token: res.token, // ✅
        role: res.data.user.role, // ✅
      });
      onClose();
    } catch (err: any) {
      registerForm.setError("email", { message: parseRegisterError(err) });
    } finally {
      setLoading(false);
    }
  });

  const inputBase =
    "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pl-11 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all duration-200";

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-modal-in">
        <div className="h-1 w-full bg-gradient-to-r from-red-600 via-red-500 to-rose-400" />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all cursor-pointer z-10"
        >
          <X size={18} />
        </button>

        <div className="px-8 pt-8 pb-10">
          {/* Header */}
          <div className="mb-8">
            <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-red-200">
              <User className="text-white" size={22} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              {tab === "login" ? "Welcome back" : "Create account"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {tab === "login"
                ? "Sign in to continue to your account"
                : "Join us and start shopping today"}
            </p>
          </div>

          {/* Tab switcher */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-7">
            {(["login", "register"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                  tab === t
                    ? "bg-white text-red-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {t === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {tab === "register" && (
              <div>
                <div className="relative">
                  <User
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="Full name"
                    {...registerForm.register("fullName")}
                    className={inputBase}
                  />
                </div>
                <p className="mt-1.5 text-xs text-red-500 pl-1">
                  {registerForm.formState.errors.fullName?.message}
                </p>
              </div>
            )}

            <div>
              <div className="relative">
                <Mail
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="email"
                  placeholder="Email address"
                  {...(tab === "login"
                    ? loginForm.register("email")
                    : registerForm.register("email"))}
                  className={inputBase}
                />
              </div>
              <p className="mt-1.5 text-xs text-red-500 pl-1">
                {tab === "login"
                  ? loginForm.formState.errors.email?.message
                  : registerForm.formState.errors.email?.message}
              </p>
            </div>

            <div>
              <div className="relative">
                <Lock
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  {...(tab === "login"
                    ? loginForm.register("password")
                    : registerForm.register("password"))}
                  className={`${inputBase} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="mt-1.5 text-xs text-red-500 pl-1">
                {tab === "login"
                  ? loginForm.formState.errors.password?.message
                  : registerForm.formState.errors.password?.message}
              </p>
            </div>

            {tab === "register" && (
              <div>
                <div className="relative">
                  <Lock
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm password"
                    {...registerForm.register("confirmPassword")}
                    className={`${inputBase} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <p className="mt-1.5 text-xs text-red-500 pl-1">
                  {registerForm.formState.errors.confirmPassword?.message}
                </p>
              </div>
            )}

            {tab === "login" && (
              <div className="flex justify-end -mt-1">
                <button className="text-xs text-red-600 hover:text-red-700 font-medium cursor-pointer transition-colors">
                  Forgot password?
                </button>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            onClick={tab === "login" ? handleLoginSubmit : handleRegisterSubmit}
            disabled={loading}
            className="mt-7 w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-red-200 hover:shadow-red-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                <span>{tab === "login" ? "Sign In" : "Create Account"}</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>

          {/* Switch tab CTA */}
          <p className="mt-5 text-center text-sm text-gray-500">
            {tab === "login"
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <button
              onClick={() => setTab(tab === "login" ? "register" : "login")}
              className="text-red-600 font-semibold hover:text-red-700 cursor-pointer transition-colors"
            >
              {tab === "login" ? "Register" : "Sign In"}
            </button>
          </p>
        </div>
      </div>

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap");

        @keyframes modal-in {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-modal-in {
          animation: modal-in 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
