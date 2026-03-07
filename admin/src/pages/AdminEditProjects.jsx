import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import useAdmin from "../context/useAdmin";
import { FormSection, Field, TextareaField, TagInput } from "../pages/AdminAddProjects";

const API = import.meta.env.VITE_BACKEND_URL;

export default function AdminEditProject() {
  const { id } = useParams();
  const { authHeaders } = useAdmin();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [techInput, setTechInput] = useState("");
  const [featureInput, setFeatureInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`${API}/api/project/all-project`, {
          headers: authHeaders,
        });
        const data = await res.json();
        const project = (data.allprojects || []).find((p) => p._id === id);
        if (!project) {
          setError("Project not found.");
          return;
        }
        setForm({
          title: project.title || "",
          description: project.description || "",
          techStack: project.techStack || [],
          features: project.features || [],
          liveDemo: project.liveDemo || "",
          repoLink: project.repoLink || "",
        });
      } catch {
        setError("Failed to load project.");
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const addTag = (field, input, setInput) => {
    const val = input.trim();
    if (!val || form[field].includes(val)) return;
    setForm((prev) => ({ ...prev, [field]: [...prev[field], val] }));
    setInput("");
  };

  const removeTag = (field, val) =>
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].filter((v) => v !== val),
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (
      !form.title ||
      !form.description ||
      form.techStack.length === 0 ||
      !form.repoLink
    ) {
      setError(
        "Title, description, at least one tech, and repo link are required.",
      );
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/project/update-project/${id}`, {
        method: "PATCH",
        headers: authHeaders,
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to update project.");
        return;
      }
      showToast("success", "Project updated!");
      setTimeout(() => navigate("/admin/projects"), 1000);
    } catch {
      setError("Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-6 h-6 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
        </div>
      </AdminLayout>
    );

  if (error && !form)
    return (
      <AdminLayout>
        <div className="max-w-2xl mx-auto">
          <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm">
            {error}
          </div>
        </div>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto space-y-6">
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
        <div className="flex items-center gap-3">
          <Link
            to="/admin/projects"
            className="w-8 h-8 rounded-lg flex items-center justify-center border border-white/10 bg-white/[0.04] text-white/40 hover:text-white/70 transition-all"
          >
            <ArrowLeft size={14} />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Edit Project
            </h1>
            <p className="text-sm text-white/35 truncate">{form?.title}</p>
          </div>
        </div>

        {error && (
          <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <FormSection title="Basic Details">
            <Field
              label="Project Title *"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. QuickLink"
            />
            <TextareaField
              label="Description *"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="What does this project do?"
              rows={4}
            />
          </FormSection>

          <FormSection title="Links">
            <Field
              label="Repository Link *"
              name="repoLink"
              value={form.repoLink}
              onChange={handleChange}
              placeholder="https://github.com/..."
            />
            <Field
              label="Live Demo URL"
              name="liveDemo"
              value={form.liveDemo}
              onChange={handleChange}
              placeholder="https://yourapp.vercel.app"
            />
          </FormSection>

          <FormSection title="Tech Stack *">
            <TagInput
              label="Add technologies"
              input={techInput}
              setInput={setTechInput}
              onAdd={() => addTag("techStack", techInput, setTechInput)}
              tags={form.techStack}
              onRemove={(v) => removeTag("techStack", v)}
              tagColor="violet"
              placeholder="e.g. React.js"
            />
          </FormSection>

          <FormSection title="Key Features">
            <TagInput
              label="Add features"
              input={featureInput}
              setInput={setFeatureInput}
              onAdd={() => addTag("features", featureInput, setFeatureInput)}
              tags={form.features}
              onRemove={(v) => removeTag("features", v)}
              tagColor="cyan"
              placeholder="e.g. Real-time updates"
            />
          </FormSection>

          <div className="flex gap-3 pb-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
              }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <Link
              to="/admin/projects"
              className="px-6 py-3 rounded-xl font-semibold text-sm border border-white/10 text-white/50 hover:text-white/70 hover:bg-white/[0.05] transition-all text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
