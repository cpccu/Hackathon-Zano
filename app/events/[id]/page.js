import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { auth } from "@/app/auth";
import { formatDate } from "@/app/lib/format";

export default async function EventPage({ params }) {
  const { id } = await params;
  const event = await prisma.event.findUnique({
    where: { id },
    include: { club: true, _count: { select: { registrations: true } } },
  });
  if (!event) notFound();

  const session = await auth();
  const userId = session?.user?.id;
  const existing = userId
    ? await prisma.registration.findUnique({
        where: { userId_eventId: { userId, eventId: id } },
      })
    : null;
  const full = event.capacity && event._count.registrations >= event.capacity;

  async function rsvp() {
    "use server";
    const s = await auth();
    if (!s?.user) redirect("/login");
    const ev = await prisma.event.findUnique({
      where: { id },
      include: { _count: { select: { registrations: true } } },
    });
    if (ev.capacity && ev._count.registrations >= ev.capacity) redirect(`/events/${id}`);
    await prisma.registration.upsert({
      where: { userId_eventId: { userId: s.user.id, eventId: id } },
      update: {},
      create: { userId: s.user.id, eventId: id },
    });
    redirect("/my-events");
  }

  // Calculate capacity percentage for visual indicator bar
  const capacityPercent = event.capacity
    ? Math.min(100, Math.round((event._count.registrations / event.capacity) * 100))
    : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8 animate-slide-up">
      {/* Top Navigation & Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <span>←</span> Back to all events
        </Link>
        {session?.user?.role === "ADMIN" && (
          <Link
            href={`/admin/events/${event.id}/edit`}
            className="text-xs font-semibold text-red-400 hover:text-red-300 border border-red-900/40 bg-red-950/20 px-3 py-1.5 rounded-lg transition"
          >
            ✏️ Edit Event
          </Link>
        )}
      </div>

      {/* Main Glassmorphic Container */}
      <div className="bg-slate-900/80 border border-slate-800/90 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">
        {/* Banner / Hero Image Section */}
        <div className="relative">
          {event.imageUrl ? (
            <div className="h-72 md:h-96 w-full relative overflow-hidden">
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
            </div>
          ) : (
            <div className="w-full h-64 md:h-80 bg-gradient-to-br from-slate-800 via-slate-900 to-[#D32F2F]/30 flex flex-col items-center justify-center text-white relative border-b border-slate-800">
              <span className="text-7xl font-extrabold text-red-500/80">
                {event.club.name.charAt(0)}
              </span>
              <span className="text-sm font-semibold text-slate-400 mt-2">
                {event.club.name}
              </span>
            </div>
          )}

          {/* Type Badge Floating Overlay */}
          <div className="absolute top-4 left-4">
            <span className="text-xs font-bold tracking-widest uppercase bg-slate-950/90 text-red-400 border border-red-900/40 px-3 py-1.5 rounded-full shadow-lg">
              {event.type || "Event"}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 space-y-8">
          {/* Title & Host Header */}
          <div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
              {event.title}
            </h1>
            <div className="flex items-center gap-2 mt-2 text-xs md:text-sm text-slate-400">
              <span>Organized by</span>
              <span className="font-semibold text-slate-200 bg-slate-800/80 px-2.5 py-0.5 rounded-md border border-slate-700/60">
                🏛️ {event.club.name}
              </span>
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-md">
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Date & Time
              </p>
              <p className="text-xs md:text-sm font-medium text-slate-200">
                📅 {formatDate(event.startsAt)}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Location
              </p>
              <p className="text-xs md:text-sm font-medium text-slate-200">
                📍 {event.location}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Registrations
              </p>
              <p className="text-xs md:text-sm font-medium text-slate-200">
                👥 {event._count.registrations}
                {event.capacity ? ` / ${event.capacity}` : " (Unlimited)"}
              </p>
              {capacityPercent !== null && (
                <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden mt-1">
                  <div
                    className={`h-full transition-all ${
                      full ? "bg-red-500" : "bg-[#D32F2F]"
                    }`}
                    style={{ width: `${capacityPercent}%` }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
              About This Event
            </h3>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>

          {/* Dynamic Registration CTA Box */}
          <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-400">
              {existing ? (
                <span className="text-emerald-400 font-medium">
                  ✓ You hold a confirmed pass for this event.
                </span>
              ) : full ? (
                <span className="text-red-400 font-medium">
                  ⚠️ Capacity reached. Registration closed.
                </span>
              ) : (
                <span>Reserve your spot today to receive your digital QR pass.</span>
              )}
            </div>

            <div className="w-full sm:w-auto">
              {existing ? (
                <Link
                  href="/my-events"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition shadow-lg shadow-emerald-900/20"
                >
                  <span>🎟️</span> Registered, View My QR Pass
                </Link>
              ) : full ? (
                <button
                  disabled
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 text-slate-500 text-xs font-semibold cursor-not-allowed border border-slate-700"
                >
                  Event Full
                </button>
              ) : session?.user ? (
                <form action={rsvp} className="w-full sm:w-auto">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-semibold text-xs transition shadow-lg shadow-red-900/30"
                  >
                    Confirm Registration
                  </button>
                </form>
              ) : (
                <Link
                  href="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition"
                >
                  Log in to Register
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}