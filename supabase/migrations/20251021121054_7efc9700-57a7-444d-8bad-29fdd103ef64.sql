-- Créer les types ENUM
CREATE TYPE public.app_role AS ENUM ('utilisateur', 'administrateur');
CREATE TYPE public.etat_livre AS ENUM ('neuf', 'bon', 'usé');
CREATE TYPE public.statut_livre AS ENUM ('disponible', 'vendu', 'réservé');
CREATE TYPE public.mode_paiement AS ENUM ('espèces', 'autre');
CREATE TYPE public.statut_commande AS ENUM ('en_attente', 'confirmée', 'livrée', 'annulée');
CREATE TYPE public.type_avis AS ENUM ('livre', 'vendeur');
CREATE TYPE public.type_notification AS ENUM ('commande', 'message', 'systeme');

-- TABLE user_roles (pour la sécurité des rôles)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role app_role NOT NULL DEFAULT 'utilisateur',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Fonction de sécurité pour vérifier les rôles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- TABLE profiles (informations utilisateur)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY,
  nom_complet TEXT NOT NULL,
  email TEXT NOT NULL,
  telephone TEXT,
  photo_profil TEXT,
  verifie BOOLEAN DEFAULT false,
  date_inscription TIMESTAMP WITH TIME ZONE DEFAULT now(),
  derniere_connexion TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies pour profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'administrateur'));

-- TABLE categories
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  description TEXT,
  icone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view categories"
  ON public.categories FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Admins can manage categories"
  ON public.categories FOR ALL
  USING (public.has_role(auth.uid(), 'administrateur'));

-- TABLE livres
CREATE TABLE public.livres (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titre TEXT NOT NULL,
  auteur TEXT NOT NULL,
  categorie_id UUID REFERENCES public.categories(id),
  description TEXT,
  prix DECIMAL(10,2) NOT NULL,
  etat etat_livre DEFAULT 'bon',
  images TEXT[],
  vendeur_id UUID REFERENCES public.profiles(id) NOT NULL,
  statut statut_livre DEFAULT 'disponible',
  date_ajout TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.livres ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view available books"
  ON public.livres FOR SELECT
  TO authenticated, anon
  USING (statut = 'disponible' OR auth.uid() = vendeur_id OR public.has_role(auth.uid(), 'administrateur'));

CREATE POLICY "Sellers can insert their books"
  ON public.livres FOR INSERT
  WITH CHECK (auth.uid() = vendeur_id);

CREATE POLICY "Sellers can update their books"
  ON public.livres FOR UPDATE
  USING (auth.uid() = vendeur_id OR public.has_role(auth.uid(), 'administrateur'));

CREATE POLICY "Sellers can delete their books"
  ON public.livres FOR DELETE
  USING (auth.uid() = vendeur_id OR public.has_role(auth.uid(), 'administrateur'));

-- TABLE commandes
CREATE TABLE public.commandes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  acheteur_id UUID REFERENCES public.profiles(id) NOT NULL,
  vendeur_id UUID REFERENCES public.profiles(id) NOT NULL,
  livre_id UUID REFERENCES public.livres(id) NOT NULL,
  montant_total DECIMAL(10,2) NOT NULL,
  mode_paiement mode_paiement DEFAULT 'espèces',
  statut statut_commande DEFAULT 'en_attente',
  date_creation TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.commandes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their orders"
  ON public.commandes FOR SELECT
  USING (auth.uid() = acheteur_id OR auth.uid() = vendeur_id OR public.has_role(auth.uid(), 'administrateur'));

CREATE POLICY "Users can create orders"
  ON public.commandes FOR INSERT
  WITH CHECK (auth.uid() = acheteur_id);

CREATE POLICY "Sellers and admins can update orders"
  ON public.commandes FOR UPDATE
  USING (auth.uid() = vendeur_id OR public.has_role(auth.uid(), 'administrateur'));

-- TABLE messages
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expediteur_id UUID REFERENCES public.profiles(id) NOT NULL,
  destinataire_id UUID REFERENCES public.profiles(id) NOT NULL,
  contenu TEXT NOT NULL,
  date_envoi TIMESTAMP WITH TIME ZONE DEFAULT now(),
  lu BOOLEAN DEFAULT false
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their messages"
  ON public.messages FOR SELECT
  USING (auth.uid() = expediteur_id OR auth.uid() = destinataire_id);

CREATE POLICY "Users can send messages"
  ON public.messages FOR INSERT
  WITH CHECK (auth.uid() = expediteur_id);

CREATE POLICY "Recipients can mark as read"
  ON public.messages FOR UPDATE
  USING (auth.uid() = destinataire_id);

-- TABLE avis
CREATE TABLE public.avis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auteur_id UUID REFERENCES public.profiles(id) NOT NULL,
  cible_type type_avis NOT NULL,
  cible_id UUID NOT NULL,
  note INTEGER NOT NULL CHECK (note >= 1 AND note <= 5),
  commentaire TEXT,
  date_creation TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.avis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reviews"
  ON public.avis FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Users can create reviews"
  ON public.avis FOR INSERT
  WITH CHECK (auth.uid() = auteur_id);

CREATE POLICY "Users can update their reviews"
  ON public.avis FOR UPDATE
  USING (auth.uid() = auteur_id);

CREATE POLICY "Users can delete their reviews"
  ON public.avis FOR DELETE
  USING (auth.uid() = auteur_id OR public.has_role(auth.uid(), 'administrateur'));

-- TABLE favoris
CREATE TABLE public.favoris (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  utilisateur_id UUID REFERENCES public.profiles(id) NOT NULL,
  livre_id UUID REFERENCES public.livres(id) NOT NULL,
  date_ajout TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(utilisateur_id, livre_id)
);

ALTER TABLE public.favoris ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their favorites"
  ON public.favoris FOR SELECT
  USING (auth.uid() = utilisateur_id);

CREATE POLICY "Users can manage their favorites"
  ON public.favoris FOR ALL
  USING (auth.uid() = utilisateur_id);

-- TABLE notifications
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  utilisateur_id UUID REFERENCES public.profiles(id) NOT NULL,
  type type_notification NOT NULL,
  titre TEXT NOT NULL,
  message TEXT NOT NULL,
  lu BOOLEAN DEFAULT false,
  date_envoi TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = utilisateur_id);

CREATE POLICY "Users can update their notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = utilisateur_id);

-- TABLE historiques
CREATE TABLE public.historiques (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  utilisateur_id UUID REFERENCES public.profiles(id) NOT NULL,
  action TEXT NOT NULL,
  details TEXT,
  date_action TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.historiques ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their history"
  ON public.historiques FOR SELECT
  USING (auth.uid() = utilisateur_id OR public.has_role(auth.uid(), 'administrateur'));

CREATE POLICY "Admins can view all history"
  ON public.historiques FOR SELECT
  USING (public.has_role(auth.uid(), 'administrateur'));

-- Trigger pour créer automatiquement un profil à l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, nom_complet, email, photo_profil)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'Utilisateur'),
    new.email,
    new.raw_user_meta_data->>'avatar_url'
  );
  
  -- Assigner le rôle utilisateur par défaut
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'utilisateur');
  
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Policies pour user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  USING (public.has_role(auth.uid(), 'administrateur'));

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'administrateur'));