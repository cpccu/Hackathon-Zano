import Link from "next/link";
import { auth } from "@/app/auth";

const infoList = [
  { icon: "📢", text: "Official notices and exam routines" },
  { icon: "🎉", text: "Club events, contests and seminars" },
  { icon: "🚌", text: "Shuttle bus routes and timings" },
  { icon: "📚", text: "Past papers, notes and lab manuals" },
  { icon: "📖", text: "University rules, attendance and exam FAQs" },
  { icon: "🔍", text: "Lost and found, plus complaint tracking" },
];

export default async function JoinUs() {
  const session = await auth();
  if (session?.user) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 pb-20">
      <div className="relative overflow-hidden rounded-3xl border border-slate-800/90 shadow-2xl grid lg:grid-cols-2">
        {/* Image side */}
        <div
          className="relative min-h-[280px] lg:min-h-[420px] bg-slate-900 bg-cover bg-center"
          style={{
            backgroundImage:
                "linear-gradient(to top, rgba(15,23,42,0.95), rgba(15,23,42,0.35)), url('/images/campus.jpg')",
            }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#D32F2F]/25 pointer-events-none" />
          <div className="relative h-full flex flex-col justify-end p-8 space-y-3">
            <span className="self-start text-xs font-semibold text-red-300 border border-red-900/50 bg-red-950/50 px-3 py-1 rounded-full uppercase tracking-wider">
              Join Us
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Join CampusOS and know everything about City University
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Register with your student details to get all university updates in one place, instead of searching Facebook groups and Messenger chats.
            </p>
          </div>
        </div>

        {/* Info side */}
        <div className="bg-slate-900/90 p-6 sm:p-8 flex flex-col justify-between gap-6">
          <div>
            <p className="text-xs font-semibold text-red-400 uppercase tracking-wider">
              What you get after registering
            </p>
            <ul className="mt-4 space-y-3">
              {infoList.map((i) => (
                <li
                  key={i.text}
                  className="flex items-center gap-3 bg-slate-950/50 border border-slate-800/70 rounded-2xl px-4 py-3"
                >
                  <span className="text-xl">{i.icon}</span>
                  <span className="text-sm text-slate-200">{i.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-slate-800/80 pt-5 flex flex-wrap items-center gap-3">
            <Link
              href="/signup"
              className="px-5 py-2.5 bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-red-900/30"
            >
              Register Now
            </Link>
            <Link
              href="/login"
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm rounded-xl transition-all"
            >
              Already registered? Log in
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}