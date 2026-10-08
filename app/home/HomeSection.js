import Link from "next/link";
import { prisma } from "@/app/lib/prisma";

export default async function HomeFeaturesSection() {
  // Fetch real-time metrics across all platform modules concurrently
  const [resourcesCount, openLostFoundCount, faqsCount, busRoutesCount] =
    await Promise.all([
      prisma.resource.count(),
      prisma.lostFoundItem.count({ where: { status: "OPEN" } }),
      prisma.faq.count(),
      prisma.busRoute.count(),
    ]);

  const features = [
    {
      title: "Academic Resource Hub",
      description:
        "Access semester study notes, course outlines, lab manuals, and previous examination question papers across all departments.",
      icon: "📚",
      href: "/resources",
      badge: "Repository",
      countLabel: `${resourcesCount} ${resourcesCount === 1 ? "Resource" : "Resources"} Available`,
      gradient: "from-blue-500/10 via-indigo-500/5 to-transparent",
      accentBorder: "group-hover:border-indigo-500/50",
    },
    {
      title: "Campus Lost & Found",
      description:
        "Report misplaced items or help fellow students reconnect with lost belongings on campus with real-time updates.",
      icon: "🔍",
      href: "/lost-found",
      badge: "Bulletin Board",
      countLabel: `${openLostFoundCount} Active ${openLostFoundCount === 1 ? "Listing" : "Listings"}`,
      gradient: "from-red-500/10 via-rose-500/5 to-transparent",
      accentBorder: "group-hover:border-red-500/50",
    },
    {
      title: "Helpdesk & FAQ Hub",
      description:
        "Find instant answers regarding university academic policies, grading criteria, registration procedures, and campus rules.",
      icon: "💬",
      href: "/helpdesk",
      badge: "Support",
      countLabel: `${faqsCount} Published ${faqsCount === 1 ? "FAQ" : "FAQs"}`,
      gradient: "from-amber-500/10 via-orange-500/5 to-transparent",
      accentBorder: "group-hover:border-amber-500/50",
    },
    {
      title: "Bus Routes & Timetable",
      description:
        "Track daily university transport schedules, route stops, and pickup times across major city routes.",
      icon: "🚌",
      href: "/helpdesk",
      badge: "Transport",
      countLabel: `${busRoutesCount} Active ${busRoutesCount === 1 ? "Route" : "Routes"}`,
      gradient: "from-emerald-500/10 via-teal-500/5 to-transparent",
      accentBorder: "group-hover:border-emerald-500/50",
    },
  ];

  return (
    <section className="relative overflow-hidden py-12 sm:py-16 mt-8">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-red-900/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto px-4 relative space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-semibold text-red-400 border border-red-900/40 bg-red-950/30 px-3 py-1 rounded-full uppercase tracking-wider">
            Campus Ecosystem
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Everything You Need to Succeed
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Centralized academic resources, lost item recovery, transport details, and instant policy support designed specifically for university life.
          </p>
        </div>

        {/* Dynamic Feature Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, idx) => (
            <Link
              key={idx}
              href={feature.href}
              className={`group relative bg-slate-900/80 border border-slate-800/90 ${feature.accentBorder} rounded-3xl p-6 backdrop-blur-xl shadow-2xl flex flex-col justify-between overflow-hidden transition-all duration-300 hover:-translate-y-1.5`}
            >
              {/* Card Hover Glow */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
              />

              <div className="space-y-4 relative z-10">
                {/* Badge & Icon */}
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700/60">
                    {feature.badge}
                  </span>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-100 group-hover:text-red-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>

              {/* Dynamic Database Metric Badge & Link Indicator */}
              <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between relative z-10 text-xs">
                <span className="font-semibold text-slate-400 group-hover:text-slate-200 transition-colors">
                  {feature.countLabel}
                </span>
                <span className="text-red-400 font-bold group-hover:translate-x-1 transition-transform duration-200">
                  ➔
                </span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}