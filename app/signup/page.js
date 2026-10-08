"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = Object.fromEntries(new FormData(e.target));

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Signup failed");
        setLoading(false);
        return;
      }

      router.push("/login");
    } catch (err) {
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        {/* Glow accent bar at top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D32F2F] to-transparent" />

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-white ring-2 ring-[#D32F2F] p-0.5 mb-3 flex items-center justify-center">
            <Image
              src="/images/logo.png"
              alt="City University Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Create Account</h1>
          <p className="text-xs text-slate-400 mt-1">Join CampusOS to access events & resources</p>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Full Name *
            </label>
            <input
              name="name"
              type="text"
              placeholder="e.g. Tanvir Ahmed"
              required
              className="w-full bg-slate-800/90 border border-slate-700 focus:border-[#D32F2F] focus:ring-1 focus:ring-[#D32F2F] text-white text-sm rounded-lg px-3.5 py-2.5 outline-none transition-all placeholder:text-slate-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              University Email *
            </label>
            <input
              name="email"
              type="email"
              placeholder="student@cu.edu"
              required
              className="w-full bg-slate-800/90 border border-slate-700 focus:border-[#D32F2F] focus:ring-1 focus:ring-[#D32F2F] text-white text-sm rounded-lg px-3.5 py-2.5 outline-none transition-all placeholder:text-slate-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Student ID
              </label>
              <input
                name="studentId"
                type="text"
                placeholder="CU-0001"
                className="w-full bg-slate-800/90 border border-slate-700 focus:border-[#D32F2F] focus:ring-1 focus:ring-[#D32F2F] text-white text-sm rounded-lg px-3.5 py-2.5 outline-none transition-all placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Department
              </label>
              <input
                name="department"
                type="text"
                placeholder="CSE / BBA"
                className="w-full bg-slate-800/90 border border-slate-700 focus:border-[#D32F2F] focus:ring-1 focus:ring-[#D32F2F] text-white text-sm rounded-lg px-3.5 py-2.5 outline-none transition-all placeholder:text-slate-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Password *
            </label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              required
              className="w-full bg-slate-800/90 border border-slate-700 focus:border-[#D32F2F] focus:ring-1 focus:ring-[#D32F2F] text-white text-sm rounded-lg px-3.5 py-2.5 outline-none transition-all placeholder:text-slate-500"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-950/80 border border-red-800/50 text-red-300 text-xs rounded-lg text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-semibold py-2.5 rounded-lg transition-colors shadow-lg shadow-red-900/20 disabled:opacity-50 text-sm"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 text-center text-xs text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="text-[#D32F2F] hover:underline font-semibold ml-1">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}