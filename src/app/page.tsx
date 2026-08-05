'use client';

import React, { useState, useEffect, useRef } from 'react';
import Countdown from '@/components/countdown/countdown';
import GalleryGrid from '@/components/gallery/gallery-grid';
import BackgroundSlider from '@/components/background-slider';
import { supabase } from '@/lib/supabase/client';
import { Volume2, VolumeX, MessageSquare, Send, MapPin, Navigation, Camera } from 'lucide-react';

export default function HomePage() {
  const eventDate = '2026-08-09T14:00:00';
  const [isPlaying, setIsPlaying] = useState(false);
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [authorName, setAuthorName] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetchMedia();
    fetchComments();
  }, []);

  const fetchMedia = async () => {
    const { data } = await supabase.from('media').select('*').order('created_at', { ascending: false });
    if (data) setMediaList(data);
  };

  const fetchComments = async () => {
    const { data } = await supabase.from('comments').select('*').order('created_at', { ascending: false });
    if (data) setComments(data);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName || !commentContent) return;

    await supabase.from('comments').insert([{ author_name: authorName, content: commentContent }]);
    setAuthorName('');
    setCommentContent('');
    fetchComments();
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  // 1. Filtrer les images d'arrière-plan (prend en compte 'Arrière-plan', 'background' ou 'is_highlight')
  const bgImages = mediaList
    .filter(
      (m) =>
        m.type === 'photo' &&
        (m.category?.toLowerCase().includes('arrière') ||
          m.category?.toLowerCase() === 'background' ||
          m.is_highlight)
    )
    .map((m) => m.url);

  // 2. Filtrer les médias du lieu (Obama Beach)
  const lieuMedia = mediaList.filter(
    (m) =>
      m.category?.toLowerCase() === 'lieu' ||
      m.category?.toLowerCase().includes('lieu') ||
      m.category?.toLowerCase().includes('obama')
  );

  // 3. Galerie générale (exclut ce qui est exclusivement en arrière-plan)
  const souvenirMedia = mediaList.filter(
    (m) =>
      !m.category?.toLowerCase().includes('arrière') &&
      m.category?.toLowerCase() !== 'background'
  );

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 relative overflow-hidden">
      {/* Diaporama d'arrière-plan */}
      {bgImages.length > 0 && <BackgroundSlider images={bgImages} interval={5000} />}

      {/* Lecteur Audio */}
      <audio ref={audioRef} loop preload="auto" src="/musique-fond.mp3" />
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={toggleAudio}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 px-5 rounded-full shadow-2xl transition cursor-pointer"
        >
          {isPlaying ? <Volume2 className="w-5 h-5 animate-pulse" /> : <VolumeX className="w-5 h-5" />}
          {isPlaying ? 'Couper la musique' : "Jouer l'hymne / Musique"}
        </button>
      </div>

      {/* En-tête */}
      <div className="max-w-4xl mx-auto text-center mb-12 relative z-10">
        <span className="inline-block bg-amber-500/10 text-amber-400 border border-amber-500/30 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
          Site Officiel des Anciens Élèves
        </span>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 text-white drop-shadow-lg">
          Grandes Retrouvailles <br />
          <span className="text-amber-500">Groupe Scolaire Sainte Marie</span>
        </h1>
        <p className="text-slate-300 text-lg max-w-2xl mx-auto drop-shadow-sm">
          Rendez-vous ce Dimanche 9 Août à 14h00 pour célébrer nos souvenirs et renouer les liens.
        </p>
      </div>

      {/* Compte à rebours */}
      <div className="relative z-10">
        <Countdown targetDate={eventDate} title="Compte à rebours officiel" />
      </div>

      {/* SECTION LOCALISATION : Obama Beach Cotonou */}
      <section className="max-w-5xl mx-auto my-20 relative z-10">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 text-amber-400 font-semibold text-sm bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 mb-3">
            <MapPin className="w-4 h-4" /> Lieu du Rassemblement
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">Obama Beach, Cotonou</h2>
          <p className="text-slate-300 mt-2">Un cadre magnifique au bord de la mer pour accueillir nos retrouvailles.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-slate-900/70 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl shadow-2xl">
          {/* Carte Google Maps */}
          <div className="w-full h-80 rounded-2xl overflow-hidden border border-slate-700/60 shadow-inner">
            <iframe
              title="Carte Obama Beach Cotonou"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.2504627196033!2d2.4333!3d6.3556!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x102355e1605f6cb1%3A0xb366cf8d43dfa7b5!2sObama%20Beach%20Cotonou!5e0!3m2!1sfr!2sbj!4v1700000000000!5m2!1sfr!2sbj"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Informations d'accès */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-amber-400 mb-2">Comment s'y rendre ?</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Retrouvez-nous directement sur la plage d'Obama Beach à Cotonou à partir de <strong>14h00</strong> ce Dimanche 9 Août.
              </p>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/50 space-y-2 text-sm">
              <div className="flex items-center gap-2 text-slate-200">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Plage d'Obama Beach, Cotonou, Bénin</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <Navigation className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Dimanche 9 Août 2026 à partir de 14h00</span>
              </div>
            </div>

            <a
              href="https://maps.google.com/?q=Obama+Beach+Cotonou"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-xl transition shadow-lg"
            >
              <Navigation className="w-4 h-4" /> Ouvrir dans Google Maps
            </a>
          </div>
        </div>

        {/* Galerie / Aperçu du Lieu (Affiche les photos ET vidéos du lieu) */}
        {lieuMedia.length > 0 && (
          <div className="mt-12 bg-slate-900/70 backdrop-blur-xl p-6 rounded-3xl border border-slate-800 shadow-2xl">
            <h3 className="text-xl font-bold text-amber-400 mb-6 flex items-center gap-2">
              <Camera className="w-5 h-5" /> Aperçu du Lieu (Obama Beach)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {lieuMedia.map((item) => (
                <div key={item.id} className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 aspect-video shadow-lg">
                  {item.type === 'video' ? (
                    <video
                      src={item.url}
                      controls
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover hover:scale-105 transition duration-500"
                    />
                  )}
                  <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent">
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Galerie photos / vidéos des souvenirs */}
      <div className="mt-20 relative z-10">
        <h2 className="text-3xl font-extrabold text-center text-white mb-2">Galerie & Souvenirs</h2>
        <p className="text-center text-slate-400 mb-8">Découvrez les photos et vidéos des éditions précédentes.</p>
        <GalleryGrid items={souvenirMedia} />
      </div>

      {/* Livre d'Or */}
      <div className="max-w-3xl mx-auto mt-20 bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl shadow-xl relative z-10">
        <h3 className="text-2xl font-bold text-amber-400 mb-6 flex items-center gap-2">
          <MessageSquare className="w-6 h-6" /> Livre d'Or des Anciens
        </h3>

        <form onSubmit={handleAddComment} className="space-y-4 mb-8">
          <input
            type="text"
            placeholder="Votre Nom & Promotion (ex: Marc - Promo 2018)"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="w-full bg-slate-800/90 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500"
            required
          />
          <textarea
            placeholder="Laissez un message de retrouvailles ou un mot de souvenir..."
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            rows={3}
            className="w-full bg-slate-800/90 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500"
            required
          />
          <button
            type="submit"
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 px-6 rounded-lg transition flex items-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4" /> Publier le message
          </button>
        </form>

        <div className="space-y-4 max-h-80 overflow-y-auto">
          {comments.map((c) => (
            <div key={c.id} className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/50">
              <span className="font-bold text-amber-400 text-sm">{c.author_name}</span>
              <p className="text-slate-200 text-sm mt-1">{c.content}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}