import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FolderKanban, User, Zap, Info } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import useAdmin from "../context/useAdmin";

const API = import.meta.env.VITE_BACKEND_URL;

export default function AdminDashboard() {
  const { authHeaders } = useAdmin();
  const [stats, setStats] = useState({
    projects: 0,
    skills: [],
    hasProfile: false,
    profile: null,
  });
  const [loading, setLoading] = useState(true);
  const [statsError, setStatsError] = useState("");
  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const projectsRes = await fetch(`${API}/api/project/all-project`, {
          headers: authHeaders,
        });
        if (!projectsRes.ok) throw new Error("Failed to fetch projects.");
        const projectsData = await projectsRes.json();
        const projects = projectsData.allprojects || [];

        let skills = [];
        let hasProfile = false;
        let profile = null;
        try {
          const profileRes = await fetch(`${API}/api/profile/user-detail`, {
            headers: authHeaders,
          });
          if (profileRes.ok) {
            const profileData = await profileRes.json();
            skills = profileData.data?.skills || [];
            hasProfile = true;
            profile = profileData.data;
          }
        } catch (profileErr) {
          console.warn("Could not fetch profile stats:", profileErr.message);
        }

        setStats({ projects: projects.length, skills, hasProfile, profile });
      } catch (err) {
        console.error("Dashboard stats error:", err.message);
        setStatsError("Could not load dashboard stats.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const STAT_CARDS = [
    {
      label: "Total Projects",
      value: loading ? "—" : stats.projects,
      icon: FolderKanban,
      accent: "violet",
      action: "link",
      to: "/admin/projects",
    },
    {
      label: "Profile Status",
      value: loading ? "—" : stats.hasProfile ? "Active" : "Not Set",
      icon: User,
      accent: "cyan",
      action: "modal",
      modal: "profile",
    },
    {
      label: "Skills Listed",
      value: loading ? "—" : stats.skills.length,
      icon: Zap,
      accent: "amber",
      action: "modal",
      modal: "skills",
    },
  ];

  const QUICK_ACTIONS = [
    { label: "Add New Project", to: "/admin/projects/add", primary: true },
    { label: "Edit Profile", to: "/admin/profile", primary: false },
    { label: "View All Projects", to: "/admin/projects", primary: false },
    {
      label: "View Live Site",
      to: import.meta.env.VITE_FRONTEND_URL || "/",
      primary: false,
      external: true,
    },
  ];

  const accentMap = {
    violet: {
      border: "border-violet-500/20",
      icon: "bg-violet-500/15 text-violet-400",
      val: "text-violet-400",
    },
    cyan: {
      border: "border-cyan-500/20",
      icon: "bg-cyan-500/15 text-cyan-400",
      val: "text-cyan-400",
    },
    amber: {
      border: "border-amber-500/20",
      icon: "bg-amber-500/15 text-amber-400",
      val: "text-amber-400",
    },
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-white/35 mt-1">
            Overview of your portfolio data
          </p>
        </div>

        {/* Stats error */}
        {statsError && (
          <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm">
            {statsError}
          </div>
        )}

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {STAT_CARDS.map(
            ({
              label,
              value,
              icon: IconComponent,
              accent,
              action,
              to,
              modal,
            }) => {
              const a = accentMap[accent];
              const baseClass = `group rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg bg-white/[0.03] cursor-pointer ${a.border}`;
              const inner = (
                <>
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${a.icon}`}
                  >
                    <IconComponent size={20} />
                  </div>
                  <div className={`text-2xl font-black mb-1 ${a.val}`}>
                    {value}
                  </div>
                  <div className="text-xs text-white/40 font-medium">
                    {label}
                  </div>
                </>
              );

              if (action === "link") {
                return (
                  <Link key={label} to={to} className={baseClass}>
                    {inner}
                  </Link>
                );
              }
              return (
                <div
                  key={label}
                  className={baseClass}
                  onClick={() => setActiveModal(modal)}
                >
                  {inner}
                </div>
              );
            },
          )}
        </div>

        {/* Quick actions */}
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
          <h2 className="text-sm font-bold text-white/70 uppercase tracking-widest mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {QUICK_ACTIONS.map(({ label, to, primary, external }) => (
              <Link
                key={label}
                to={to}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className={`flex items-center justify-center px-4 py-3 rounded-xl text-sm font-semibold text-center transition-all duration-200 hover:scale-[1.02] cursor-pointer ${
                  primary
                    ? "text-white hover:shadow-[0_0_20px_rgba(124,58,237,0.35)]"
                    : "border border-white/10 bg-white/[0.04] text-white/60 hover:text-white/80 hover:bg-white/[0.07]"
                }`}
                style={
                  primary
                    ? {
                        background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                      }
                    : {}
                }
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Info card */}
        <div className="rounded-2xl border border-violet-500/20 bg-violet-500/[0.05] p-5 flex items-start gap-4">
          <div className="w-8 h-8 rounded-lg bg-violet-500/15 text-violet-400 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Info size={16} />
          </div>
          <div>
            <p className="text-sm font-semibold text-white/80 mb-1">
              Changes reflect instantly
            </p>
            <p className="text-xs text-white/40 leading-relaxed">
              Any profile or project updates you make here are saved to the
              database immediately. Your AI assistant will use the updated data
              on the next conversation.
            </p>
          </div>
        </div>
      </div>

      {/* ── Skills Modal ─────────────────────────────────────── */}
      {activeModal === "skills" && (
        <Modal title="Skills" onClose={() => setActiveModal(null)}>
          {stats.skills.length === 0 ? (
            <p className="text-white/40 text-sm">No skills added yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {stats.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
          <div className="mt-5 flex justify-end">
            <Link
              to="/admin/profile"
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
              }}
            >
              Edit Skills
            </Link>
          </div>
        </Modal>
      )}

      {/* ── Profile Modal (read-only) ─────────────────────────── */}
      {activeModal === "profile" && stats.profile && (
        <Modal title="Profile Overview" onClose={() => setActiveModal(null)}>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1 [&::-webkit-scrollbar]:hidden">
            <ReadRow label="Full Name" value={stats.profile.fullName} />
            <ReadRow label="Title" value={stats.profile.title} />
            <ReadRow label="Bio" value={stats.profile.bio} />
            <ReadRow label="Portfolio" value={stats.profile.portfolio} />
            <ReadRow label="Email" value={stats.profile.contact?.email} />
            <ReadRow label="LinkedIn" value={stats.profile.contact?.linkedIn} />
            <ReadRow label="GitHub" value={stats.profile.contact?.github} />
            <ReadRow
              label="Open to Work"
              value={stats.profile.openToWork ? "Yes" : "No"}
            />
            <ReadRow
              label="Freelance"
              value={stats.profile.freelanceAvailable ? "Yes" : "No"}
            />

            {/* Education */}
            {stats.profile.education?.length > 0 && (
              <div className="pt-2">
                <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-2">
                  Education
                </p>
                <div className="space-y-2">
                  {stats.profile.education.map((edu, i) => (
                    <div
                      key={i}
                      className="rounded-lg bg-white/[0.03] border border-white/[0.06] px-3 py-2.5 text-sm"
                    >
                      <p className="text-white/70 font-medium">{edu.degree}</p>
                      <p className="text-white/40 text-xs mt-0.5">
                        {edu.institute}
                      </p>
                      <p className="text-white/30 text-xs">
                        {edu.startYear} – {edu.yearOfPassing || "Present"}
                        {edu.grade ? ` · ${edu.grade}` : ""}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-5 flex justify-end">
            <Link
              to="/admin/profile"
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
              }}
            >
              Edit Profile
            </Link>
          </div>
        </Modal>
      )}
    </AdminLayout>
  );
}

// ── Reusable Modal wrapper ────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-white/[0.08] bg-[#0e0e1a] p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="text-white/30 hover:text-white/70 transition-colors cursor-pointer text-xl leading-none"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Read-only row ─────────────────────────────────────────────────────────────
function ReadRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex gap-3 text-sm">
      <span className="text-white/35 w-24 flex-shrink-0">{label}</span>
      <span className="text-white/70 break-words min-w-0 flex-1">
        {value}
      </span>{" "}
    </div>
  );
}
