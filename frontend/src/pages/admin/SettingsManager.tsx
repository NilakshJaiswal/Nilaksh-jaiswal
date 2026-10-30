import { useEffect, useState, ReactNode } from "react";
import { Trash2, Plus } from "lucide-react";
import { adminApi } from "../../lib/api";
import { Notice } from "../../components/admin/Notice";
import type { SettingsContent } from "../../types";

const EMPTY: SettingsContent = {
  siteName: "Nilaksh Jaiswal",
  pageTitle: "Nilaksh Jaiswal — Full-Stack Developer",
  metaDescription: "",
  favicon: "",
  logoText: "Nilaksh.",
  navLabels: { about: "About", skills: "Skills", projects: "Projects", experience: "Experience", contact: "Contact" },
  footerText: "",
  copyrightText: "",
  heroHeading: "HI, I'M NILAKSH",
  heroRoleLabel: "DEVELOPER",
  heroTypewriterText: "I bring your imagination to life on screen",
  heroActions: [],
  backgroundVideoUrl: "",
  marqueeItems: [],
  sectionVisibility: {
    hero: true,
    marquee: true,
    about: true,
    skills: true,
    services: true,
    projects: true,
    experience: true,
    contact: true,
  },
};

export function SettingsManager() {
  const [draft, setDraft] = useState<SettingsContent>(EMPTY);
  const [published, setPublished] = useState<SettingsContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    adminApi
      .get("/settings")
      .then((res) => {
        const saved = res.data.draft ?? {};
        setDraft({
          ...EMPTY,
          ...saved,
          navLabels: { ...EMPTY.navLabels, ...saved.navLabels },
          sectionVisibility: { ...EMPTY.sectionVisibility, ...saved.sectionVisibility },
        });
        setPublished(res.data.published);
      })
      .finally(() => setLoading(false));
  }, []);

  function set<K extends keyof SettingsContent>(key: K, value: SettingsContent[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setNotice(null);
    try {
      await adminApi.put("/settings", draft);
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
      await adminApi.put("/settings", draft);
      const res = await adminApi.post("/settings/publish");
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
    <div className="max-w-2xl pb-20">
      <h1 className="text-2xl font-black uppercase mb-1">Settings</h1>
      <p className="text-white/40 text-sm mb-6">{published ? "Currently published." : "Not published yet."}</p>

      <Notice type={notice?.type || "success"} message={notice?.message || ""} />

      <Section title="Site identity">
        <Field label="Site name" value={draft.siteName} onChange={(v) => set("siteName", v)} />
        <Field label="Browser page title" value={draft.pageTitle} onChange={(v) => set("pageTitle", v)} />
        <Field label="Meta description" value={draft.metaDescription} onChange={(v) => set("metaDescription", v)} />
        <Field label="Logo wordmark" value={draft.logoText} onChange={(v) => set("logoText", v)} />
      </Section>

      <Section title="Navigation labels">
        <div className="grid grid-cols-2 gap-3">
          {(["about", "skills", "projects", "experience", "contact"] as const).map((key) => (
            <Field
              key={key}
              label={key[0].toUpperCase() + key.slice(1)}
              value={draft.navLabels[key]}
              onChange={(v) => set("navLabels", { ...draft.navLabels, [key]: v })}
            />
          ))}
        </div>
      </Section>

      <Section title="Hero">
        <Field label="Hero heading" value={draft.heroHeading} onChange={(v) => set("heroHeading", v)} />
        <Field label="Role label" value={draft.heroRoleLabel} onChange={(v) => set("heroRoleLabel", v)} />
        <Field label="Typewriter intro text" value={draft.heroTypewriterText} onChange={(v) => set("heroTypewriterText", v)} />
        <Field label="Background video URL" value={draft.backgroundVideoUrl} onChange={(v) => set("backgroundVideoUrl", v)} placeholder="https://…mp4" />

        <ArrayEditor
          label="Action buttons"
          items={draft.heroActions}
          onChange={(v) => set("heroActions", v)}
          renderRow={(item, update) => (
            <>
              <input
                value={item.label}
                placeholder="Label"
                onChange={(e) => update({ ...item, label: e.target.value })}
                className="w-1/3 bg-transparent border border-white/10 rounded-lg px-3 py-2 text-sm"
              />
              <input
                value={item.link}
                placeholder="#section or https://…"
                onChange={(e) => update({ ...item, link: e.target.value })}
                className="flex-1 bg-transparent border border-white/10 rounded-lg px-3 py-2 text-sm"
              />
            </>
          )}
          newItem={{ label: "", link: "" }}
        />
      </Section>

      <Section title="Marquee items">
        <ArrayEditor
          label="Images"
          items={draft.marqueeItems}
          onChange={(v) => set("marqueeItems", v)}
          renderRow={(item, update) => (
            <>
              <input
                value={item.imageUrl}
                placeholder="Image URL"
                onChange={(e) => update({ ...item, imageUrl: e.target.value })}
                className="flex-1 bg-transparent border border-white/10 rounded-lg px-3 py-2 text-sm"
              />
              <input
                value={item.label}
                placeholder="Label"
                onChange={(e) => update({ ...item, label: e.target.value })}
                className="w-1/4 bg-transparent border border-white/10 rounded-lg px-3 py-2 text-sm"
              />
              <label className="flex items-center gap-1 text-xs text-white/50 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={item.isOwnWork}
                  onChange={(e) => update({ ...item, isOwnWork: e.target.checked })}
                />
                My work
              </label>
            </>
          )}
          newItem={{ imageUrl: "", label: "", isOwnWork: false }}
        />
        <p className="text-white/30 text-xs mt-1">
          Tiles not marked "My work" are labeled as inspiration references on the public site, not claimed as your own projects.
        </p>
      </Section>

      <Section title="Footer">
        <Field label="Footer text" value={draft.footerText} onChange={(v) => set("footerText", v)} />
        <Field label="Copyright text" value={draft.copyrightText} onChange={(v) => set("copyrightText", v)} placeholder="© 2026 Nilaksh Jaiswal. All rights reserved." />
      </Section>

      <Section title="Section visibility">
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(draft.sectionVisibility) as (keyof SettingsContent["sectionVisibility"])[]).map((key) => (
            <label key={key} className="flex items-center gap-2 text-sm text-white/60">
              <input
                type="checkbox"
                checked={draft.sectionVisibility[key]}
                onChange={(e) => set("sectionVisibility", { ...draft.sectionVisibility, [key]: e.target.checked })}
              />
              {key[0].toUpperCase() + key.slice(1)}
            </label>
          ))}
        </div>
      </Section>

      <div className="flex gap-3 mt-8 sticky bottom-0 bg-ink py-4">
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

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border border-white/10 rounded-2xl p-5 mb-5">
      <h2 className="text-sm font-medium uppercase tracking-wide text-white/50 mb-4">{title}</h2>
      <div className="flex flex-col gap-4">{children}</div>
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

function ArrayEditor<T>({
  label,
  items,
  onChange,
  renderRow,
  newItem,
}: {
  label: string;
  items: T[];
  onChange: (items: T[]) => void;
  renderRow: (item: T, update: (next: T) => void) => ReactNode;
  newItem: T;
}) {
  return (
    <div>
      <span className="block text-sm text-white/60 mb-2">{label}</span>
      {items.map((item, i) => (
        <div key={i} className="flex gap-2 mb-2 items-center">
          {renderRow(item, (next) => {
            const copy = [...items];
            copy[i] = next;
            onChange(copy);
          })}
          <button
            type="button"
            onClick={() => onChange(items.filter((_, idx) => idx !== i))}
            className="text-white/40 hover:text-red-400"
            aria-label="Remove"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, newItem])}
        className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-white"
      >
        <Plus size={14} /> Add
      </button>
    </div>
  );
}
