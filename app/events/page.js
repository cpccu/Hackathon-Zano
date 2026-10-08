import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import { formatDate } from "@/app/lib/format";
import { auth } from "@/app/auth";

export default async function EventsPage({ searchParams }) {
  const { q = "", club = "" } = await searchParams;
  const session = await auth();
  const isAdmin = session?.user?.role === "ADMIN";

  const [events, clubs] = await Promise.all([
    prisma.event.findMany({
      where: {
        startsAt: { gte: new Date() },
        ...(club && { clubId: club }),
        ...(q && { title: { contains: q, mode: "insensitive" } }),
      },
      include: { club: true },
      orderBy: { startsAt: "asc" },
    }),
    prisma.club.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8 animate-slide-up">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-red-400 tracking-widest uppercase mb-1">
            <span>📅 Live Campus Feed</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Upcoming Events
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Explore workshops, tournaments, and club fests at City University
          </p>
        </div>

        {isAdmin && (
          <Link
            href="/admin/events/new"
            className="bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-red-900/30 flex items-center justify-center gap-2 w-fit"
          >
            <span>+</span> Add Event
          </Link>
        )}
      </div>

      {/* Filter & Search Bar */}
      <form className="bg-slate-900/60 border border-slate-800/90 rounded-2xl p-3 md:p-4 backdrop-blur-md shadow-xl flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search events by title..."
            className="w-full bg-slate-800/80 border border-slate-700/70 focus:border-[#D32F2F] text-white text-xs rounded-xl px-4 py-2.5 outline-none transition placeholder:text-slate-500"
          />
        </div>

        <select
          name="club"
          defaultValue={club}
          className="bg-slate-800/80 border border-slate-700/70 focus:border-[#D32F2F] text-white text-xs rounded-xl px-4 py-2.5 outline-none transition cursor-pointer min-w-[180px]"
        >
          <option value="" className="bg-slate-900 text-white">All Clubs</option>
          {clubs.map((c) => (
            <option key={c.id} value={c.id} className="bg-slate-900 text-white">
              {c.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white text-xs px-5 py-2.5 rounded-xl font-semibold transition"
        >
          Filter
        </button>
      </form>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((e, index) => (
          <div
            key={e.id}
            style={{ animationDelay: `${index * 60}ms` }}
            className="bg-slate-900/80 border border-slate-800/90 hover:border-slate-700 rounded-2xl overflow-hidden shadow-xl backdrop-blur-md transition-all flex flex-col justify-between group animate-slide-up"
          >
            <div>
              <Link href={`/events/${e.id}`} className="block relative">
                {e.imageUrl ? (
                  <div className="h-44 overflow-hidden relative">
                    <img
                      src={e.imageUrl}
                      alt={e.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                  </div>
                ) : (
                  <div className="w-full h-44 bg-gradient-to-br from-slate-800 via-slate-900 to-[#D32F2F]/20 flex flex-col items-center justify-center text-white relative border-b border-slate-800">
                    <span className="text-4xl font-extrabold text-red-500/80 group-hover:scale-110 transition-transform">
                      {e.club.name.charAt(0)}
                    </span>
                    <span className="text-xs font-semibold text-slate-400 mt-1">
                      {e.club.name}
                    </span>
                  </div>
                )}
              </Link>

              {/* Body */}
              <div className="p-5 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold tracking-wider uppercase bg-slate-950/80 text-red-400 border border-red-900/30 px-2.5 py-1 rounded-full">
                    {e.type || "General"}
                  </span>
                  <span className="text-xs font-medium text-slate-400">
                    🏛️ {e.club.name}
                  </span>
                </div>

                <Link href={`/events/${e.id}`}>
                  <h2 className="font-bold text-lg text-white group-hover:text-red-400 transition-colors line-clamp-1">
                    {e.title}
                  </h2>
                </Link>

                <div className="space-y-1 text-xs text-slate-400 pt-1">
                  <p className="flex items-center gap-1.5 text-slate-300 font-medium">
                    <span>📅</span> {formatDate(e.startsAt)}
                  </p>
                  <p className="flex items-center gap-1.5 text-slate-400">
                    <span>📍</span> {e.location}
                  </p>
                </div>
              </div>
            </div>

            {/* Admin Controls */}
            {isAdmin && (
              <div className="px-5 pb-4 pt-2 border-t border-slate-800/60 flex justify-end">
                <Link
                  href={`/admin/events/${e.id}/edit`}
                  className="text-xs font-semibold text-red-400 hover:text-red-300 hover:underline flex items-center gap-1"
                >
                  ✏️ Edit Event
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {events.length === 0 && (
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-12 text-center space-y-3 backdrop-blur-md">
          <p className="text-4xl">🎪</p>
          <h3 className="text-lg font-bold text-white">No upcoming events found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query or selecting a different club from the filter menu.
          </p>
        </div>
      )}
    </div>
  );
}