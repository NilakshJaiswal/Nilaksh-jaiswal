import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Sparkles,
  Wrench,
  FolderGit2,
  Briefcase,
  Mail,
  Settings as SettingsIcon,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { useAdminAuth } from "../../context/AdminAuthContext";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/about", label: "About", icon: User },
  { to: "/admin/skills", label: "Skills", icon: Sparkles },
  { to: "/admin/services", label: "Services", icon: Wrench },
  { to: "/admin/projects", label: "Projects", icon: FolderGit2 },
  { to: "/admin/experience", label: "Experience", icon: Briefcase },
  { to: "/admin/contact", label: "Contact", icon: Mail },
  { to: "/admin/settings", label: "Settings", icon: SettingsIcon },
];

export function AdminLayout() {
  const { email, logout } = useAdminAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/admin/login");
  }

  return (
    <div className="min-h-screen bg-ink flex">
      <aside className="w-64 flex-shrink-0 border-r border-white/10 flex flex-col p-4 hidden md:flex">
        <div className="mb-6 px-2">
          <p className="font-black uppercase tracking-tight text-mist">Nilaksh.</p>
          <p className="text-white/30 text-xs">{email}</p>
        </div>

        <nav className="flex-1 flex flex-col gap-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive ? "bg-white/10 text-white" : "text-white/50 hover:text-white hover:bg-white/5"
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex flex-col gap-1 border-t border-white/10 pt-4 mt-4">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/5"
          >
            <ExternalLink size={16} /> View site
          </a>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/5 text-left"
          >
            <LogOut size={16} /> Log out
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 p-6 md:p-10 text-mist">
        <Outlet />
      </main>
    </div>
  );
}
