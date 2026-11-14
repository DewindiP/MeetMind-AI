import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-brand-navy">
            MeetMind-AI
          </h1>

          <button
            onClick={handleLogout}
            className="rounded-xl border border-border bg-white px-4 py-2 text-sm font-medium hover:bg-background"
          >
            Logout
          </button>
        </div>

        <section className="mt-12 rounded-2xl border border-border bg-white p-8">
          <p className="text-sm text-text-secondary">Your workspace</p>
          <h2 className="mt-2 text-2xl font-bold text-brand-navy">
            Welcome, {user?.name || "there"}!
          </h2>
          <p className="mt-3 text-text-secondary">
            Your authentication is working. Your meeting dashboard
            will be available here.
          </p>
        </section>
      </div>
    </main>
  );
}

export default DashboardPage;
