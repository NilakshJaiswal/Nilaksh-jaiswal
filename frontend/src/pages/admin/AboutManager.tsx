import { useEffect, useState } from "react";
import { adminApi } from "../../lib/api";
import { Notice } from "../../components/admin/Notice";
import { ImageUploadField } from "../../components/admin/ImageUploadField";
import type { AboutContent } from "../../types";

const EMPTY: AboutContent = {
  heading: "About Me",
  introduction: "",
  biography: "",
  professionalTitle: "",
  education: "",
  profileImage: "",
  supportingImages: [],
  resumeUrl: "",
  ctaLabel: "Contact Me",
  ctaLink: "#contact",
  visible: true,
};

export function AboutManager() {
  const [draft, setDraft] = useState<AboutContent>(EMPTY);
  const [published, setPublished] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    adminApi
      .get("/about")
      .then((res) => {
        setDraft({ ...EMPTY, ...res.data.draft });
        setPublished(res.data.published);
      })
      .finally(() => setLoading(false));
  }, []);

  function set<K extends keyof AboutContent>(key: K, value: AboutContent[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setNotice(null);
    try {
      await adminApi.put("/about", draft);
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
      await adminApi.put("/about", draft);
      const res = await adminApi.post("/about/publish");
      setPublished(res.data.published);
      setNotice({ type: "success", message: "Published! The public site now shows this content." });
    } catch (err: any) {
      setNotice({ type: "error", message: err?.response?.data?.error || "Publish failed." });
    } finally {
      setPublishing(false);
    }
  }

  if (loading) return <p className="text-white/40 text-sm">Loading…</p>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-black uppercase mb-1">About</h1>
      <p className="text-white/40 text-sm mb-6">
        {published ? "Currently published." : "Not published yet — draft changes won't show on the site until you publish."}
      </p>

      <Notice type={notice?.type || "success"} message={notice?.message || ""} />

      <div className="flex flex-col gap-4">
        <Field label="Section heading" value={draft.heading} onChange={(v) => set("heading", v)} />
        <Field label="Professional title" value={draft.professionalTitle} onChange={(v) => set("professionalTitle", v)} />
        <Field
          label="Education"
          value={draft.education}
          onChange={(v) => set("education", v)}
          placeholder="SRM Institute of Science and Technology"
        />
        <TextArea label="Short introduction" value={draft.introduction} onChange={(v) => set("introduction", v)} rows={3} />
        <TextArea label="Full biography" value={draft.biography} onChange={(v) => set("biography", v)} rows={6} />
        <ImageUploadField label="Profile image" value={draft.profileImage} onChange={(v) => set("profileImage", v)} />
        <Field label="Resume / CV URL" value={draft.resumeUrl} onChange={(v) => set("resumeUrl", v)} placeholder="/resume.pdf or a hosted link" />
        <div className="grid grid-cols-2 gap-4">
          <Field label="CTA label" value={draft.ctaLabel} onChange={(v) => set("ctaLabel", v)} />
          <Field label="CTA link" value={draft.ctaLink} onChange={(v) => set("ctaLink", v)} />
        </div>
        <label className="flex items-center gap-2 text-sm text-white/60">
          <input type="checkbox" checked={draft.visible} onChange={(e) => set("visible", e.target.checked)} />
          Visible on public site
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

function TextArea({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="block text-sm text-white/60 mb-1">{label}</span>
      <textarea
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2 text-white resize-y"
      />
    </label>
  );
}
