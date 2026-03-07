import React, { useEffect, useState } from "react";
import { X, Plus } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import useAdmin from "../context/useAdmin";

const API = import.meta.env.VITE_BACKEND_URL;

function Section({ title, children }) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 space-y-4">
      <h2 className="text-xs font-bold text-white/50 uppercase tracking-widest">
        {title}
      </h2>
      {children}
    </div>
  );
}

function InputField({
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

function TextareaField({
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

const emptyEdu = {
  degree: "",
  institute: "",
  startYear: "",
  yearOfPassing: "",
  grade: "",
  description: "",
};

export default function AdminProfile() {
  const { authHeaders } = useAdmin();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [skillInput, setSkillInput] = useState("");
  const [hobbyInput, setHobbyInput] = useState("");

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API}/api/profile/user-detail`, {
          headers: authHeaders,
        });
        if (!res.ok) throw new Error("Failed to fetch profile.");
        const data = await res.json();
        setProfile(data.data);
      } catch (err) {
        console.error("Profile fetch error:", err.message);
        setError("Could not load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      contact: { ...prev.contact, [name]: value },
    }));
  };

  // ── Education handlers
  const handleEduChange = (index, e) => {
    const { name, value } = e.target;
    setProfile((prev) => {
      const updated = [...prev.education];
      updated[index] = { ...updated[index], [name]: value };
      return { ...prev, education: updated };
    });
  };

  const addEducation = () => {
    setProfile((prev) => ({
      ...prev,
      education: [...(prev.education || []), { ...emptyEdu }],
    }));
  };

  const removeEducation = (index) => {
    setProfile((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  // ── Skills handlers
  const addSkill = () => {
    const s = skillInput.trim();
    if (!s || profile.skills.includes(s)) return;
    setProfile((prev) => ({ ...prev, skills: [...prev.skills, s] }));
    setSkillInput("");
  };

  const removeSkill = (skill) =>
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));

  // ── Hobbies handlers
  const addHobby = () => {
    const h = hobbyInput.trim();
    if (!h || profile.hobbies.includes(h)) return;
    setProfile((prev) => ({ ...prev, hobbies: [...prev.hobbies, h] }));
    setHobbyInput("");
  };

  const removeHobby = (hobby) =>
    setProfile((prev) => ({
      ...prev,
      hobbies: prev.hobbies.filter((h) => h !== hobby),
    }));

  const toggleAvailability = (name) =>
    setProfile((prev) => ({ ...prev, [name]: !prev[name] }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/profile/update-profile`, {
        method: "PATCH",
        headers: authHeaders,
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast("error", data.message || "Failed to save profile.");
        return;
      }
      showToast("success", "Profile updated successfully!");
    } catch (err) {
      console.error("Profile save error:", err.message);
      showToast("error", "Something went wrong.");
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

  if (error)
    return (
      <AdminLayout>
        <div className="max-w-3xl mx-auto">
          <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm">
            {error}
          </div>
        </div>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto space-y-6">
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
              Profile
            </h1>
            <p className="text-sm text-white/35 mt-1">
              Edit your profile information
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all duration-200 hover:scale-105 hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)" }}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* Basic Info */}
        <Section title="Basic Information">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Full Name"
              name="fullName"
              value={profile.fullName}
              onChange={handleChange}
              placeholder="Tejas Birla"
            />
            <InputField
              label="Title"
              name="title"
              value={profile.title}
              onChange={handleChange}
              placeholder="MERN Stack Developer"
            />
          </div>
          <TextareaField
            label="Bio"
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            placeholder="Short professional bio..."
            rows={3}
          />
          <InputField
            label="Portfolio URL"
            name="portfolio"
            value={profile.portfolio}
            onChange={handleChange}
            placeholder="https://yourportfolio.com"
          />
          <TextareaField
            label="Experience Summary"
            name="experienceSummary"
            value={profile.experienceSummary}
            onChange={handleChange}
            placeholder="Describe your experience..."
            rows={4}
          />
        </Section>

        {/* Contact */}
        <Section title="Contact">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Email"
              name="email"
              value={profile.contact?.email}
              onChange={handleContactChange}
              placeholder="you@email.com"
              type="email"
            />
            <InputField
              label="LinkedIn"
              name="linkedIn"
              value={profile.contact?.linkedIn}
              onChange={handleContactChange}
              placeholder="https://linkedin.com/in/..."
            />
            <InputField
              label="GitHub"
              name="github"
              value={profile.contact?.github}
              onChange={handleContactChange}
              placeholder="https://github.com/..."
            />
            <InputField
              label="X (Twitter)"
              name="twitter"
              value={profile.contact?.twitter}
              onChange={handleContactChange}
              placeholder="https://x.com/..."
            />
          </div>
        </Section>

        {/* Availability */}
        <Section title="Availability">
          <div className="flex flex-wrap gap-6">
            {[
              { name: "openToWork", label: "Open to full-time work" },
              { name: "freelanceAvailable", label: "Available for freelance" },
            ].map(({ name, label }) => (
              <label
                key={name}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div
                  onClick={() => toggleAvailability(name)}
                  className={`relative w-10 h-5 rounded-full transition-all duration-300 cursor-pointer ${profile[name] ? "bg-violet-500" : "bg-white/10"}`}
                >
                  <div
                    className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-300"
                    style={{ left: profile[name] ? "22px" : "2px" }}
                  />
                </div>
                <span className="text-sm text-white/60 group-hover:text-white/80 transition-colors">
                  {label}
                </span>
              </label>
            ))}
          </div>
        </Section>

        {/* Education */}
        <Section title="Education">
          <div className="space-y-4">
            {(profile.education || []).map((edu, index) => (
              <div
                key={index}
                className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 space-y-3 relative"
              >
                {/* Remove button */}
                <button
                  onClick={() => removeEducation(index)}
                  className="absolute top-3 right-3 text-white/25 hover:text-red-400 transition-colors cursor-pointer"
                >
                  <X size={14} />
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <InputField
                    label="Degree / Qualification"
                    name="degree"
                    value={edu.degree}
                    onChange={(e) => handleEduChange(index, e)}
                    placeholder="Bachelor of Computer Applications"
                  />
                  <InputField
                    label="Institute"
                    name="institute"
                    value={edu.institute}
                    onChange={(e) => handleEduChange(index, e)}
                    placeholder="Swift College, MDS University"
                  />
                  <InputField
                    label="Start Year"
                    name="startYear"
                    value={edu.startYear}
                    onChange={(e) => handleEduChange(index, e)}
                    placeholder="2023"
                  />
                  <InputField
                    label="Year of Passing"
                    name="yearOfPassing"
                    value={edu.yearOfPassing}
                    onChange={(e) => handleEduChange(index, e)}
                    placeholder="2026 (or leave blank if ongoing)"
                  />
                  <InputField
                    label="Grade / Percentage"
                    name="grade"
                    value={edu.grade}
                    onChange={(e) => handleEduChange(index, e)}
                    placeholder="Pursuing / 92.4%"
                  />
                </div>
                <TextareaField
                  label="Description (optional)"
                  name="description"
                  value={edu.description}
                  onChange={(e) => handleEduChange(index, e)}
                  placeholder="Brief description of what you studied..."
                  rows={2}
                />
              </div>
            ))}

            {/* Add education button */}
            <button
              onClick={addEducation}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-white/20 text-white/40 hover:text-white/70 hover:border-white/40 text-sm transition-all duration-200 cursor-pointer w-full justify-center"
            >
              <Plus size={14} />
              Add Education
            </button>
          </div>
        </Section>

        {/* Skills */}
        <Section title="Skills">
          <div className="flex gap-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addSkill()}
              placeholder="Add a skill and press Enter"
              className="flex-1 bg-white/[0.05] border border-white/[0.10] rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-violet-500/50 transition-all"
            />
            <button
              onClick={addSkill}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-white cursor-pointer hover:scale-105 transition-all"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
              }}
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {profile.skills?.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-medium"
              >
                {skill}
                <button
                  onClick={() => removeSkill(skill)}
                  className="text-violet-400 hover:text-red-400 transition-colors cursor-pointer"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </Section>

        {/* Hobbies */}
        <Section title="Hobbies & Interests">
          <div className="flex gap-2">
            <input
              type="text"
              value={hobbyInput}
              onChange={(e) => setHobbyInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addHobby()}
              placeholder="Add a hobby and press Enter"
              className="flex-1 bg-white/[0.05] border border-white/[0.10] rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-violet-500/50 transition-all"
            />
            <button
              onClick={addHobby}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-white cursor-pointer hover:scale-105 transition-all"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
              }}
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {profile.hobbies?.map((hobby) => (
              <span
                key={hobby}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-medium"
              >
                {hobby}
                <button
                  onClick={() => removeHobby(hobby)}
                  className="text-cyan-400 hover:text-red-400 transition-colors cursor-pointer"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </Section>

        {/* Save button bottom */}
        <div className="flex justify-end pb-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 hover:scale-105 hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] disabled:opacity-50 cursor-pointer"
            style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)" }}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
