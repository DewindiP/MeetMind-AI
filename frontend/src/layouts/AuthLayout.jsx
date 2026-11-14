import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-2">
      <section className="hidden flex-col justify-between bg-brand-navy p-12 text-white lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gold text-xl font-bold text-brand-navy">
            M
          </div>
          <span className="text-xl font-bold">MeetMind-AI</span>
        </div>

        <div className="max-w-lg">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-brand-gold">
            Work smarter together
          </p>
          <h1 className="text-5xl font-bold leading-tight">
            Turn every meeting into meaningful progress.
          </h1>
          <p className="mt-6 leading-7 text-slate-300">
            Organise your meetings, capture important ideas,
            and let AI help you discover the next steps.
          </p>
        </div>

        <p className="text-sm text-slate-400">
          © {new Date().getFullYear()} MeetMind-AI
        </p>
      </section>

      <section className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </section>
    </main>
  );
}

export default AuthLayout;
