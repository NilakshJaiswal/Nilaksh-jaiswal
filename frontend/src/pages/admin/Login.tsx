import { FormEvent, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";

export function AdminLogin() {
  const { email: sessionEmail, loading, login } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  if (!loading && sessionEmail) {
    return <Navigate to="/admin" replace />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await login(email, password);
      navigate("/admin");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Login failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-5">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white/[0.03] border border-white/10 rounded-2xl p-8">
        <h1 className="hero-heading font-black uppercase text-2xl mb-1">Admin</h1>
        <p className="text-white/40 text-sm mb-6">Sign in to manage your portfolio.</p>

        {error && (
          <div className="bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg px-3 py-2 text-sm mb-4">
            {error}
          </div>
        )}

        <label className="block text-sm text-white/60 mb-1">Email</label>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2 mb-4 text-white"
          autoComplete="username"
        />

        <label className="block text-sm text-white/60 mb-1">Password</label>
        <input
          required
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2 mb-6 text-white"
          autoComplete="current-password"
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full inline-flex items-center justify-center rounded-full border-2 border-mist text-mist font-medium uppercase tracking-widest px-8 py-3 text-sm hover:bg-mist/10 transition-colors disabled:opacity-50"
        >
          {submitting ? "Signing in…" : "Sign In"}
        </button>

        <p className="text-white/30 text-xs mt-4 text-center">
          No account yet? Run <code>npm run create-admin</code> in the backend to create the first administrator.
        </p>
      </form>
    </div>
  );
}
