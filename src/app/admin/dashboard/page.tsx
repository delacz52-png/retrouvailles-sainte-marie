import AdminPanel from '@/components/admin/admin-panel';

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white py-12 px-4">
      <div className="max-w-4xl mx-auto text-center mb-8">
        <h1 className="text-3xl font-black text-amber-500">Espace de Gestion Contenu</h1>
        <p className="text-slate-400 text-sm">Gérez facilement vos événements et vos médias.</p>
      </div>
      <AdminPanel />
    </main>
  );
}