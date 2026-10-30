import { useEffect, useState } from "react";
import { Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { adminApi } from "../../lib/api";
import { Notice } from "../../components/admin/Notice";
import type { Experience } from "../../types";

const EMPTY_FORM = {
  company: "",
  role: "",
  employmentType: "",
  location: "",
  startDate: "",
  endDate: "",
  currentlyWorking: false,
  description: "",
};

export function ExperienceManager() {
  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [notice, setNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [creating, setCreating] = useState(false);

  function load() {
    setLoading(true);
    adminApi
      .get("/experience")
      .then((res) => setItems(res.data))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleCreate() {
    if (!form.company.trim() || !form.role.trim() || !form.startDate) {
      setNotice({ type: "error", message: "Company, role and start date are required." });
      return;
    }
    setCreating(true);
    try {
      const { endDate, ...rest } = form;
      await adminApi.post("/experience", {
        ...rest,
        ...(form.currentlyWorking || !endDate ? {} : { endDate }),
        order: items.length,
        visible: true,
      });
      setForm(EMPTY_FORM);
      setNotice({ type: "success", message: "Experience added." });
      load();
    } catch (err: any) {
      setNotice({ type: "error", message: err?.response?.data?.error || "Failed to add." });
    } finally {
      setCreating(false);
    }
  }

  async function toggleVisible(item: Experience) {
    await adminApi.put(`/experience/${item._id}`, { visible: !item.visible });
    load();
  }

  async function handleDelete(item: Experience) {
    if (!window.confirm(`Delete "${item.role} at ${item.company}"? This can't be undone.`)) return;
    await adminApi.delete(`/experience/${item._id}`);
    load();
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-black uppercase mb-1">Experience</h1>
      <p className="text-white/40 text-sm mb-6">Only visible entries show on the public site.</p>

      <Notice type={notice?.type || "success"} message={notice?.message || ""} />

      <div className="border border-white/10 rounded-2xl p-5 mb-6">
        <h2 className="text-sm font-medium uppercase tracking-wide text-white/50 mb-4">Add an entry</h2>
        <div className="grid sm:grid-cols-2 gap-3 mb-3">
          <input
            placeholder="Company"
            value={form.company}
            onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
            className="bg-transparent border border-white/10 rounded-lg px-3 py-2 text-sm"
          />
          <input
            placeholder="Role"
            value={form.role}
            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
            className="bg-transparent border border-white/10 rounded-lg px-3 py-2 text-sm"
          />
          <input
            placeholder="Employment type (optional)"
            value={form.employmentType}
            onChange={(e) => setForm((f) => ({ ...f, employmentType: e.target.value }))}
            className="bg-transparent border border-white/10 rounded-lg px-3 py-2 text-sm"
          />
          <input
            placeholder="Location (optional)"
            value={form.location}
            onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
            className="bg-transparent border border-white/10 rounded-lg px-3 py-2 text-sm"
          />
          <label className="flex flex-col text-xs text-white/50 gap-1">
            Start date
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
              className="bg-transparent border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
            />
          </label>
          <label className="flex flex-col text-xs text-white/50 gap-1">
            End date
            {form.currentlyWorking ? (
              <div className="border border-green-500/30 bg-green-500/10 text-green-400 rounded-lg px-3 py-2 text-sm h-[42px] flex items-center">
                Present (currently working)
              </div>
            ) : (
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                className="bg-transparent border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
              />
            )}
          </label>
        </div>
        <label className="flex items-center gap-3 text-sm text-white mb-3 border border-white/10 rounded-lg px-4 py-3 cursor-pointer hover:bg-white/5">
          <input
            type="checkbox"
            className="w-4 h-4"
            checked={form.currentlyWorking}
            onChange={(e) => setForm((f) => ({ ...f, currentlyWorking: e.target.checked, endDate: "" }))}
          />
          <span>
            I currently work here
            <span className="block text-xs text-white/40">No end date needed — it will show as "Present" on your site.</span>
          </span>
        </label>
        <textarea
          placeholder="Description (optional)"
          rows={2}
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2 text-sm resize-y mb-3"
        />
        <button
          onClick={handleCreate}
          disabled={creating}
          className="inline-flex items-center gap-1 border-2 border-mist text-mist rounded-lg px-4 py-2 text-sm hover:bg-mist/10 disabled:opacity-50"
        >
          <Plus size={14} /> Add entry
        </button>
      </div>

      {loading ? (
        <p className="text-white/40 text-sm">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-white/30 text-sm">No experience entries yet.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <li key={item._id} className="flex items-start gap-3 border border-white/10 rounded-xl px-4 py-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">
                  {item.role} <span className="text-white/40">· {item.company}</span>
                </p>
                <p className="text-xs text-white/40">
                  {new Date(item.startDate).toLocaleDateString()} —{" "}
                  {item.currentlyWorking ? "Present" : item.endDate ? new Date(item.endDate).toLocaleDateString() : "—"}
                </p>
              </div>
              <button onClick={() => toggleVisible(item)} className="text-white/40 hover:text-white" aria-label={item.visible ? "Hide" : "Show"}>
                {item.visible ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
              <button onClick={() => handleDelete(item)} className="text-white/40 hover:text-red-400" aria-label="Delete">
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
