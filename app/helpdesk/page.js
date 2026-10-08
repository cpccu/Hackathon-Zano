import { prisma } from "@/app/lib/prisma";
import { nextDeparture } from "@/app/lib/bus";
import Link from "next/link";
import { auth } from "@/app/auth";

const CATS = { BUS: "Bus", RULES: "Rules", EXAM: "Exams", GENERAL: "General" };

export default async function HelpdeskPage({ searchParams }) {
  const { q = "", cat = "" } = await searchParams;
  const session = await auth();
  const isAdmin = session?.user?.role === "ADMIN";

  const [faqs, routes] = await Promise.all([
    prisma.faq.findMany({
      where: {
        ...(cat && { category: cat }),
        ...(q && {
          OR: [
            { question: { contains: q, mode: "insensitive" } },
            { answer: { contains: q, mode: "insensitive" } },
          ],
        }),
      },
      orderBy: { createdAt: "asc" },
    }),
    prisma.busRoute.findMany({ orderBy: { name: "asc" } }),
  ]);

  const inputClass =
    "bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500/80 focus:ring-1 focus:ring-red-500/50 transition duration-200";

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10 animate-slide-up">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Helpdesk & FAQs
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Find answers to common campus queries, rules, exam policies, and bus transit schedules.
          </p>
        </div>
        {isAdmin && (
          <Link
            href="/admin/helpdesk"
            className="inline-flex items-center justify-center gap-2 text-xs font-semibold text-red-400 hover:text-red-300 border border-red-900/40 bg-red-950/20 px-4 py-2.5 rounded-xl transition duration-200 shadow-lg shadow-red-950/30"
          >
            ⚙️ Manage FAQs & Buses
          </Link>
        )}
      </div>

      {/* Search & Filter Controls */}
      <form className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-4 backdrop-blur-xl shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex-1">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search questions (e.g. attendance, bus)..."
            className={`${inputClass} w-full`}
          />
        </div>

        <select name="cat" defaultValue={cat} className={`${inputClass} cursor-pointer`}>
          <option value="" className="bg-slate-900 text-slate-100">
            All topics
          </option>
          {Object.entries(CATS).map(([k, v]) => (
            <option key={k} value={k} className="bg-slate-900 text-slate-100">
              {v}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-semibold text-xs tracking-wide transition-all duration-200 shadow-lg shadow-red-950/40 active:scale-[0.98]"
        >
          Search
        </button>
      </form>

      {/* FAQ Accordion List */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider px-1">
          Frequently Asked Questions
        </h2>

        {faqs.map((f) => (
          <details
            key={f.id}
            className="group bg-slate-900/70 border border-slate-800/90 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-lg transition-colors duration-200 hover:border-slate-700 [&[open]]:border-slate-700"
          >
            <summary className="cursor-pointer font-semibold text-slate-100 text-sm sm:text-base flex items-center justify-between gap-3 list-none select-none">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold tracking-wider uppercase text-red-400 bg-red-950/40 border border-red-900/40 px-2.5 py-0.5 rounded-full">
                  {CATS[f.category] || f.category}
                </span>
                <span>{f.question}</span>
              </div>
              <span className="text-slate-500 group-open:rotate-180 transition-transform duration-200 text-xs">
                ▼
              </span>
            </summary>
            <p className="mt-3 pt-3 border-t border-slate-800/80 text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {f.answer}
            </p>
          </details>
        ))}

        {faqs.length === 0 && (
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-8 text-center text-slate-400 text-sm">
            🔍 No matching answers found for your query.
          </div>
        )}
      </div>

      {/* Bus Routes Section */}
      <div id="bus" className="space-y-4 pt-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            🚌 Campus Bus Routes & Schedule
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time departure estimations and complete stop route maps.
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/90 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left border-collapse">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[11px] font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-4">Route</th>
                  <th className="p-4">Stops</th>
                  <th className="p-4">Departures</th>
                  <th className="p-4">Next Bus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-200">
                {routes.map((r) => {
                  const next = nextDeparture(r.departures);
                  return (
                    <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-bold text-white whitespace-nowrap">
                        {r.name}
                      </td>
                      <td className="p-4 text-slate-300">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {r.stops.map((stop, idx) => (
                            <span key={idx} className="flex items-center gap-1.5">
                              <span className="bg-slate-800 px-2 py-0.5 rounded text-[11px] text-slate-300 border border-slate-700/60">
                                {stop}
                              </span>
                              {idx < r.stops.length - 1 && (
                                <span className="text-slate-500 text-xs">→</span>
                              )}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 text-slate-400 font-mono text-xs whitespace-nowrap">
                        {[...r.departures].sort().join(", ")}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span
                          className={`font-semibold px-2.5 py-1 rounded-lg text-xs border ${
                            next
                              ? "bg-emerald-950/40 text-emerald-400 border-emerald-800/50"
                              : "bg-slate-800/80 text-slate-400 border-slate-700"
                          }`}
                        >
                          {next ? `⏰ ${next}` : "Tomorrow"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}