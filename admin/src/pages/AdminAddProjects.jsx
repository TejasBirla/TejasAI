import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, X } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import useAdmin from "../context/useAdmin";

const API = import.meta.env.VITE_BACKEND_URL;

const EMPTY_FORM = {
  title: "",
  description: "",
  techStack: [],
  features: [],
  liveDemo: "",
  repoLink: "",
};

export default function AdminAddProject() {
  const { authHeaders } = useAdmin();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_FORM);
  const [techInput, setTechInput] = useState("");
  const [featureInput, setFeatureInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

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
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/project/add-project`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to add project.");
        return;
      }
      navigate("/admin/projects");
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto space-y-6">
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
              Add Project
            </h1>
            <p className="text-sm text-white/35">Fill in the details below</p>
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
              disabled={loading}
              className="flex-1 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
              }}
            >
              {loading ? "Adding..." : "Add Project"}
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

// ── Reusable form components ──────────────────────────────────────────────────

export function FormSection({ title, children }) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 space-y-4">
      <h2 className="text-xs font-bold text-white/50 uppercase tracking-widest">
        {title}
      </h2>
      {children}
    </div>
  );
}

export function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-white/50 mb-1.5">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-white/[0.05] border border-white/[0.10] rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-violet-500/50 focus:bg-white/[0.07] transition-all"
      />
    </div>
  );
}

export function TextareaField({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 3,
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-white/50 mb-1.5">
        {label}
      </label>
      <textarea
        name={name}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full bg-white/[0.05] border border-white/[0.10] rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-violet-500/50 focus:bg-white/[0.07] transition-all resize-none"
      />
    </div>
  );
}

export function TagInput({
  label,
  input,
  setInput,
  onAdd,
  tags,
  onRemove,
  tagColor,
  placeholder,
}) {
  const colorMap = {
    violet: {
      tag: "bg-violet-500/10 border-violet-500/20 text-violet-300",
      x: "text-violet-400 hover:text-red-400",
    },
    cyan: {
      tag: "bg-cyan-500/10 border-cyan-500/20 text-cyan-300",
      x: "text-cyan-400 hover:text-red-400",
    },
  };
  const c = colorMap[tagColor] || colorMap.violet;

  return (
    <div>
      <label className="block text-xs font-medium text-white/50 mb-1.5">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), onAdd())}
          placeholder={placeholder}
          className="flex-1 bg-white/[0.05] border border-white/[0.10] rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-violet-500/50 transition-all"
        />
        <button
          type="button"
          onClick={onAdd}
          className="px-4 py-2.5 rounded-xl text-sm font-medium text-white cursor-pointer hover:scale-105 transition-all"
          style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)" }}
        >
          Add
        </button>
      </div>
      {tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {tags.map((tag) => (
            <span
              key={tag}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium ${c.tag}`}
            >
              {tag}
              <button
                type="button"
                onClick={() => onRemove(tag)}
                className={`transition-colors cursor-pointer ${c.x}`}
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
