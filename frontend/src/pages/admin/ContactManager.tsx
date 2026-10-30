import { useEffect, useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { adminApi } from "../../lib/api";
import { Notice } from "../../components/admin/Notice";
import type { ContactContent } from "../../types";

const EMPTY: ContactContent = {
  heading: "Let's Build Something",
  description: "Have an idea, a project, or an opportunity? Let's connect.",
  email: "",
  phone: "",
  location: "",
  githubUrl: "",
  linkedinUrl: "",
  otherSocialLinks: [],
  ctaLabel: "Contact Me",
  contactFormEnabled: false,
};

export function ContactManager() {
  const [draft, setDraft] = useState<ContactContent>(EMPTY);
  const [published, setPublished] = useState<ContactContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    adminApi
      .get("/contact")
      .then((res) => {
        setDraft({ ...EMPTY, ...res.data.draft });
        setPublished(res.data.published);
      })
      .finally(() => setLoading(false));
  }, []);

  function set<K extends keyof ContactContent>(key: K, value: ContactContent[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setNotice(null);
    try {
      await adminApi.put("/contact", draft);
      setNotice({ type: "success", message: "Draft saved." });
    } catch (err: any) {
      setNotice({ type: "error", message: err?.response?.data?.error || "Save failed." });
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish() {
    setPublishing(true);
    setNotice(null);
    try {
      await adminApi.put("/contact", draft);
      const res = await adminApi.post("/contact/publish");
      setPublished(res.data.published);
      setNotice({ type: "success", message: "Published!" });
    } catch (err: any) {
      setNotice({ type: "error", message: err?.response?.data?.error || "Publish failed." });
    } finally {
      setPublishing(false);
    }
  }

  if (loading) return <p className="text-white/40 text-sm">Loading…</p>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-black uppercase mb-1">Contact</h1>
      <p className="text-white/40 text-sm mb-6">
        {published ? "Currently published." : "Not published yet."}
      </p>

      <Notice type={notice?.type || "success"} message={notice?.message || ""} />

      <div className="flex flex-col gap-4">
        <Field label="Heading" value={draft.heading} onChange={(v) => set("heading", v)} />
        <Field label="Supporting text" value={draft.description} onChange={(v) => set("description", v)} />
        <Field label="Email" value={draft.email} onChange={(v) => set("email", v)} placeholder="you@example.com — leave blank to hide" />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Phone (optional)" value={draft.phone} onChange={(v) => set("phone", v)} />
          <Field label="Location (optional)" value={draft.location} onChange={(v) => set("location", v)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="GitHub URL" value={draft.githubUrl} onChange={(v) => set("githubUrl", v)} />
          <Field label="LinkedIn URL" value={draft.linkedinUrl} onChange={(v) => set("linkedinUrl", v)} />
        </div>
        <Field label="Contact button label" value={draft.ctaLabel} onChange={(v) => set("ctaLabel", v)} />

        <div>
          <span className="block text-sm text-white/60 mb-2">Other social links</span>
          {draft.otherSocialLinks.map((link, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                value={link.label}
                placeholder="Label"
                onChange={(e) => {
                  const next = [...draft.otherSocialLinks];
                  next[i] = { ...next[i], label: e.target.value };
                  set("otherSocialLinks", next);
                }}
                className="w-1/3 bg-transparent border border-white/10 rounded-lg px-3 py-2 text-sm"
              />
              <input
                value={link.url}
                placeholder="https://…"
                onChange={(e) => {
                  const next = [...draft.otherSocialLinks];
                  next[i] = { ...next[i], url: e.target.value };
                  set("otherSocialLinks", next);
                }}
                className="flex-1 bg-transparent border border-white/10 rounded-lg px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={() => set("otherSocialLinks", draft.otherSocialLinks.filter((_, idx) => idx !== i))}
                className="text-white/40 hover:text-red-400"
                aria-label="Remove link"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => set("otherSocialLinks", [...draft.otherSocialLinks, { label: "", url: "" }])}
            className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-white"
          >
            <Plus size={14} /> Add link
          </button>
        </div>

        <label className="flex items-center gap-2 text-sm text-white/60">
          <input
            type="checkbox"
            checked={draft.contactFormEnabled}
            onChange={(e) => set("contactFormEnabled", e.target.checked)}
          />
          Enable the on-site contact form (requires SMTP configured in the backend .env)
        </label>
      </div>

      <div className="flex gap-3 mt-8">
        <button
          onClick={handleSave}
          disabled={saving}
          className="border border-white/20 rounded-full px-6 py-2.5 text-sm hover:bg-white/5 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save draft"}
        </button>
        <button
          onClick={handlePublish}
          disabled={publishing}
          className="border-2 border-mist text-mist rounded-full px-6 py-2.5 text-sm hover:bg-mist/10 disabled:opacity-50"
        >
          {publishing ? "Publishing…" : "Publish"}
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="block text-sm text-white/60 mb-1">{label}</span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2 text-white"
      />
    </label>
  );
}
