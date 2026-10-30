import { Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import { AdminLogin } from "./pages/admin/Login";
import { ProtectedRoute } from "./pages/admin/ProtectedRoute";
import { AdminLayout } from "./pages/admin/AdminLayout";
import { Dashboard } from "./pages/admin/Dashboard";
import { AboutManager } from "./pages/admin/AboutManager";
import { SkillsManager } from "./pages/admin/SkillsManager";
import { ServicesManager } from "./pages/admin/ServicesManager";
import { ProjectsManager } from "./pages/admin/ProjectsManager";
import { ExperienceManager } from "./pages/admin/ExperienceManager";
import { ContactManager } from "./pages/admin/ContactManager";
import { SettingsManager } from "./pages/admin/SettingsManager";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route
        path="/admin/*"
        element={
          <AdminAuthProvider>
            <AdminRoutes />
          </AdminAuthProvider>
        }
      />
    </Routes>
  );
}

function AdminRoutes() {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="about" element={<AboutManager />} />
          <Route path="skills" element={<SkillsManager />} />
          <Route path="services" element={<ServicesManager />} />
          <Route path="projects" element={<ProjectsManager />} />
          <Route path="experience" element={<ExperienceManager />} />
          <Route path="contact" element={<ContactManager />} />
          <Route path="settings" element={<SettingsManager />} />
        </Route>
      </Route>
    </Routes>
  );
}
