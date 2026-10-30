import { Navigate, Outlet } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";

export function ProtectedRoute() {
  const { email, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center text-white/40 text-sm">
        Checking session…
      </div>
    );
  }

  if (!email) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
