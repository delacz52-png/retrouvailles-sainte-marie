import Countdown from '@/components/countdown/countdown';

export default function HomePage() {
  // Date officielle des retrouvailles Sainte Marie
  const eventDate = '2026-09-15T18:00:00';

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-16 px-4 flex flex-col justify-center items-center">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <span className="inline-block bg-amber-500/10 text-amber-400 border border-amber-500/30 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
          Site Officiel des Anciens Élèves
        </span>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 text-white">
          Grandes Retrouvailles <br />
          <span className="text-amber-500">Groupe Scolaire Sainte Marie</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Un moment mémorable pour célébrer nos souvenirs, renouer les liens et revivre nos meilleures années.
        </p>
      </div>

      <Countdown targetDate={eventDate} title="Compte à rebours officiel des retrouvailles" />
    </main>
  );
}