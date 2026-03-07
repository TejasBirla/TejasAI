import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  FolderKanban,
  LogOut,
  Menu,
  ExternalLink,
} from "lucide-react";
import useAdmin from "../context/useAdmin";

const NAV_ITEMS = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/profile", label: "Profile", icon: User },
  { to: "/admin/projects", label: "Projects", icon: FolderKanban },
];

function Sidebar({ mobile = false, onClose, admin, onLogout, location }) {
  return (
    <aside
      className={`flex flex-col h-full bg-[#0e0e1a] border-r border-white/[0.07] ${
        mobile ? "w-64" : "w-56"
      }`}
    >
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/[0.07]">
        <Link
          to="/admin/dashboard"
          className="text-base font-black tracking-tight bg-gradient-to-r from-violet-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent"
        >
          TejasAI
        </Link>
        <p className="text-[10px] text-white/30 uppercase tracking-widest mt-0.5">
          Admin Panel
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-violet-500/15 text-violet-300 border border-violet-500/25"
                  : "text-white/50 hover:text-white/80 hover:bg-white/[0.05]"
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-4 border-t border-white/[0.07]">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)" }}
          >
            {admin?.username?.[0]?.toUpperCase() || "A"}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white/80 truncate">
              {admin?.username || "Admin"}
            </p>
            <p className="text-[10px] text-white/30">Administrator</p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 cursor-pointer"
        >
          <LogOut size={14} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default function AdminLayout({ children }) {
  const { admin, logout } = useAdmin();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="h-screen flex bg-[#07070f] text-white overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-shrink-0">
        <Sidebar
          admin={admin}
          onLogout={handleLogout}
          location={location}
          onClose={() => {}}
        />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative z-10">
            <Sidebar
              mobile
              admin={admin}
              onLogout={handleLogout}
              location={location}
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="flex-shrink-0 flex items-center justify-between px-4 md:px-6 py-3.5 border-b border-white/[0.07] bg-[#07070f]/90 backdrop-blur-xl">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center border border-white/10 bg-white/5 text-white/60 hover:bg-white/10 transition cursor-pointer"
          >
            <Menu size={16} />
          </button>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-white/35">System online</span>
          </div>

          <a
            href={import.meta.env.VITE_FRONTEND_URL || "/"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors"
          >
            <ExternalLink size={14} />
            View Site
          </a>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
