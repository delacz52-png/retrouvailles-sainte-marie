'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Upload, Trash2, Image, Video, Music, Star } from 'lucide-react';

export default function AdminPanel() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'2025' | '2026' | 'lieu' | 'background'>('2025');
  const [mediaType, setMediaType] = useState<'photo' | 'video' | 'audio'>('photo');
  const [isHighlight, setIsHighlight] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [mediaList, setMediaList] = useState<any[]>([]);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    const { data } = await supabase.from('media').select('*').order('created_at', { ascending: false });
    if (data) setMediaList(data);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !file) {
      setMessage('⚠️ Veuillez remplir le titre et sélectionner un fichier.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('media-files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('media-files')
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;

      const { error: dbError } = await supabase.from('media').insert([
        {
          title,
          type: mediaType,
          url: publicUrl,
          category: category.toLowerCase(),
          is_highlight: isHighlight,
        },
      ]);

      if (dbError) throw dbError;

      setMessage('✅ Fichier envoyé avec succès !');
      setTitle('');
      setFile(null);
      setIsHighlight(false);
      fetchMedia();
    } catch (err: any) {
      setMessage(`❌ Erreur : ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Voulez-vous vraiment supprimer ce média ?')) return;

    const { error } = await supabase.from('media').delete().eq('id', id);

    if (error) {
      setMessage(`❌ Erreur de suppression : ${error.message}`);
    } else {
      setMessage('🗑️ Média supprimé avec succès !');
      fetchMedia();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 my-8">
      {/* Formulaire d'envoi */}
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-white shadow-xl">
        <h2 className="text-2xl font-bold text-amber-400 mb-6 flex items-center gap-2">
          <Upload className="w-6 h-6" /> Ajouter un média
        </h2>

        {message && (
          <div className="mb-6 p-4 rounded-xl text-sm font-semibold bg-slate-800 border border-amber-500/40 text-amber-300">
            {message}
          </div>
        )}

        <form onSubmit={handleUpload} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-2">Titre du fichier</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Photo de groupe, Vue de la plage Obama Beach..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Type de média</label>
              <select
                value={mediaType}
                onChange={(e) => setMediaType(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500"
              >
                <option value="photo">Photo</option>
                <option value="video">Vidéo</option>
                <option value="audio">Musique / Son</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Catégorie / Destination</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500"
              >
                <option value="2025">Souvenirs 2025</option>
                <option value="2026">Retrouvailles 2026</option>
                <option value="lieu">Photos / Vidéos du Lieu (Obama Beach)</option>
                <option value="background">Image d'Arrière-plan (Slider du site)</option>
              </select>
            </div>
          </div>

          {/* Option Moment Marquant */}
          <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/60">
            <label className="flex items-center gap-2.5 text-sm text-amber-400 font-semibold cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isHighlight}
                onChange={(e) => setIsHighlight(e.target.checked)}
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              Marquer comme "Moment Marquant ⭐"
            </label>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Sélectionner le fichier</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              accept={mediaType === 'photo' ? 'image/*' : mediaType === 'video' ? 'video/*' : 'audio/*'}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-amber-500 file:text-slate-950 file:font-bold hover:file:bg-amber-400 cursor-pointer"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold p-3.5 rounded-xl transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Téléversement...' : 'Envoyer sur le site'}
          </button>
        </form>
      </div>

      {/* Liste des médias publiés avec statut et bouton Supprimer */}
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-white shadow-xl">
        <h3 className="text-xl font-bold text-amber-400 mb-6">Médias en ligne ({mediaList.length})</h3>

        {mediaList.length === 0 ? (
          <p className="text-slate-400 text-sm">Aucun média publié pour le moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mediaList.map((item) => (
              <div key={item.id} className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 overflow-hidden">
                  {item.type === 'photo' && <Image className="w-5 h-5 text-amber-400 shrink-0" />}
                  {item.type === 'video' && <Video className="w-5 h-5 text-amber-400 shrink-0" />}
                  {item.type === 'audio' && <Music className="w-5 h-5 text-amber-400 shrink-0" />}
                  <div className="truncate">
                    <p className="font-semibold text-sm text-white truncate flex items-center gap-1.5">
                      {item.title}
                      {item.is_highlight && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />}
                    </p>
                    <span className="text-xs text-amber-500/80 font-mono">
                      {item.category === 'background' ? "Arrière-plan" : item.category === 'lieu' ? "Lieu" : `Édition ${item.category}`}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-500/20 hover:bg-red-500 border border-red-500/40 text-red-300 hover:text-white p-2.5 rounded-lg transition shrink-0 cursor-pointer"
                  title="Supprimer ce média"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}