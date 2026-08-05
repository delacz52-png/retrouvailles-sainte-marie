'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Bell, Calendar, Clock, Sparkles } from 'lucide-react';

interface CountdownProps {
  targetDate: string; // Format ISO ou Date string
  title: string;
}

export default function Countdown({ targetDate, title }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [isAlert, setIsAlert] = useState<boolean>(false);

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setStatusMessage("C'est le grand jour ! Bienvenue aux retrouvailles !");
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });

      // LOGIQUE DES ALERTES DE TEMPS (H-1, H-30m, Veille/J-1)
      if (days === 1) {
        setStatusMessage('⚠️ VEILLE DE L\'ÉVÉNEMENT ! Préparez vos tenues !');
        setIsAlert(true);
      } else if (days === 0 && hours === 1 && minutes > 30) {
        setStatusMessage('⏰ URGENT : Plus que 1 heure avant le lancement !');
        setIsAlert(true);
      } else if (days === 0 && hours === 0 && minutes <= 30 && minutes > 0) {
        setStatusMessage('🚀 DERNIÈRE DROITE : L\'événement commence dans 30 minutes !');
        setIsAlert(true);
      } else {
        setStatusMessage('');
        setIsAlert(false);
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const requestNotification = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        new Notification('Groupe Scolaire Sainte Marie', {
          body: 'Rappels activés pour H-1, H-30min et le jour J !',
          icon: '/favicon.ico',
        });
      }
    }
  };

  return (
    <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-2xl border border-amber-500/30 max-w-3xl mx-auto text-center">
      <div className="flex justify-center items-center gap-2 text-amber-400 font-semibold mb-2">
        <Sparkles className="w-5 h-5" />
        <span className="uppercase tracking-widest text-xs">Groupe Scolaire Sainte Marie</span>
      </div>

      <h2 className="text-3xl font-extrabold mb-6 text-amber-100">{title}</h2>

      {statusMessage && (
        <div className={`mb-6 p-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 ${
          isAlert ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse' : 'bg-slate-800 text-slate-200'
        }`}>
          <Clock className="w-5 h-5" />
          {statusMessage}
        </div>
      )}

      {/* Grille des compteurs */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Jours', value: timeLeft.days },
          { label: 'Heures', value: timeLeft.hours },
          { label: 'Minutes', value: timeLeft.minutes },
          { label: 'Secondes', value: timeLeft.seconds },
        ].map((item, idx) => (
          <div key={idx} className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/50">
            <span className="block text-4xl font-black text-amber-400 font-mono">
              {String(item.value).padStart(2, '0')}
            </span>
            <span className="text-xs uppercase text-slate-400 mt-1 block">{item.label}</span>
          </div>
        ))}
      </div>

      <button
        onClick={requestNotification}
        className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold py-3 px-6 rounded-xl transition duration-200"
      >
        <Bell className="w-4 h-4" /> Activer les rappels (H-1, H-30min, Veille)
      </button>
    </div>
  );
}