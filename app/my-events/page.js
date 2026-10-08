import Link from "next/link";
import QRCode from "qrcode";
import { prisma } from "../lib/prisma";
import { requireUser } from "../lib/session";
import { formatDate } from "../lib/format";

export default async function MyEventsPage() {
  const user = await requireUser();
  const regs = await prisma.registration.findMany({
    where: { userId: user.id },
    include: { event: { include: { club: true } } },
    orderBy: { createdAt: "desc" },
  });

  const items = await Promise.all(
    regs.map(async (r) => ({
      ...r,
      qr: await QRCode.toDataURL(r.qrToken, { width: 220, margin: 1 }),
    }))
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8 animate-slide-up">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            My Registrations
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Access your event passes, check-in status, and digital QR tickets.
          </p>
        </div>
        <Link
          href="/events"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition"
        >
          Explore More Events →
        </Link>
      </div>

      {/* Ticket Grid */}
      {items.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center backdrop-blur-xl space-y-3">
          <div className="text-4xl">🎟️</div>
          <h3 className="text-lg font-bold text-slate-200">No active event passes</h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
            You haven&apos;t registered for any events yet. Explore upcoming club activities and reserve your spot!
          </p>
          <div className="pt-2">
            <Link
              href="/events"
              className="inline-block px-5 py-2.5 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-semibold text-xs transition shadow-lg shadow-red-950/40"
            >
              Browse Events
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {items.map((r) => (
            <div
              key={r.id}
              className="relative bg-slate-900/80 border border-slate-800/90 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl flex flex-col justify-between group hover:border-slate-700 transition duration-300"
            >
              {/* Ticket Top Header Accent */}
              <div className="bg-slate-950/60 p-5 border-b border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-red-400 bg-red-950/40 border border-red-900/40 px-2.5 py-0.5 rounded-full">
                    {r.event.type || "Event Pass"}
                  </span>
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                      r.checkedInAt
                        ? "bg-emerald-950/50 text-emerald-400 border-emerald-800/50"
                        : "bg-slate-800/80 text-slate-400 border-slate-700/60"
                    }`}
                  >
                    {r.checkedInAt ? "✓ Checked In" : "Ready for Entry"}
                  </span>
                </div>

                <Link
                  href={`/events/${r.eventId}`}
                  className="block font-bold text-lg text-slate-100 hover:text-red-400 transition-colors line-clamp-1 mt-1"
                >
                  {r.event.title}
                </Link>

                <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
                  <span>🏛️ {r.event.club.name}</span>
                  <span>•</span>
                  <span>📅 {formatDate(r.event.startsAt)}</span>
                </div>
              </div>

              {/* QR Code Container with Decorative Pass Cutouts */}
              <div className="p-6 flex flex-col items-center justify-center bg-slate-900/40 relative">
                {/* Visual Ticket Cutout Insets */}
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#0f172a] border border-slate-800" />
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#0f172a] border border-slate-800" />

                <div className="p-3 bg-white rounded-2xl shadow-xl shadow-black/50 border-2 border-slate-700/50 group-hover:scale-105 transition-transform duration-300">
                  <img src={r.qr} alt="Event Entry QR Code" className="w-44 h-44 object-contain rounded-lg" />
                </div>

                <p
                  className={`mt-4 text-xs font-semibold tracking-wide ${
                    r.checkedInAt ? "text-emerald-400" : "text-slate-400"
                  }`}
                >
                  {r.checkedInAt
                    ? "Pass Verified at Entrance"
                    : "Present this QR pass at the venue entrance"}
                </p>
              </div>

              {/* Ticket Footer Action */}
              <div className="p-4 bg-slate-950/80 border-t border-slate-800/80 text-center">
                <Link
                  href={`/events/${r.eventId}`}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-200 transition"
                >
                  View Event Details & Directions →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}