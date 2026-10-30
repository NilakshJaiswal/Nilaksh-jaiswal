import { useEffect, useState } from "react";
import { Plus, Trash2, Globe, EyeOff } from "lucide-react";
import { adminApi } from "../../lib/api";
import { Notice } from "../../components/admin/Notice";
import { ImageUploadField } from "../../components/admin/ImageUploadField";
import type { Project } from "../../types";

const EMPTY_FORM = {
  title: "",
  category: "",
  shortDescription: "",
  fullDescription: "",
  technologies: "",
  githubUrl: "",
  liveUrl: "",
  thumbnail: "",
  images: ["", "", ""],
  featured: false,
};

export function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [notice, setNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [creating, setCreating] = useState(false);

  function load() {
    setLoading(true);
    adminApi
      .get("/projects")
      .then((res) => setProjects(res.data))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleCreate() {
    if (!form.title.trim()) {
      setNotice({ type: "error", message: "Title is required." });
      return;
    }
    setCreating(true);
    try {
      await adminApi.post("/projects", {
        ...form,
        technologies: form.technologies
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        images: form.images.filter(Boolean),
        order: projects.length,
        status: "draft",
      });
      setForm(EMPTY_FORM);
      setNotice({ type: "success", message: "Project created as a draft. Publish it when ready." });
      load();
    } catch (err: any) {
      setNotice({ type: "error", message: err?.response?.data?.error || "Failed to create project." });
    } finally {
      setCreating(false);
    }
  }

  async function togglePublish(project: Project) {
    const action = project.status === "published" ? "unpublish" : "publish";
    await adminApi.post(`/projects/${project._id}/${action}`);
    load();
  }

  async function handleDelete(project: Project) {
    if (!window.confirm(`Delete "${project.title}"? This can't be undone.`)) return;
    await adminApi.delete(`/projects/${project._id}`);
    load();
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-black uppercase mb-1">Projects</h1>
      <p className="text-white/40 text-sm mb-6">
        New projects are created as drafts. Publish them when real screenshots and links are ready.
      </p>

      <Notice type={notice?.type || "success"} message={notice?.message || ""} />

      <div className="border border-white/10 rounded-2xl p-5 mb-6">
        <h2 className="text-sm font-medium uppercase tracking-wide text-white/50 mb-4">Add a project</h2>
        <div className="flex flex-col gap-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="bg-transparent border border-white/10 rounded-lg px-3 py-2 text-sm"
            />
            <input
              placeholder="Category (e.g. Client, Personal)"
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="bg-transparent border border-white/10 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <textarea
            placeholder="Short description"
            rows={2}
            value={form.shortDescription}
            onChange={(e) => setForm((f) => ({ ...f, shortDescription: e.target.value }))}
            className="bg-transparent border border-white/10 rounded-lg px-3 py-2 text-sm resize-y"
          />
          <textarea
            placeholder="Full description (optional)"
            rows={3}
            value={form.fullDescription}
            onChange={(e) => setForm((f) => ({ ...f, fullDescription: e.target.value }))}
            className="bg-transparent border border-white/10 rounded-lg px-3 py-2 text-sm resize-y"
          />
          <input
            placeholder="Technologies, comma-separated (e.g. React, Node.js, MongoDB)"
            value={form.technologies}
            onChange={(e) => setForm((f) => ({ ...f, technologies: e.target.value }))}
            className="bg-transparent border border-white/10 rounded-lg px-3 py-2 text-sm"
          />
          <div className="grid sm:grid-cols-2 gap-3">
            <input
              placeholder="GitHub URL (optional)"
              value={form.githubUrl}
              onChange={(e) => setForm((f) => ({ ...f, githubUrl: e.target.value }))}
              className="bg-transparent border border-white/10 rounded-lg px-3 py-2 text-sm"
            />
            <input
              placeholder="Live demo URL (optional)"
              value={form.liveUrl}
              onChange={(e) => setForm((f) => ({ ...f, liveUrl: e.target.value }))}
              className="bg-transparent border border-white/10 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <ImageUploadField
            label="Thumbnail"
            value={form.thumbnail}
            onChange={(v) => setForm((f) => ({ ...f, thumbnail: v }))}
          />
          <div className="grid sm:grid-cols-3 gap-3">
            {[0, 1, 2].map((i) => (
              <ImageUploadField
                key={i}
                label={`Screenshot ${i + 1}`}
                value={form.images[i]}
                onChange={(v) => {
                  const next = [...form.images];
                  next[i] = v;
                  setForm((f) => ({ ...f, images: next }));
                }}
              />
            ))}
          </div>

          <label className="flex items-center gap-2 text-sm text-white/60">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
            />
            Featured project
          </label>

          <button
            onClick={handleCreate}
            disabled={creating}
            className="self-start inline-flex items-center gap-1 border-2 border-mist text-mist rounded-lg px-4 py-2 text-sm hover:bg-mist/10 disabled:opacity-50"
          >
            <Plus size={14} /> Create project
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-white/40 text-sm">Loading…</p>
      ) : projects.length === 0 ? (
        <p className="text-white/30 text-sm">No projects yet. Add your first one above.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {projects.map((project) => (
            <li key={project._id} className="flex items-start gap-3 border border-white/10 rounded-xl px-4 py-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{project.title}</p>
                  <span
                    className={`text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full ${
                      project.status === "published"
                        ? "bg-green-500/10 text-green-400"
                        : "bg-white/10 text-white/50"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
                <p className="text-xs text-white/40 mt-0.5">{project.shortDescription}</p>
                {project.technologies.length > 0 && (
                  <p className="text-xs text-white/30 mt-1">{project.technologies.join(", ")}</p>
                )}
              </div>
              <button
                onClick={() => togglePublish(project)}
                className="text-white/40 hover:text-white"
                aria-label={project.status === "published" ? "Unpublish" : "Publish"}
                title={project.status === "published" ? "Unpublish" : "Publish"}
              >
                {project.status === "published" ? <EyeOff size={16} /> : <Globe size={16} />}
              </button>
              <button onClick={() => handleDelete(project)} className="text-white/40 hover:text-red-400" aria-label="Delete">
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
