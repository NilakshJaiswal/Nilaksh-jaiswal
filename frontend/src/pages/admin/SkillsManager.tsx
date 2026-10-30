import { useEffect, useState } from "react";
import { Plus, Trash2, Eye, EyeOff, GripVertical } from "lucide-react";
import { adminApi } from "../../lib/api";
import { Notice } from "../../components/admin/Notice";
import type { Skill } from "../../types";

const EMPTY_FORM = { name: "", category: "", icon: "", level: "" };

export function SkillsManager() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [notice, setNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [creating, setCreating] = useState(false);

  function load() {
    setLoading(true);
    adminApi
      .get("/skills")
      .then((res) => setSkills(res.data))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleCreate() {
    if (!form.name.trim() || !form.category.trim()) {
      setNotice({ type: "error", message: "Name and category are required." });
      return;
    }
    setCreating(true);
    try {
      await adminApi.post("/skills", { ...form, order: skills.length, visible: true });
      setForm(EMPTY_FORM);
      setNotice({ type: "success", message: "Skill added." });
      load();
    } catch (err: any) {
      setNotice({ type: "error", message: err?.response?.data?.error || "Failed to add skill." });
    } finally {
      setCreating(false);
    }
  }

  async function toggleVisible(skill: Skill) {
    await adminApi.put(`/skills/${skill._id}`, { visible: !skill.visible });
    load();
  }

  async function handleDelete(skill: Skill) {
    if (!window.confirm(`Delete "${skill.name}"? This can't be undone.`)) return;
    await adminApi.delete(`/skills/${skill._id}`);
    load();
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-black uppercase mb-1">Skills</h1>
      <p className="text-white/40 text-sm mb-6">Only visible skills appear on the public site.</p>

      <Notice type={notice?.type || "success"} message={notice?.message || ""} />

      <div className="border border-white/10 rounded-2xl p-5 mb-6">
        <h2 className="text-sm font-medium uppercase tracking-wide text-white/50 mb-4">Add a skill</h2>
        <div className="grid sm:grid-cols-4 gap-3">
          <input
            placeholder="Name (e.g. React)"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="bg-transparent border border-white/10 rounded-lg px-3 py-2 text-sm"
          />
          <input
            placeholder="Category (e.g. Frontend)"
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            className="bg-transparent border border-white/10 rounded-lg px-3 py-2 text-sm"
          />
          <input
            placeholder="Level (optional)"
            value={form.level}
            onChange={(e) => setForm((f) => ({ ...f, level: e.target.value }))}
            className="bg-transparent border border-white/10 rounded-lg px-3 py-2 text-sm"
          />
          <button
            onClick={handleCreate}
            disabled={creating}
            className="inline-flex items-center justify-center gap-1 border-2 border-mist text-mist rounded-lg px-3 py-2 text-sm hover:bg-mist/10 disabled:opacity-50"
          >
            <Plus size={14} /> Add
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-white/40 text-sm">Loading…</p>
      ) : skills.length === 0 ? (
        <p className="text-white/30 text-sm">No skills yet. Add your first one above.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {skills.map((skill) => (
            <li
              key={skill._id}
              className="flex items-center gap-3 border border-white/10 rounded-xl px-4 py-3"
            >
              <GripVertical size={14} className="text-white/20" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{skill.name}</p>
                <p className="text-xs text-white/40">
                  {skill.category}
                  {skill.level ? ` · ${skill.level}` : ""}
                </p>
              </div>
              <button
                onClick={() => toggleVisible(skill)}
                className="text-white/40 hover:text-white"
                aria-label={skill.visible ? "Hide" : "Show"}
                title={skill.visible ? "Visible — click to hide" : "Hidden — click to show"}
              >
                {skill.visible ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
              <button
                onClick={() => handleDelete(skill)}
                className="text-white/40 hover:text-red-400"
                aria-label="Delete"
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
