"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(data.message);
        setStep(2);
      } else {
        setError(data.error || "Failed to send OTP");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
    setLoading(false);
  };

  const handleVerifyAndReset = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      return setError("Passwords do not match");
    }

    if (newPassword.length < 4) {
      return setError("Password must be at least 4 characters long");
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, otp, newPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(data.message);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setError(data.error || "Failed to reset password");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen w-full bg-brand-light font-body">
      {/* Left Side - Brand Panel */}
      <div
        className="hidden w-1/2 flex-col justify-center bg-cover bg-center text-white lg:flex"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 170, 166, 0.8), rgba(0, 170, 166, 0.8)), url('/assets/auth-one-bg.webp')`,
        }}
      >
        <div className="relative z-10 max-w-md flex flex-col justify-center items-center">
          <img
            src="/assets/springhouse.webp"
            alt="logo"
            className="h-34 filter brightness-[11] pb-6"
          />
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="mb-2 font-heading text-3xl text-brand-dark">
              PASSWORD RESET
            </h2>
            <p className="text-gray-500">
              {step === 1 ? "Enter your username or email" : "Enter OTP and new password"}
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-md bg-red-50 border border-red-200 p-4 text-sm text-red-600">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-6 rounded-md bg-green-50 border border-green-200 p-4 text-sm text-green-600">
              {success}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Username or Email
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 transition focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  placeholder="Enter username or email"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full transform rounded-lg bg-brand-primary px-4 py-3 font-bold text-white transition hover:bg-teal-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:opacity-70"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </form>
          )}

          {step === 2 && (
             <form onSubmit={handleVerifyAndReset} className="space-y-6">
               <div>
                 <label className="mb-2 block text-sm font-semibold text-gray-700">
                   OTP (6-digit)
                 </label>
                 <input
                   type="text"
                   maxLength={6}
                   value={otp}
                   onChange={(e) => {
                     const val = e.target.value.replace(/\D/g, "");
                     setOtp(val);
                   }}
                   className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 tracking-widest transition focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                   placeholder="000000"
                   required
                 />
               </div>
               <div>
                 <label className="mb-2 block text-sm font-semibold text-gray-700">
                   New Password
                 </label>
                 <input
                   type="password"
                   value={newPassword}
                   onChange={(e) => setNewPassword(e.target.value)}
                   className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 transition focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                   placeholder="••••••••"
                   required
                 />
               </div>
               <div>
                 <label className="mb-2 block text-sm font-semibold text-gray-700">
                   Confirm New Password
                 </label>
                 <input
                   type="password"
                   value={confirmPassword}
                   onChange={(e) => setConfirmPassword(e.target.value)}
                   className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 transition focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                   placeholder="••••••••"
                   required
                 />
               </div>
               <button
                 type="submit"
                 disabled={loading}
                 className="w-full transform rounded-lg bg-brand-primary px-4 py-3 font-bold text-white transition hover:bg-teal-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:opacity-70"
               >
                 {loading ? "Resetting..." : "Reset Password"}
               </button>
             </form>
          )}

          <div className="mt-8 text-center text-sm font-medium">
             <Link href="/login" className="text-brand-primary hover:text-teal-700">
                Back to Login
             </Link>
          </div>
          
          <div className="mt-8 text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} SpringHouse. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}
