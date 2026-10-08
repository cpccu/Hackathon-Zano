import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { requireUser } from "@/app/lib/session";
import { DEPARTMENTS, CATEGORIES } from "@/app/lib/constants";
import UploadField from "@/app/components/UploadField";

export default async function UploadPage() {
  await requireUser();
  const courses = await prisma.course.findMany({ orderBy: { code: "asc" } });

  async function create(formData) {
    "use server";
    const user = await requireUser();
    const fileUrl = formData.get("fileUrl");
    if (!fileUrl) redirect("/resources/upload");
    const courseId = formData.get("courseId");
    await prisma.resource.create({
      data: {
        title: formData.get("title"),
        description: formData.get("description") || null,
        category: formData.get("category"),
        department: formData.get("department"),
        semester: formData.get("semester") || null,
        courseId: courseId || null,
        fileUrl,
        uploaderId: user.id,
      },
    });
    redirect("/resources");
  }

  const inputClass =
    "w-full bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500/80 focus:ring-1 focus:ring-red-500/50 transition duration-200";

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6 animate-slide-up">
      {/* Header & Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/resources"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <span>←</span> Back to Resource Hub
        </Link>
        <span className="text-xs font-semibold text-red-400 border border-red-900/40 bg-red-950/30 px-3 py-1 rounded-full uppercase tracking-wider">
          Upload Material
        </span>
      </div>

      {/* Form Card */}
      <div className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Share Academic Material
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Contribute study notes, solution sets, or past questions for fellow students.
          </p>
        </div>

        <form action={create} className="space-y-5">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Document Title <span className="text-red-500">*</span>
            </label>
            <input
              name="title"
              placeholder="e.g. CSE201 Midterm Question Paper & Solutions"
              required
              className={inputClass}
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Description <span className="text-slate-500 font-normal">(Optional)</span>
            </label>
            <textarea
              name="description"
              placeholder="Provide context or notes regarding this document..."
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Category & Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Category <span className="text-red-500">*</span>
              </label>
              <select name="category" required className={`${inputClass} cursor-pointer`}>
                {Object.entries(CATEGORIES).map(([k, v]) => (
                  <option key={k} value={k} className="bg-slate-900 text-slate-100">
                    {v}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Department <span className="text-red-500">*</span>
              </label>
              <select name="department" required className={`${inputClass} cursor-pointer`}>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d} className="bg-slate-900 text-slate-100">
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Associated Course & Semester */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Course Tag <span className="text-slate-500 font-normal">(Optional)</span>
              </label>
              <select name="courseId" className={`${inputClass} cursor-pointer`}>
                <option value="" className="bg-slate-900 text-slate-500">
                  Select associated course
                </option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id} className="bg-slate-900 text-slate-100">
                    {c.code} · {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Semester / Session <span className="text-slate-500 font-normal">(Optional)</span>
              </label>
              <input
                name="semester"
                placeholder="e.g. Spring 2026"
                className={inputClass}
              />
            </div>
          </div>

          {/* File Upload Attachment */}
          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Attach Resource File <span className="text-red-500">*</span>
            </label>
            <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/40">
              <UploadField name="fileUrl" />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-bold text-sm tracking-wide transition-all duration-200 shadow-lg shadow-red-950/50 active:scale-[0.99]"
            >
              🚀 Submit Resource
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}