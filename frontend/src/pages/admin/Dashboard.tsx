import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "../../lib/api";

interface Counts {
  skills: number;
  services: number;
  projects: number;
  experience: number;
}

export function Dashboard() {
  const [counts, setCounts] = useState<Counts | null>(null);

  useEffect(() => {
    Promise.all([
      adminApi.get("/skills").then((r) => r.data.length),
      adminApi.get("/services").then((r) => r.data.length),
      adminApi.get("/projects").then((r) => r.data.length),
      adminApi.get("/experience").then((r) => r.data.length),
    ])
      .then(([skills, services, projects, experience]) => setCounts({ skills, services, projects, experience }))
      .catch(() => setCounts({ skills: 0, services: 0, projects: 0, experience: 0 }));
  }, []);

  const cards = [
    { label: "Skills", count: counts?.skills, href: "/admin/skills" },
    { label: "Services", count: counts?.services, href: "/admin/services" },
    { label: "Projects", count: counts?.projects, href: "/admin/projects" },
    { label: "Experience", count: counts?.experience, href: "/admin/experience" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-black uppercase mb-1">Dashboard</h1>
      <p className="text-white/40 text-sm mb-8">
        Manage your portfolio's content. Nothing here was pre-filled — add your real content in each section below.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.href}
            className="border border-white/10 rounded-2xl p-6 hover:border-white/30 transition-colors"
          >
            <p className="text-3xl font-black">{card.count ?? "–"}</p>
            <p className="text-white/50 text-sm mt-1">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 border border-white/10 rounded-2xl p-6">
        <h2 className="font-medium mb-2">Getting started</h2>
        <ol className="list-decimal list-inside text-white/60 text-sm space-y-1">
          <li>Fill in About, Contact and Settings (site-wide text, hero copy, nav labels).</li>
          <li>Add your Skills, Services, Experience and Projects.</li>
          <li>Publish each item — only published/visible content appears on the public site.</li>
          <li>Visit the public site to review, then keep iterating.</li>
        </ol>
      </div>
    </div>
  );
}
