import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [theme, setTheme] = useState(
    () =>
      localStorage.getItem("theme") ||
      document.documentElement.getAttribute("data-theme") ||
      "light",
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const isDark = theme === "dark";

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${isDark ? "bg-[#07070f] text-white" : "bg-slate-50 text-slate-900"}`}
    >
      {/* ── Navbar ── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 backdrop-blur-xl border-b transition-colors duration-500 ${isDark ? "bg-[#07070f]/80 border-white/[0.07]" : "bg-white/90 border-slate-200"}`}
      >
        <span className="text-xl font-black tracking-tight bg-gradient-to-r from-violet-500 via-cyan-500 to-violet-500 bg-clip-text text-transparent">
          TejasAI
        </span>

        <span
          className={`hidden md:block text-xs uppercase tracking-widest font-medium ${isDark ? "text-white/35" : "text-slate-400"}`}
        >
          Built from experience · Shaped by passion
        </span>

        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 cursor-pointer hover:scale-110 ${isDark ? "border-white/15 bg-white/5 hover:bg-white/10 text-white/60" : "border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-600"}`}
        >
          {isDark ? (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
            </svg>
          )}
        </button>
      </nav>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 pt-28 pb-20">
        {/* Orbs — stronger in light mode */}
        <div
          className={`absolute top-[-120px] left-[-100px] w-[520px] h-[520px] rounded-full blur-[130px] pointer-events-none ${isDark ? "bg-violet-600/20" : "bg-violet-400/25"}`}
        />
        <div
          className={`absolute bottom-[-100px] right-[-80px] w-[440px] h-[440px] rounded-full blur-[110px] pointer-events-none ${isDark ? "bg-cyan-500/15" : "bg-cyan-400/20"}`}
        />
        <div
          className={`absolute top-[38%] left-[52%] w-[260px] h-[260px] rounded-full blur-[80px] pointer-events-none ${isDark ? "bg-amber-500/8" : "bg-amber-400/15"}`}
        />

        {/* Grid texture */}
        <div
          className={`absolute inset-0 pointer-events-none ${isDark ? "opacity-[0.025]" : "opacity-[0.07]"}`}
          style={{
            backgroundImage:
              "linear-gradient(rgba(100,80,200,1) 1px, transparent 1px), linear-gradient(90deg, rgba(100,80,200,1) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        <div className="relative z-10 text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs uppercase tracking-widest font-semibold mb-8 ${isDark ? "border-violet-500/40 bg-violet-500/10 text-violet-300" : "border-violet-400/50 bg-violet-100 text-violet-700"}`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full animate-pulse ${isDark ? "bg-violet-400" : "bg-violet-500"}`}
            />
            AI-Powered Portfolio
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-[4.5rem] font-black leading-[1.05] tracking-tight mb-6">
            Meet{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-violet-500 via-cyan-400 to-violet-500 bg-clip-text text-transparent">
                Tejas Insight
              </span>
              <span className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent" />
            </span>
          </h1>

          {/* Description */}
          <p
            className={`text-lg md:text-xl leading-relaxed mb-4 max-w-xl mx-auto ${isDark ? "text-white/55" : "text-slate-600"}`}
          >
            An intelligent AI assistant built to answer everything about Tejas
            Birla's professional journey — skills, projects, decisions, and
            growth.
          </p>
          <p
            className={`text-sm mb-12 max-w-md mx-auto ${isDark ? "text-white/30" : "text-slate-400"}`}
          >
            No scrolling through resumes. Just ask — this AI is trained on real
            experience.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/chat"
              className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm text-white transition-all duration-300 hover:scale-105 hover:shadow-[0_0_35px_rgba(124,58,237,0.55)]"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
              }}
            >
              Chat with My AI
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>

            <a
              href="#features"
              className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm border transition-all duration-300 hover:scale-105 ${isDark ? "border-white/15 text-white/65 hover:bg-white/[0.06]" : "border-slate-300 text-slate-700 bg-white hover:bg-slate-100 shadow-sm"}`}
            >
              Learn More
            </a>
          </div>

          {/* Stats */}
          <div className="mt-16 flex flex-wrap justify-center gap-10">
            {[
              { value: "100%", label: "Real Experience" },
              { value: "AI", label: "Powered Answers" },
              { value: "Live", label: "Always Updated" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-black bg-gradient-to-r from-violet-500 to-cyan-500 bg-clip-text text-transparent">
                  {value}
                </div>
                <div
                  className={`text-[11px] uppercase tracking-widest mt-1 ${isDark ? "text-white/30" : "text-slate-400"}`}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 ${isDark ? "text-white/20" : "text-slate-300"}`}
        >
          <span className="text-[10px] uppercase tracking-widest">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-current to-transparent animate-pulse" />
        </div>
      </section>

      {/* ── Features ── */}
      <section
        id="features"
        className={`py-28 px-6 transition-colors duration-500 ${isDark ? "bg-[#0b0b15]" : "bg-white"}`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p
              className={`text-xs uppercase tracking-widest font-semibold mb-3 ${isDark ? "text-violet-400" : "text-violet-600"}`}
            >
              Why This Is Different
            </p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-5">
              What Makes This{" "}
              <span className="bg-gradient-to-r from-violet-500 to-cyan-500 bg-clip-text text-transparent">
                Stand Out?
              </span>
            </h2>
            <p
              className={`max-w-lg mx-auto text-base ${isDark ? "text-white/40" : "text-slate-500"}`}
            >
              Not a generic chatbot — a purpose-built AI system structured
              around real development experience and professional growth.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                borderDark: "border-violet-500/25",
                borderLight: "border-violet-200",
                iconBgDark: "bg-violet-500/15 text-violet-400",
                iconBgLight: "bg-violet-100 text-violet-600",
                glowDark: "hover:shadow-[0_0_45px_rgba(124,58,237,0.18)]",
                glowLight: "hover:shadow-violet-100",
                gradientFrom: "from-violet-500/8",
                icon: (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                ),
                title: "Project Insights",
                desc: "Ask about real projects, the ideas behind them, challenges faced, and how concepts were turned into working applications.",
              },
              {
                borderDark: "border-cyan-500/25",
                borderLight: "border-cyan-200",
                iconBgDark: "bg-cyan-500/15 text-cyan-400",
                iconBgLight: "bg-cyan-100 text-cyan-600",
                glowDark: "hover:shadow-[0_0_45px_rgba(6,182,212,0.18)]",
                glowLight: "hover:shadow-cyan-100",
                gradientFrom: "from-cyan-500/8",
                icon: (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: "Skill Breakdown",
                desc: "Explore core skills, technologies used, and the approach to building reliable and efficient solutions step by step.",
              },
              {
                borderDark: "border-amber-500/25",
                borderLight: "border-amber-200",
                iconBgDark: "bg-amber-500/15 text-amber-400",
                iconBgLight: "bg-amber-100 text-amber-600",
                glowDark: "hover:shadow-[0_0_45px_rgba(245,158,11,0.18)]",
                glowLight: "hover:shadow-amber-100",
                gradientFrom: "from-amber-500/8",
                icon: (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                ),
                title: "Experience Narrative",
                desc: "Discover the growth behind the journey — lessons learned, problems solved, and experiences that shaped a developer.",
              },
            ].map(
              ({
                borderDark,
                borderLight,
                iconBgDark,
                iconBgLight,
                glowDark,
                glowLight,
                gradientFrom,
                icon,
                title,
                desc,
              }) => (
                <div
                  key={title}
                  className={`group relative rounded-2xl border p-8 transition-all duration-500 hover:-translate-y-1.5 ${
                    isDark
                      ? `${borderDark} ${glowDark} bg-gradient-to-br ${gradientFrom} to-transparent`
                      : `${borderLight} ${glowLight} bg-white shadow-sm hover:shadow-xl`
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${isDark ? iconBgDark : iconBgLight}`}
                  >
                    {icon}
                  </div>
                  <h3 className="text-lg font-bold mb-3">{title}</h3>
                  <p
                    className={`text-sm leading-relaxed ${isDark ? "text-white/45" : "text-slate-500"}`}
                  >
                    {desc}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section
        className={`relative py-28 px-6 overflow-hidden transition-colors duration-500 ${isDark ? "bg-[#07070f]" : "bg-slate-50"}`}
      >
        <div
          className={`absolute inset-0 pointer-events-none ${isDark ? "bg-gradient-to-br from-violet-600/15 via-transparent to-cyan-600/12" : "bg-gradient-to-br from-violet-100/80 via-transparent to-cyan-100/60"}`}
        />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full pointer-events-none"
          style={{
            background: isDark
              ? "linear-gradient(to bottom, transparent, rgba(124,58,237,0.2), transparent)"
              : "linear-gradient(to bottom, transparent, rgba(124,58,237,0.15), transparent)",
          }}
        />

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs uppercase tracking-widest font-semibold mb-6 ${isDark ? "border-cyan-500/35 bg-cyan-500/10 text-cyan-400" : "border-cyan-400/50 bg-cyan-100 text-cyan-700"}`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full animate-pulse ${isDark ? "bg-cyan-400" : "bg-cyan-500"}`}
            />
            Start Now
          </div>

          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-5">
            Curious About{" "}
            <span className="bg-gradient-to-r from-violet-500 to-cyan-500 bg-clip-text text-transparent">
              The Journey?
            </span>
          </h2>

          <p
            className={`text-base mb-10 ${isDark ? "text-white/45" : "text-slate-500"}`}
          >
            Start a conversation and explore the professional path, technical
            depth, and mindset behind Tejas Birla's development journey.
          </p>

          <Link
            to="/chat"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-full font-bold text-sm text-white transition-all duration-300 hover:scale-105 hover:shadow-[0_0_45px_rgba(124,58,237,0.5)]"
            style={{
              background: "linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)",
            }}
          >
            Start Conversation
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        className={`border-t py-8 px-6 text-center transition-colors duration-500 ${isDark ? "border-white/[0.07] text-white/20 bg-[#07070f]" : "border-slate-200 text-slate-400 bg-white"}`}
      >
        <p className="text-xs uppercase tracking-widest">
          TejasAI · Built with purpose · {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
