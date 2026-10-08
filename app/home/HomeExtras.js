import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import { auth } from "@/app/auth";
import { formatDate } from "@/app/lib/format";
import { CATEGORIES } from "@/app/lib/constants";

export async function MyNextEvent() {
  const session = await auth();
  if (!session?.user) return null;

  const reg = await prisma.registration.findFirst({
    where: { userId: session.user.id, event: { startsAt: { gte: new Date() } } },
    include: { event: true },
    orderBy: { event: { startsAt: "asc" } },
  });

  if (!reg) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 mt-8">
      <Link
        href="/my-events"
        className="group relative block rounded-2xl bg-gradient-to-r from-red-950/40 via-slate-900/90 to-slate-900/80 border border-red-500/30 p-5 backdrop-blur-xl shadow-xl hover:border-red-500/60 transition-all duration-300"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-red-400 bg-red-950/60 border border-red-900/50 px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              Your Upcoming Event
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-red-400 transition-colors">
              {reg.event.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              📅 {formatDate(reg.event.startsAt)} &nbsp;·&nbsp; 📍 {reg.event.location}
            </p>
          </div>
          <span className="text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-200 text-lg">
            ➔
          </span>
        </div>
      </Link>
    </div>
  );
}


export function QuickLinks() {
  const links = [
    {
      title: "Missed an event?",
      sub: "See everything happening across campus",
      href: "/events",
      icon: "🗓️",
    },
    {
      title: "Bus time?",
      sub: "Next bus on every campus route",
      href: "/helpdesk#bus",
      icon: "🚌",
    },
    {
      title: "Exam tomorrow?",
      sub: "Find past question papers & guides",
      href: "/resources?category=QUESTION_PAPER",
      icon: "📑",
    },
    {
      title: "Lost something?",
      sub: "Post or search misplaced items",
      href: "/lost-found",
      icon: "🔎",
    },
    {
      title: "Have an issue?",
      sub: "File a complaint & track status",
      href: "/complaints",
      icon: "💬",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="group bg-slate-900/80 border border-slate-800/90 hover:border-slate-700 rounded-2xl p-4 backdrop-blur-xl shadow-xl transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between space-y-3"
        >
          <div className="space-y-1">
            <span className="text-xl block mb-2">{link.icon}</span>
            <p className="font-bold text-slate-100 text-sm group-hover:text-red-400 transition-colors">
              {link.title}
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">{link.sub}</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-slate-500 group-hover:text-red-400 transition-colors">
              Go ➔
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export async function RecentLists() {
  const [resources, items] = await Promise.all([
    prisma.resource.findMany({ orderBy: { createdAt: "desc" }, take: 4 }),
    prisma.lostFoundItem.findMany({
      where: { status: "OPEN" },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 mt-8 pb-16 grid gap-6 lg:grid-cols-2">
      {/* Recently Added Resources */}
      <section className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 backdrop-blur-xl shadow-2xl flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span>📚</span> Recently Added Resources
            </h2>
            <Link
              href="/resources"
              className="text-xs font-semibold text-red-400 hover:text-red-300 transition-colors"
            >
              View all →
            </Link>
          </div>

          <ul className="mt-4 space-y-3">
            {resources.map((r) => (
              <li
                key={r.id}
                className="bg-slate-950/50 border border-slate-800/60 rounded-2xl p-3.5 hover:border-slate-700/80 transition duration-200"
              >
                <a
                  href={r.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-sm text-slate-200 hover:text-red-400 transition-colors line-clamp-1"
                >
                  {r.title}
                </a>
                <p className="text-xs text-slate-400 mt-1">
                  <span className="text-red-400 font-medium">
                    {CATEGORIES[r.category] || r.category}
                  </span>{" "}
                  · {r.department}
                </p>
              </li>
            ))}
            {resources.length === 0 && (
              <p className="text-xs text-slate-500 py-4 text-center">No resources uploaded yet.</p>
            )}
          </ul>
        </div>
      </section>

      {/* Recently Lost & Found */}
      <section className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 backdrop-blur-xl shadow-2xl flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span>🔍</span> Recently Lost & Found
            </h2>
            <Link
              href="/lost-found"
              className="text-xs font-semibold text-red-400 hover:text-red-300 transition-colors"
            >
              View all →
            </Link>
          </div>

          <ul className="mt-4 space-y-3">
            {items.map((i) => (
              <li
                key={i.id}
                className="bg-slate-950/50 border border-slate-800/60 rounded-2xl p-3.5 hover:border-slate-700/80 transition duration-200 flex items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        i.type === "LOST"
                          ? "bg-red-950/60 text-red-400 border border-red-900/50"
                          : "bg-emerald-950/60 text-emerald-400 border border-emerald-900/50"
                      }`}
                    >
                      {i.type}
                    </span>
                    <span className="font-semibold text-sm text-slate-200 line-clamp-1">
                      {i.title}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 pl-0.5">📍 {i.location}</p>
                </div>
              </li>
            ))}
            {items.length === 0 && (
              <p className="text-xs text-slate-500 py-4 text-center">No open items listed.</p>
            )}
          </ul>
        </div>
      </section>
    </div>
  );
}