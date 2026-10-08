import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { requireUser } from "@/app/lib/session";
import UploadField from "@/app/components/UploadField";

export default async function NewItemPage() {
  await requireUser();

  async function create(formData) {
    "use server";
    const user = await requireUser();
    await prisma.lostFoundItem.create({
      data: {
        type: formData.get("type"),
        title: formData.get("title"),
        description: formData.get("description"),
        location: formData.get("location"),
        date: new Date(`${formData.get("date")}T00:00:00+06:00`),
        contact: formData.get("contact") || null,
        imageUrl: formData.get("imageUrl") || null,
        reporterId: user.id,
      },
    });
    redirect("/lost-found");
  }

  const inputClass =
    "w-full bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500/80 focus:ring-1 focus:ring-red-500/50 transition duration-200";

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6 animate-slide-up">
      {/* Header & Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/lost-found"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <span>←</span> Back to Bulletin Board
        </Link>
        <span className="text-xs font-semibold text-red-400 border border-red-900/40 bg-red-950/30 px-3 py-1 rounded-full uppercase tracking-wider">
          New Listing
        </span>
      </div>

      {/* Glassmorphic Form Card */}
      <div className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Post Lost or Found Item
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Provide details to help classmates or staff identify and recover the item.
          </p>
        </div>

        <form action={create} className="space-y-5">
          {/* Post Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Listing Category <span className="text-red-500">*</span>
            </label>
            <select name="type" required className={`${inputClass} cursor-pointer`}>
              <option value="LOST" className="bg-slate-900 text-slate-100">
                🔍 I lost something (Lost)
              </option>
              <option value="FOUND" className="bg-slate-900 text-slate-100">
                📦 I found something (Found)
              </option>
            </select>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Item Title <span className="text-red-500">*</span>
            </label>
            <input
              name="title"
              placeholder="e.g. Black Leather Wallet, Student ID Card"
              required
              className={inputClass}
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Detailed Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              placeholder="Include distinguishing traits, color, contents, brand, or condition..."
              required
              rows={4}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Location & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                name="location"
                placeholder="e.g. Central Library, Annex 3 Floor"
                required
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Date Incident Occurred <span className="text-red-500">*</span>
              </label>
              <input
                name="date"
                type="date"
                required
                className={`${inputClass} color-scheme-dark`}
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Contact Info <span className="text-slate-500 font-normal">(Optional)</span>
            </label>
            <input
              name="contact"
              placeholder="Phone number, Telegram, or alternate email"
              className={inputClass}
            />
          </div>

          {/* Attachment Upload */}
          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Upload Item Photo <span className="text-slate-500 font-normal">(Optional)</span>
            </label>
            <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/40">
              <UploadField name="imageUrl" />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-bold text-sm tracking-wide transition-all duration-200 shadow-lg shadow-red-950/50 active:scale-[0.99]"
            >
              📢 Post Listing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}