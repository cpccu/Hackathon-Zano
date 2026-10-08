import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { requireAdmin } from "@/app/lib/session";
import UploadField from "@/app/components/UploadField";

// Bangladesh is UTC+6 with no daylight saving
const toDhakaInput = (d) => new Date(d.getTime() + 6 * 60 * 60 * 1000).toISOString().slice(0, 16);

export default async function EditEventPage({ params }) {
  await requireAdmin();
  const { id } = await params;
  const [event, clubs] = await Promise.all([
    prisma.event.findUnique({ where: { id } }),
    prisma.club.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!event) notFound();

  async function update(formData) {
    "use server";
    await requireAdmin();
    const cap = formData.get("capacity");
    await prisma.event.update({
      where: { id },
      data: {
        title: formData.get("title"),
        description: formData.get("description"),
        type: formData.get("type"),
        location: formData.get("location"),
        startsAt: new Date(`${formData.get("startsAt")}:00+06:00`),
        capacity: cap ? Number(cap) : null,
        clubId: formData.get("clubId"),
        imageUrl: formData.get("imageUrl") || formData.get("oldImage") || null,
      },
    });
    redirect(`/events/${id}`);
  }

  async function remove() {
    "use server";
    await requireAdmin();
    await prisma.registration.deleteMany({ where: { eventId: id } });
    await prisma.event.delete({ where: { id } });
    redirect("/events");
  }

  const inputClass =
    "w-full bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500/80 focus:ring-1 focus:ring-red-500/50 transition duration-200";

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6 animate-slide-up">
      {/* Header & Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href={`/events/${id}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <span>←</span> Back to Event Details
        </Link>
        <span className="text-xs font-semibold text-red-400 border border-red-900/40 bg-red-950/30 px-3 py-1 rounded-full uppercase tracking-wider">
          Edit Mode
        </span>
      </div>

      {/* Primary Edit Glassmorphic Card */}
      <div className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Edit Event Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Update event information, schedule, or media assets.
          </p>
        </div>

        <form action={update} className="space-y-5">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Event Title
            </label>
            <input name="title" defaultValue={event.title} required className={inputClass} />
          </div>

          {/* Type & Host Club */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Category / Type
              </label>
              <input name="type" defaultValue={event.type} required className={inputClass} />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Organizing Club
              </label>
              <select
                name="clubId"
                defaultValue={event.clubId}
                className={`${inputClass} cursor-pointer`}
              >
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
              Description
            </label>
            <textarea
              name="description"
              defaultValue={event.description}
              required
              rows={4}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Location & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Location
              </label>
              <input name="location" defaultValue={event.location} required className={inputClass} />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Date & Time (Dhaka BST)
              </label>
              <input
                name="startsAt"
                type="datetime-local"
                defaultValue={toDhakaInput(event.startsAt)}
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
              defaultValue={event.capacity ?? ""}
              placeholder="Leave blank for unlimited seats"
              className={inputClass}
            />
          </div>

          {/* Image Upload & Preview */}
          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Current Banner Preview
            </label>
            {event.imageUrl ? (
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 h-44 group">
                <img
                  src={event.imageUrl}
                  alt="Current Event Banner"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3">
                  <span className="text-[11px] text-slate-300 font-medium">
                    Current active banner
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 text-xs text-slate-500 text-center">
                No active banner image set.
              </div>
            )}

            <input type="hidden" name="oldImage" value={event.imageUrl || ""} />

            <div className="pt-2 space-y-1.5">
              <p className="text-xs text-slate-400">
                Upload a new image below only if you want to replace the current banner:
              </p>
              <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/40">
                <UploadField name="imageUrl" />
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-bold text-sm tracking-wide transition-all duration-200 shadow-lg shadow-red-950/50 active:scale-[0.99]"
            >
              💾 Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* Danger Zone / Delete Card */}
      <div className="bg-red-950/10 border border-red-900/30 rounded-3xl p-6 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-red-400">Danger Zone</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Deleting this event will permanently wipe all attendee registration records.
          </p>
        </div>

        <form action={remove} className="w-full sm:w-auto">
          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-red-800/60 bg-red-950/40 hover:bg-red-900/50 text-red-300 font-semibold text-xs transition duration-200"
          >
            🗑️ Delete Event
          </button>
        </form>
      </div>
    </div>
  );
}