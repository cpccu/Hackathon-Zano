import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import { formatDate } from "@/app/lib/format";

const dhaka = (d, opts) =>
  new Date(d).toLocaleDateString("en-GB", { timeZone: "Asia/Dhaka", ...opts });

export default async function FeaturedEvents() {
  const events = await prisma.event.findMany({
    where: { startsAt: { gte: new Date() } },
    include: { club: true, _count: { select: { registrations: true } } },
    orderBy: { startsAt: "asc" },
    take: 3,
  });

  if (events.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 mt-16">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div className="space-y-2">
          <span className="text-xs font-semibold text-red-400 border border-red-900/40 bg-red-950/30 px-3 py-1 rounded-full uppercase tracking-wider">
            Happening Soon
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Featured Events
          </h2>
        </div>
        <Link href="/events" className="text-sm font-semibold text-red-400 hover:text-red-300 transition-colors">
          View all events →
        </Link>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((e) => {
          const left = e.capacity ? Math.max(0, e.capacity - e._count.registrations) : null;
          return (
            <Link
              key={e.id}
              href={`/events/${e.id}`}
              className="group bg-slate-900/80 border border-slate-800/90 hover:border-red-500/40 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col"
            >
              <div className="relative h-52 overflow-hidden">
                {e.imageUrl ? (
                  <img
                    src={e.imageUrl}
                    alt={e.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-800 via-slate-900 to-[#D32F2F]/50 flex items-center justify-center text-6xl font-extrabold text-white/80">
                    {e.club.name.charAt(0)}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />

                <div className="absolute top-4 left-4 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-700/60 px-3 py-1.5 text-center leading-tight">
                  <p className="text-lg font-extrabold text-white">{dhaka(e.startsAt, { day: "2-digit" })}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-red-400">
                    {dhaka(e.startsAt, { month: "short" })}
                  </p>
                </div>

                <span className="absolute top-4 right-4 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-[#D32F2F] text-white shadow-lg shadow-red-950/40">
                  {e.type}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-red-400">{e.club.name}</p>
                  <h3 className="text-lg font-bold text-slate-100 group-hover:text-red-400 transition-colors line-clamp-2">
                    {e.title}
                  </h3>
                  <p className="text-xs text-slate-400">🕒 {formatDate(e.startsAt)}</p>
                  <p className="text-xs text-slate-400">📍 {e.location}</p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-400">
                    {left !== null ? (left === 0 ? "Full" : `${left} spots left`) : `${e._count.registrations} registered`}
                  </span>
                  <span className="font-bold text-red-400 group-hover:translate-x-1 transition-transform">
                    Register ➔
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}