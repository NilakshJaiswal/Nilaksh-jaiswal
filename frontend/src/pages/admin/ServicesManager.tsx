import { useEffect, useState } from "react";
import { Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { adminApi } from "../../lib/api";
import { Notice } from "../../components/admin/Notice";
import type { Service } from "../../types";

const EMPTY_FORM = { title: "", description: "", ctaLabel: "", ctaLink: "" };

export function ServicesManager() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [notice, setNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [creating, setCreating] = useState(false);

  function load() {
    setLoading(true);
    adminApi
      .get("/services")
      .then((res) => setServices(res.data))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleCreate() {
    if (!form.title.trim() || !form.description.trim()) {
      setNotice({ type: "error", message: "Title and description are required." });
      return;
    }
    setCreating(true);
    try {
      await adminApi.post("/services", { ...form, order: services.length, visible: true });
      setForm(EMPTY_FORM);
      setNotice({ type: "success", message: "Service added." });
      load();
    } catch (err: any) {
      setNotice({ type: "error", message: err?.response?.data?.error || "Failed to add service." });
    } finally {
      setCreating(false);
    }
  }

  async function toggleVisible(item: Service) {
    await adminApi.put(`/services/${item._id}`, { visible: !item.visible });
    load();
  }

  async function handleDelete(item: Service) {
    if (!window.confirm(`Delete "${item.title}"? This can't be undone.`)) return;
    await adminApi.delete(`/services/${item._id}`);
    load();
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-black uppercase mb-1">Services</h1>
      <p className="text-white/40 text-sm mb-6">Describe your technical capabilities — only visible items show publicly.</p>

      <Notice type={notice?.type || "success"} message={notice?.message || ""} />

      <div className="border border-white/10 rounded-2xl p-5 mb-6">
        <h2 className="text-sm font-medium uppercase tracking-wide text-white/50 mb-4">Add a service</h2>
        <div className="flex flex-col gap-3">
          <input
            placeholder="Title (e.g. Full-Stack Development)"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="bg-transparent border border-white/10 rounded-lg px-3 py-2 text-sm"
          />
          <textarea
            placeholder="Short description"
            rows={2}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="bg-transparent border border-white/10 rounded-lg px-3 py-2 text-sm resize-y"
          />
          <div className="grid sm:grid-cols-3 gap-3">
            <input
              placeholder="CTA label (optional)"
              value={form.ctaLabel}
              onChange={(e) => setForm((f) => ({ ...f, ctaLabel: e.target.value }))}
              className="bg-transparent border border-white/10 rounded-lg px-3 py-2 text-sm"
            />
            <input
              placeholder="CTA link (optional)"
              value={form.ctaLink}
              onChange={(e) => setForm((f) => ({ ...f, ctaLink: e.target.value }))}
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
      </div>

      {loading ? (
        <p className="text-white/40 text-sm">Loading…</p>
      ) : services.length === 0 ? (
        <p className="text-white/30 text-sm">No services yet. Add your first one above.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {services.map((item, i) => (
            <li key={item._id} className="flex items-start gap-3 border border-white/10 rounded-xl px-4 py-3">
              <span className="text-white/20 font-black text-sm pt-0.5">{String(i + 1).padStart(2, "0")}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-white/40 mt-0.5">{item.description}</p>
              </div>
              <button
                onClick={() => toggleVisible(item)}
                className="text-white/40 hover:text-white"
                aria-label={item.visible ? "Hide" : "Show"}
              >
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
