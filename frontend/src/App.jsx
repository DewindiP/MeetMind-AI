function App() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <section className="w-full max-w-md rounded-2xl border border-border bg-surface p-10 text-center shadow-sm">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gold">
          <span className="text-2xl font-bold text-brand-navy">M</span>
        </div>

        <h1 className="text-3xl font-bold text-brand-navy">
          MeetMind-AI
        </h1>

        <p className="mt-3 text-text-secondary">
          Your meetings, notes and next steps — all in one place.
        </p>

        <button
          type="button"
          className="mt-7 rounded-xl bg-brand-gold px-6 py-3 font-semibold text-brand-navy transition-colors hover:bg-brand-gold-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-navy"
        >
          Get Started
        </button>
      </section>
    </main>
  );
}

export default App;