import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative border-t border-slate-800 bg-[#1E293B] text-slate-300 mt-20 overflow-hidden">
      {/* Ambient Red Glow Effects */}
      <div className="absolute top-0 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#D32F2F]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 translate-y-1/3 w-80 h-80 bg-slate-700/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 pt-12 pb-8 grid gap-8 md:grid-cols-4 text-sm">
        {/* Brand Column */}
        <div className="md:col-span-2 space-y-3">
          <Link href="/" className="inline-flex items-center group">
            <div className="flex items-center bg-slate-800/80 border border-slate-700/80 rounded-full pl-1.5 pr-4 py-1.5">
              <div className="relative w-9 h-9 rounded-full bg-white ring-2 ring-[#D32F2F] p-0.5 flex items-center justify-center overflow-hidden shrink-0">
                <Image
                  src="/images/logo.png"
                  alt="City University Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <div className="ml-3 flex items-center gap-2">
                <span className="text-white font-bold text-lg tracking-tight">
                  Campus<span className="text-[#D32F2F]">OS</span>
                </span>
                <span className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400 border-l border-slate-700 pl-2">
                  City Uni
                </span>
              </div>
            </div>
          </Link>
          <p className="text-slate-400 max-w-sm text-xs leading-relaxed pt-1">
            The single source of truth for campus life at City University. Access events, notes, helpdesk info, and lost items in one place.
          </p>
        </div>

        {/* Explore Links Column */}
        <div>
          <h4 className="font-semibold text-white tracking-wider text-xs uppercase border-b border-slate-800 pb-2 mb-3">
            Explore Modules
          </h4>
          <ul className="space-y-2">
            <li>
              <Link href="/events" className="text-slate-400 hover:text-white transition-colors hover:translate-x-0.5 inline-block">
                Events & RSVPs
              </Link>
            </li>
            <li>
              <Link href="/resources" className="text-slate-400 hover:text-white transition-colors hover:translate-x-0.5 inline-block">
                Resource Hub
              </Link>
            </li>
            <li>
              <Link href="/helpdesk" className="text-slate-400 hover:text-white transition-colors hover:translate-x-0.5 inline-block">
                Smart Helpdesk
              </Link>
            </li>
            <li>
              <Link href="/lost-found" className="text-slate-400 hover:text-white transition-colors hover:translate-x-0.5 inline-block">
                Lost & Found
              </Link>
            </li>
          </ul>
        </div>

        {/* Account Links Column */}
        <div>
          <h4 className="font-semibold text-white tracking-wider text-xs uppercase border-b border-slate-800 pb-2 mb-3">
            Account & Access
          </h4>
          <ul className="space-y-2">
            <li>
              <Link href="/login" className="text-slate-400 hover:text-white transition-colors hover:translate-x-0.5 inline-block">
                Login
              </Link>
            </li>
            <li>
              <Link href="/signup" className="text-[#D32F2F] hover:text-[#ff4d4d] font-medium transition-colors hover:translate-x-0.5 inline-block">
                Create Account →
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Sub-bar */}
      <div className="relative border-t border-slate-800/80 py-4 text-center text-xs text-slate-400 bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} CampusOS · Built for City University students</span>
          <span className="text-slate-400 font-medium">Single Source of Truth for Campus Life</span>
        </div>
      </div>
    </footer>
  );
}