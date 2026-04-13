"use client";

import { useEffect, useState } from "react";
import {
  X,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  Loader2,
  ShieldCheck,
  CheckCircle2,
  KeyRound,
} from "lucide-react";
import { api } from "@/lib/api/client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { parseApiError } from "@/utils/helper";
import OTPInput from "./ui/OTPInput";

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

const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
});

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type AuthView =
  | "login"
  | "register"
  | "verifySignupOtp"
  | "forgotPassword"
  | "resetPassword";

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
  const [view, setView] = useState<AuthView>(defaultTab);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const [pendingName, setPendingName] = useState("");
  const [message, setMessage] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState("");
  const [resendCoolDown, setResendCoolDown] = useState(0);
  const [successState, setSuccessState] = useState<{
    open: boolean;
    title: string;
    subtitle: string;
  }>({
    open: false,
    title: "",
    subtitle: "",
  });

  const resetOtpState = () => {
    setOtpValue("");
    setOtpError("");
  };

  useEffect(() => {
    if (isOpen) {
      setView(defaultTab);
      setMessage("");
      resetOtpState(); // ✅ add this
    }
  }, [isOpen, defaultTab]);

  useEffect(() => {
    if (resendCoolDown <= 0) return;
    const timer = setInterval(() => {
      setResendCoolDown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  });

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

  const forgotPasswordForm = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const resetPasswordForm = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const inputBase =
    "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pl-11 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all duration-200";

  const clearInlineMessage = () => setMessage("");

  const showSuccessThenClose = async (
    title: string,
    subtitle: string,
    user: {
      fullName: string;
      email: string;
      token?: string;
      role: string;
    },
  ) => {
    setSuccessState({
      open: true,
      title,
      subtitle,
    });

    setTimeout(() => {
      onLoginSuccess(user);
      setSuccessState({
        open: false,
        title: "",
        subtitle: "",
      });
      onClose();
    }, 1400);
  };

  const handleLoginSubmit = loginForm.handleSubmit(async (data) => {
    setLoading(true);
    clearInlineMessage();

    try {
      const res = await api.post("/users/login", data);

      onLoginSuccess({
        fullName: res.data.user.name,
        email: res.data.user.email,
        token: res.token,
        role: res.data.user.role,
      });

      onClose();
    } catch (err: any) {
      const response = err?.response?.data;
      const errorMessage = parseApiError(err, "Login failed");

      if (response?.requiresVerification) {
        setPendingEmail(response?.data?.email || data.email);
        setView("verifySignupOtp");
        resetOtpState();
        setMessage(
          "Your account is not verified yet. Enter the OTP sent to your email.",
        );
      } else {
        loginForm.setError("email", {
          message: errorMessage,
        });
      }
    } finally {
      setLoading(false);
    }
  });

  const handleRegisterSubmit = registerForm.handleSubmit(async (data) => {
    setLoading(true);
    clearInlineMessage();

    try {
      await api.post("/users/signup", {
        name: data.fullName,
        email: data.email,
        password: data.password,
        passwordConfirm: data.confirmPassword,
      });

      setPendingEmail(data.email);
      setPendingName(data.fullName);
      setView("verifySignupOtp");
      resetOtpState();
      setResendCoolDown(60);
      setMessage("We sent a verification code to your email. Enter it below.");
    } catch (err: any) {
      registerForm.setError("email", {
        message: parseApiError(err, "Registration failed"),
      });
    } finally {
      setLoading(false);
    }
  });

  const handleVerifySignupOtp = async () => {
    clearInlineMessage();
    setOtpError("");

    if (otpValue.length !== 6) {
      setOtpError("OTP must be 6 digits");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/users/verify-signup-otp", {
        email: pendingEmail,
        otp: otpValue,
      });

      await showSuccessThenClose(
        "Account verified",
        "Your email has been confirmed successfully. Signing you in now.",
        {
          fullName: res.data.user.name || pendingName,
          email: res.data.user.email || pendingEmail,
          token: res.token,
          role: res.data.user.role,
        },
      );

      onClose();
    } catch (err: any) {
      setOtpError(parseApiError(err, "OTP verification failed"));
    } finally {
      setLoading(false);
    }
  };
  const handleForgotPassword = forgotPasswordForm.handleSubmit(async (data) => {
    setLoading(true);
    clearInlineMessage();

    try {
      await api.post("/users/forgotPassword", {
        email: data.email,
      });

      setPendingEmail(data.email);
      setView("resetPassword");
      resetOtpState();
      setResendCoolDown(60);
      setMessage("We sent a password reset OTP to your email.");
    } catch (err: any) {
      forgotPasswordForm.setError("email", {
        message: parseApiError(err, "Could not send reset OTP"),
      });
    } finally {
      setLoading(false);
    }
  });
  const handleResetPassword = resetPasswordForm.handleSubmit(async (data) => {
    clearInlineMessage();
    setOtpError("");

    if (otpValue.length !== 6) {
      setOtpError("OTP must be 6 digits");
      return;
    }

    setLoading(true);

    try {
      const res = await api.patch("/users/resetPassword-with-otp", {
        email: pendingEmail,
        otp: otpValue,
        password: data.password,
        passwordConfirm: data.confirmPassword,
      });

      await showSuccessThenClose(
        "Password updated",
        "Your password has been reset successfully. Signing you in now.",
        {
          fullName: res.data.user.name,
          email: res.data.user.email,
          token: res.token,
          role: res.data.user.role,
        },
      );

      onClose();
    } catch (err: any) {
      setOtpError(parseApiError(err, "Could not reset password"));
    } finally {
      setLoading(false);
    }
  });

  const handleResendSignupOtp = async () => {
    if (!pendingEmail) return;

    setLoading(true);
    clearInlineMessage();

    try {
      await api.post("/users/resend-signup-otp", {
        email: pendingEmail,
      });
      setResendCoolDown(60);
      setMessage("A new OTP has been sent to your email.");
    } catch (err: any) {
      setMessage(err?.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const titleMap: Record<AuthView, string> = {
    login: "Welcome back",
    register: "Create account",
    verifySignupOtp: "Verify your account",
    forgotPassword: "Forgot password",
    resetPassword: "Reset password",
  };

  const subtitleMap: Record<AuthView, string> = {
    login: "Sign in to continue to your account",
    register: "Join us and start shopping today",
    verifySignupOtp: "Enter the OTP sent to your email",
    forgotPassword: "We’ll send a reset code to your email",
    resetPassword: "Enter your OTP and choose a new password",
  };

  const activeTitle = titleMap[view];
  const activeSubtitle = subtitleMap[view];

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-4"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-modal-in">
        <div className="h-1 w-full bg-linear-to-r from-red-600 via-red-500 to-rose-400" />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all cursor-pointer z-10"
        >
          <X size={18} />
        </button>
        {successState.open ? (
          <div className="px-8 py-14 flex flex-col items-center justify-center text-center min-h-105">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-5 animate-success-pop">
              <CheckCircle2 className="text-green-600" size={40} />
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {successState.title}
            </h3>

            <p className="text-sm text-gray-500 max-w-sm">
              {successState.subtitle}
            </p>
          </div>
        ) : (
          <div className="px-8 pt-8 pb-10">
            <div className="mb-8">
              <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-red-200">
                {view === "verifySignupOtp" ? (
                  <ShieldCheck className="text-white" size={22} />
                ) : view === "forgotPassword" || view === "resetPassword" ? (
                  <KeyRound className="text-white" size={22} />
                ) : (
                  <User className="text-white" size={22} />
                )}
              </div>

              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                {activeTitle}
              </h2>
              <p className="text-sm text-gray-500 mt-1">{activeSubtitle}</p>
            </div>

            {(view === "login" || view === "register") && (
              <div className="flex bg-gray-100 rounded-xl p-1 mb-7">
                {(["login", "register"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setView(t);
                      clearInlineMessage();
                    }}
                    className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                      view === t
                        ? "bg-white text-red-600 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {t === "login" ? "Sign In" : "Register"}
                  </button>
                ))}
              </div>
            )}

            {message && (
              <div className="mb-4 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
                {message}
              </div>
            )}

            {view === "login" && (
              <div className="space-y-4">
                <div>
                  <div className="relative">
                    <Mail
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      size={16}
                    />
                    <input
                      type="email"
                      placeholder="Email address"
                      {...loginForm.register("email")}
                      className={inputBase}
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-red-500 pl-1">
                    {loginForm.formState.errors.email?.message}
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
                      {...loginForm.register("password")}
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
                    {loginForm.formState.errors.password?.message}
                  </p>
                </div>

                <div className="flex justify-end -mt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setView("forgotPassword");
                      clearInlineMessage();
                    }}
                    className="text-xs text-red-600 hover:text-red-700 font-medium cursor-pointer transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  onClick={handleLoginSubmit}
                  disabled={loading}
                  className="mt-2 w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-red-200 hover:shadow-red-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

                <p className="mt-5 text-center text-sm text-gray-500">
                  Don&apos;t have an account?{" "}
                  <button
                    onClick={() => {
                      setView("register");
                      clearInlineMessage();
                    }}
                    className="text-red-600 font-semibold hover:text-red-700 cursor-pointer transition-colors"
                  >
                    Register
                  </button>
                </p>
              </div>
            )}

            {view === "register" && (
              <div className="space-y-4">
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

                <div>
                  <div className="relative">
                    <Mail
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      size={16}
                    />
                    <input
                      type="email"
                      placeholder="Email address"
                      {...registerForm.register("email")}
                      className={inputBase}
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-red-500 pl-1">
                    {registerForm.formState.errors.email?.message}
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
                      {...registerForm.register("password")}
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
                    {registerForm.formState.errors.password?.message}
                  </p>
                </div>

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

                <button
                  onClick={handleRegisterSubmit}
                  disabled={loading}
                  className="mt-2 w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-red-200 hover:shadow-red-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

                <p className="mt-5 text-center text-sm text-gray-500">
                  Already have an account?{" "}
                  <button
                    onClick={() => {
                      setView("login");
                      resetOtpState();
                      clearInlineMessage();
                    }}
                    className="text-red-600 font-semibold hover:text-red-700 cursor-pointer transition-colors"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            )}

            {view === "verifySignupOtp" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">
                    Email
                  </label>
                  <div className="rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-gray-700">
                    {pendingEmail}
                  </div>
                </div>

                <div className="space-y-2 py-1">
                  <OTPInput
                    value={otpValue}
                    onChange={(val) => {
                      setOtpValue(val);
                      if (otpError) setOtpError("");
                    }}
                    error={!!otpError}
                    disabled={loading}
                  />

                  {otpError ? (
                    <p className="pl-1 text-xs text-red-500">{otpError}</p>
                  ) : null}
                </div>

                <button
                  onClick={handleVerifySignupOtp}
                  disabled={loading}
                  className="mt-2 w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-red-200 hover:shadow-red-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      <span>Verify Account</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={handleResendSignupOtp}
                    disabled={loading || resendCoolDown > 0}
                    className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-semibold transition-all ${
                      loading || resendCoolDown > 0
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer"
                    }`}
                  >
                    {resendCoolDown > 0
                      ? `Resend in ${resendCoolDown}s`
                      : "Resend OTP"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setView("login");
                      resetOtpState();
                      clearInlineMessage();
                    }}
                    className="text-sm text-gray-500 hover:text-gray-700 font-medium cursor-pointer transition-colors"
                  >
                    Back to Sign In
                  </button>
                </div>
              </div>
            )}

            {view === "forgotPassword" && (
              <div className="space-y-4">
                <div>
                  <div className="relative">
                    <Mail
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      size={16}
                    />
                    <input
                      type="email"
                      placeholder="Email address"
                      {...forgotPasswordForm.register("email")}
                      className={inputBase}
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-red-500 pl-1">
                    {forgotPasswordForm.formState.errors.email?.message}
                  </p>
                </div>

                <button
                  onClick={handleForgotPassword}
                  disabled={loading}
                  className="mt-2 w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-red-200 hover:shadow-red-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      <span>Send Reset Code</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

                <p className="mt-5 text-center text-sm text-gray-500">
                  Remember your password?{" "}
                  <button
                    onClick={() => {
                      setView("login");
                      resetOtpState();
                      clearInlineMessage();
                    }}
                    className="text-red-600 font-semibold hover:text-red-700 cursor-pointer transition-colors"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            )}

            {view === "resetPassword" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">
                    Email
                  </label>
                  <div className="rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-gray-700">
                    {pendingEmail}
                  </div>
                </div>

                <div className="space-y-2 py-1">
                  <OTPInput
                    value={otpValue}
                    onChange={(val) => {
                      setOtpValue(val);
                      if (otpError) setOtpError("");
                    }}
                    error={!!otpError}
                    disabled={loading}
                  />

                  {otpError ? (
                    <p className="pl-1 text-xs text-red-500">{otpError}</p>
                  ) : null}
                </div>

                <div>
                  <div className="relative">
                    <Lock
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      size={16}
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="New password"
                      {...resetPasswordForm.register("password")}
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
                    {resetPasswordForm.formState.errors.password?.message}
                  </p>
                </div>

                <div>
                  <div className="relative">
                    <Lock
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      size={16}
                    />
                    <input
                      type={showConfirm ? "text" : "password"}
                      placeholder="Confirm new password"
                      {...resetPasswordForm.register("confirmPassword")}
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
                    {
                      resetPasswordForm.formState.errors.confirmPassword
                        ?.message
                    }
                  </p>
                </div>

                <button
                  onClick={handleResetPassword}
                  disabled={loading}
                  className="mt-2 w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-red-200 hover:shadow-red-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      <span>Reset Password</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

                <p className="mt-5 text-center text-sm text-gray-500">
                  Back to{" "}
                  <button
                    onClick={() => {
                      setView("login");
                      resetOtpState();
                      clearInlineMessage();
                    }}
                    className="text-red-600 font-semibold hover:text-red-700 cursor-pointer transition-colors"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap");

        @keyframes success-pop {
          0% {
            opacity: 0;
            transform: scale(0.75);
          }
          60% {
            opacity: 1;
            transform: scale(1.08);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-success-pop {
          animation: success-pop 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
