import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, FolderKanban, ExternalLink, Pencil, Trash2 } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import useAdmin from "../context/useAdmin";

const API = import.meta.env.VITE_BACKEND_URL;

export default function AdminProjects() {
  const { authHeaders } = useAdmin();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API}/api/project/all-project`, {
        headers: authHeaders,
      });
      if (!res.ok) throw new Error("Failed to fetch projects.");
      const data = await res.json();
      setProjects(data.allprojects || []);
    } catch (err) {
      console.error("Fetch projects error:", err.message);
      showToast("error", "Failed to load projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;
    setDeletingId(id);
    try {
      const res = await fetch(`${API}/api/project/delete-project/${id}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      if (!res.ok) throw new Error("Delete request failed.");
      setProjects((prev) => prev.filter((p) => p._id !== id));
      showToast("success", "Project deleted.");
    } catch (err) {
      console.error("Delete project error:", err.message);
      showToast("error", "Failed to delete project.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Toast */}
        {toast && (
          <div
            className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl text-sm font-medium shadow-lg border ${
              toast.type === "success"
                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                : "bg-red-500/15 border-red-500/30 text-red-400"
            }`}
          >
            {toast.msg}
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Projects
            </h1>
            <p className="text-sm text-white/35 mt-1">
              {projects.length} project{projects.length !== 1 ? "s" : ""} total
            </p>
          </div>
          <Link
            to="/admin/projects/add"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:scale-105 hover:shadow-[0_0_20px_rgba(124,58,237,0.4)]"
            style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)" }}
          >
            <Plus size={16} />
            Add Project
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center h-48">
            <div className="w-6 h-6 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
          </div>
        )}

        {/* Empty */}
        {!loading && projects.length === 0 && (
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-12 text-center">
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center mx-auto mb-4">
              <FolderKanban size={24} />
            </div>
            <p className="text-white/50 text-sm mb-4">No projects yet</p>
            <Link
              to="/admin/projects/add"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
              }}
            >
              Add your first project
            </Link>
          </div>
        )}

        {/* Project list */}
        {!loading && projects.length > 0 && (
          <div className="space-y-3">
            {projects.map((project) => (
              <div
                key={project._id}
                className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 hover:border-violet-500/20 transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-bold text-white mb-1 truncate">
                      {project.title}
                    </h3>
                    <p className="text-sm text-white/45 line-clamp-2 mb-3">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.techStack?.slice(0, 5).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded-lg bg-white/[0.05] border border-white/[0.08] text-white/50 text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.techStack?.length > 5 && (
                        <span className="px-2 py-0.5 rounded-lg bg-white/[0.05] border border-white/[0.08] text-white/30 text-xs">
                          +{project.techStack.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {project.liveDemo && (
                      <a
                        href={project.liveDemo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-lg flex items-center justify-center border border-white/10 bg-white/[0.04] text-white/40 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
                        title="Live Demo"
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}
                    <Link
                      to={`/admin/projects/edit/${project._id}`}
                      className="w-8 h-8 rounded-lg flex items-center justify-center border border-white/10 bg-white/[0.04] text-white/40 hover:text-violet-400 hover:border-violet-500/30 transition-all"
                      title="Edit"
                    >
                      <Pencil size={14} />
                    </Link>
                    <button
                      onClick={() => handleDelete(project._id)}
                      disabled={deletingId === project._id}
                      className="w-8 h-8 rounded-lg flex items-center justify-center border border-white/10 bg-white/[0.04] text-white/40 hover:text-red-400 hover:border-red-500/30 transition-all disabled:opacity-50 cursor-pointer"
                      title="Delete"
                    >
                      {deletingId === project._id ? (
                        <div className="w-3 h-3 rounded-full border border-red-400 border-t-transparent animate-spin" />
                      ) : (
                        <Trash2 size={14} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
