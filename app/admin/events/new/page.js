import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { requireAdmin } from "@/app/lib/session";
import UploadField from "@/app/components/UploadField";

export default async function NewEventPage() {
  await requireAdmin();
  const clubs = await prisma.club.findMany({ orderBy: { name: "asc" } });

  async function create(formData) {
    "use server";
    await requireAdmin();
    const cap = formData.get("capacity");
    const event = await prisma.event.create({
      data: {
        title: formData.get("title"),
        description: formData.get("description"),
        imageUrl: formData.get("imageUrl") || null,
        type: formData.get("type"),
        location: formData.get("location"),
        startsAt: new Date(`${formData.get("startsAt")}:00+06:00`),
        capacity: cap ? Number(cap) : null,
        clubId: formData.get("clubId"),
      },
    });
    redirect(`/events/${event.id}`);
  }

  const inputClass =
    "w-full bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500/80 focus:ring-1 focus:ring-red-500/50 transition duration-200";

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6 animate-slide-up">
      {/* Header & Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <span>←</span> Cancel & Return
        </Link>
        <span className="text-xs font-semibold text-red-400 border border-red-900/40 bg-red-950/30 px-3 py-1 rounded-full uppercase tracking-wider">
          Admin Portal
        </span>
      </div>

      {/* Glassmorphic Form Card */}
      <div className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Create New Event
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Fill in the details below to publish an event on the portal.
          </p>
        </div>

        <form action={create} className="space-y-5">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Event Title <span className="text-red-500">*</span>
            </label>
            <input
              name="title"
              placeholder="e.g. AI & Robotics Hackathon 2026"
              required
              className={inputClass}
            />
          </div>

          {/* Type & Host Club */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Category / Type <span className="text-red-500">*</span>
              </label>
              <input
                name="type"
                placeholder="Workshop, Contest, Seminar..."
                required
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Organizing Club <span className="text-red-500">*</span>
              </label>
              <select name="clubId" required className={`${inputClass} cursor-pointer`}>
                <option value="" disabled selected className="bg-slate-900 text-slate-500">
                  Select organizing club
                </option>
                {clubs.map((c) => (
                  <option key={c.id} value={c.id} className="bg-slate-900 text-slate-100">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              placeholder="Provide event overview, schedule, and guidelines..."
              required
              rows={4}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Location & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                name="location"
                placeholder="Auditorium B, Campus Main"
                required
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Date & Time (Dhaka BST) <span className="text-red-500">*</span>
              </label>
              <input
                name="startsAt"
                type="datetime-local"
                required
                className={`${inputClass} color-scheme-dark`}
              />
            </div>
          </div>

          {/* Capacity */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Capacity Limit <span className="text-slate-500 font-normal">(Optional)</span>
            </label>
            <input
              name="capacity"
              type="number"
              min="1"
              placeholder="Leave blank for unlimited seats"
              className={inputClass}
            />
          </div>

          {/* Upload Banner */}
          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Event Cover Banner
            </label>
            <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/40">
              <UploadField name="imageUrl" />
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-bold text-sm tracking-wide transition-all duration-200 shadow-lg shadow-red-950/50 active:scale-[0.99]"
            >
              🚀 Publish Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}