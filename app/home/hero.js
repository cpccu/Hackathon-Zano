import Link from "next/link";
import { auth } from "@/app/auth";

export default async function Hero() {
  const session = await auth();

  return (
    <section className="relative overflow-hidden py-20 md:py-32 px-4">
      {/* Glow Orbs / Accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#D32F2F]/25 via-slate-800/10 to-transparent blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto text-center space-y-8">
        {/* Animated Campus Status Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-slate-300 shadow-xl backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D32F2F]"></span>
          </span>
          <span>City University Bangladesh • Live Event Portal</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
          Elevate Your Campus Experience with{" "}
          <span className="bg-gradient-to-r from-red-500 via-red-400 to-[#D32F2F] bg-clip-text text-transparent">
            CampusOS
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
          The centralized Operating System for campus life. Discover upcoming workshops, 
          join university clubs, and register for events with instant QR pass check-ins.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/events"
            className="px-6 py-3.5 bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-red-900/30 flex items-center gap-2 group"
          >
            <span>Explore All Events</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>

          {!session?.user ? (
            <Link
              href="/signup"
              className="px-6 py-3.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 font-semibold text-sm rounded-xl transition-all backdrop-blur-md"
            >
              Create Account
            </Link>
          ) : (
            <Link
              href="/my-events"
              className="px-6 py-3.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 font-semibold text-sm rounded-xl transition-all backdrop-blur-md flex items-center gap-2"
            >
              🎟️ My Registrations
            </Link>
          )}
        </div>

        {/* Campus Stats Grid */}
        <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl backdrop-blur-md">
            <p className="text-2xl font-bold text-white">25+</p>
            <p className="text-xs text-slate-400 mt-0.5">Active Clubs</p>
          </div>
          <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl backdrop-blur-md">
            <p className="text-2xl font-bold text-white">100%</p>
            <p className="text-xs text-slate-400 mt-0.5">Digital Check-in</p>
          </div>
          <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl backdrop-blur-md">
            <p className="text-2xl font-bold text-white">5.2k+</p>
            <p className="text-xs text-slate-400 mt-0.5">Students</p>
          </div>
          <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl backdrop-blur-md">
            <p className="text-2xl font-bold text-white">Instant</p>
            <p className="text-xs text-slate-400 mt-0.5">QR Ticket Code</p>
          </div>
        </div>
      </div>
    </section>
  );
}