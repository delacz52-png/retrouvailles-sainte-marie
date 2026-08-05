-- Active l'extension pour les UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABLE DES PROFILERS / UTILISATEURS (ANCIENS ÉLÈVES & ADMINS)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  promo_year INT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  phone TEXT,
  role TEXT DEFAULT 'alumni' CHECK (role IN ('alumni', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. TABLE DES ÉVÉNEMENTS & RETROUVAILLES (Avec gestion du temps)
CREATE TABLE public.events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  cover_url TEXT,
  is_main_event BOOLEAN DEFAULT false, -- L'événement principal des retrouvailles
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TABLE MÉDIAS (Photos, Vidéos, Musiques/Audio)
CREATE TABLE public.media (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('photo', 'video', 'audio')),
  url TEXT NOT NULL,
  category TEXT DEFAULT 'souvenir',
  uploader_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TABLE COMMENTAIRES & LIVRE D'OR
CREATE TABLE public.comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  content TEXT NOT NULL,
  author_name TEXT NOT NULL,
  promo_year INT,
  approved BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. ABONNEMENTS AUX NOTIFICATIONS PUSH (H-1, H-30m, J-1)
CREATE TABLE public.push_subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  endpoint TEXT UNIQUE NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- POLITIQUES DE SÉCURITÉ (RLS - Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Lecture publique pour le front-end
CREATE POLICY "Lecture publique des événements" ON public.events FOR SELECT USING (true);
CREATE POLICY "Lecture publique des médias" ON public.media FOR SELECT USING (true);
CREATE POLICY "Lecture publique des commentaires" ON public.comments FOR SELECT USING (approved = true);

-- Autorisations d'écriture pour l'administration et utilisateurs authentifiés
CREATE POLICY "Admin full access events" ON public.events FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access media" ON public.media FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Insertion commentaires publique" ON public.comments FOR INSERT WITH CHECK (true);