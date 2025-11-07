-- Supprimer les anciennes politiques trop permissives
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Politique 1: Les utilisateurs peuvent voir leur propre profil complet
CREATE POLICY "Users can view own complete profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- Politique 2: Les administrateurs peuvent voir tous les profils
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (has_role(auth.uid(), 'administrateur'::app_role));

-- Politique 3: Les acheteurs peuvent voir les infos de contact des vendeurs 
-- uniquement s'ils ont une commande avec eux
CREATE POLICY "Buyers can view seller contact info for their orders"
ON public.profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 
    FROM public.commandes 
    WHERE commandes.acheteur_id = auth.uid() 
    AND commandes.vendeur_id = profiles.id
  )
);

-- Politique 4: Les vendeurs peuvent voir les infos de contact des acheteurs
-- uniquement s'ils ont une commande avec eux
CREATE POLICY "Sellers can view buyer contact info for their orders"
ON public.profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 
    FROM public.commandes 
    WHERE commandes.vendeur_id = auth.uid() 
    AND commandes.acheteur_id = profiles.id
  )
);

-- Politique 5: Tout le monde peut voir les noms et photos (infos publiques)
-- mais PAS les emails et téléphones - cela nécessite une vue
CREATE VIEW public.public_profiles AS
SELECT 
  id,
  nom_complet,
  photo_profil,
  verifie
FROM public.profiles;

-- Activer RLS sur la vue
ALTER VIEW public.public_profiles SET (security_invoker = true);

-- Politique sur la vue pour accès public aux infos non sensibles
GRANT SELECT ON public.public_profiles TO authenticated;
GRANT SELECT ON public.public_profiles TO anon;