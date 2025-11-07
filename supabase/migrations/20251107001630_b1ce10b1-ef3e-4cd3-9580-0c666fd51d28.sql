-- Ajouter le champ a_la_une à la table livres
ALTER TABLE public.livres 
ADD COLUMN IF NOT EXISTS a_la_une boolean DEFAULT false;

-- Créer un index pour optimiser les requêtes sur les livres à la une
CREATE INDEX IF NOT EXISTS idx_livres_a_la_une ON public.livres(a_la_une) WHERE a_la_une = true;