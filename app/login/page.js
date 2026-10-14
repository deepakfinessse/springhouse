/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push("/admin");
      } else {
        const data = await res.json();
        setError(data.error || "Login failed");
        setLoading(false);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-brand-light font-body">
      {/* Left Side - Brand Panel */}
      <div
        className="hidden w-1/2 flex-col justify-center bg-cover bg-center  text-white lg:flex"
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

      {/* Right Side - Login Form */}
      <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="mb-2 font-heading text-3xl text-brand-dark">
              ADMIN LOGIN
            </h2>
            <p className="text-gray-500">Sign in to access your dashboard</p>
          </div>

          {error && (
            <div className="mb-6 rounded-md bg-red-50 border border-red-200 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 transition focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                placeholder="Enter your username"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 transition focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                placeholder="••••••••"
                required
              />
            </div>
            <div className="flex justify-end">
              <Link href="/login/forgot-password" className="text-sm font-medium text-brand-primary hover:text-teal-700">
                Forgot password?
              </Link>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full transform rounded-lg bg-brand-primary px-4 py-3 font-bold text-white transition hover:bg-teal-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 disabled:opacity-70"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} SpringHouse. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}
