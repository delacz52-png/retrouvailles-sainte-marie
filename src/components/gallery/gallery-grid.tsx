'use client';

import React, { useState } from 'react';
import { Image, Video, Music, Calendar, Sparkles, Star } from 'lucide-react';

interface MediaItem {
  id: string;
  title: string;
  type: 'photo' | 'video' | 'audio';
  url: string;
  category: '2025' | '2026';
  is_highlight?: boolean;
}

export default function GalleryGrid({ items }: { items: MediaItem[] }) {
  const [activeYear, setActiveYear] = useState<'2025' | '2026'>('2025');
  const [mediaFilter, setMediaFilter] = useState<'all' | 'highlights' | 'photo' | 'video'>('all');

  const yearItems = items.filter((item) => item.category === activeYear);
  
  const filteredItems = yearItems.filter((item) => {
    if (mediaFilter === 'highlights') return item.is_highlight === true;
    if (mediaFilter === 'photo') return item.type === 'photo';
    if (mediaFilter === 'video') return item.type === 'video';
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Switcher d'Année */}
      <div className="flex justify-center mb-8">
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-1.5 rounded-full flex gap-2 shadow-2xl">
          <button
            onClick={() => { setActiveYear('2025'); setMediaFilter('all'); }}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
              activeYear === '2025'
                ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 shadow-lg scale-105'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" /> Édition 2025
          </button>
          
          <button
            onClick={() => { setActiveYear('2026'); setMediaFilter('all'); }}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
              activeYear === '2026'
                ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 shadow-lg scale-105'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" /> Retrouvailles 2026
          </button>
        </div>
      </div>

      {/* Filtres specifiques */}
      <div className="flex justify-center gap-2 mb-10 flex-wrap">
        {[
          { id: 'all', label: 'Tout' },
          { id: 'highlights', label: '⭐ Moments Marquants', highlight: true },
          { id: 'photo', label: 'Photos' },
          { id: 'video', label: 'Vidéos' },
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => setMediaFilter(btn.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              mediaFilter === btn.id
                ? 'bg-amber-500 text-slate-950 shadow-md scale-105'
                : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Grille d'affichage */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 border border-slate-800/60 rounded-3xl">
          <p className="text-slate-400 text-sm">Aucun média dans cette catégorie pour l'instant.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group relative bg-slate-900/70 backdrop-blur-md border border-slate-800 rounded-3xl overflow-hidden shadow-xl hover:border-amber-500/50 transition-all duration-300 hover:-translate-y-1.5"
            >
              {item.is_highlight && (
                <div className="absolute top-3 right-3 z-20 bg-amber-500 text-slate-950 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-lg">
                  <Star className="w-3 h-3 fill-slate-950" /> Moment Marquant
                </div>
              )}

              {item.type === 'photo' && (
                <div className="overflow-hidden h-64 relative">
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                </div>
              )}

              {item.type === 'video' && (
                <div className="h-64 bg-slate-950">
                  <video src={item.url} controls className="w-full h-full object-cover" />
                </div>
              )}

              <div className="p-5">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {item.type}
                </span>
                <h3 className="font-bold text-white text-base mt-2 truncate group-hover:text-amber-400 transition-colors">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}