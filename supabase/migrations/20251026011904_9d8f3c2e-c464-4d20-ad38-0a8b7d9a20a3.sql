-- Ajouter les nouveaux statuts de commande
ALTER TYPE statut_commande ADD VALUE IF NOT EXISTS 'en_preparation';
ALTER TYPE statut_commande ADD VALUE IF NOT EXISTS 'expédiée';

-- Créer une fonction pour envoyer des notifications lors du changement de statut
CREATE OR REPLACE FUNCTION notify_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Si le statut a changé
  IF OLD.statut IS DISTINCT FROM NEW.statut THEN
    -- Créer une notification pour l'acheteur
    INSERT INTO notifications (
      utilisateur_id,
      type,
      titre,
      message
    ) VALUES (
      NEW.acheteur_id,
      'commande',
      CASE NEW.statut
        WHEN 'confirmée' THEN 'Commande confirmée'
        WHEN 'en_preparation' THEN 'Commande en préparation'
        WHEN 'expédiée' THEN 'Commande expédiée'
        WHEN 'livrée' THEN 'Commande prête à récupérer'
        WHEN 'annulée' THEN 'Commande annulée'
        ELSE 'Mise à jour de commande'
      END,
      CASE NEW.statut
        WHEN 'confirmée' THEN 'Votre commande a été confirmée et sera bientôt préparée.'
        WHEN 'en_preparation' THEN 'Votre commande est en cours de préparation.'
        WHEN 'expédiée' THEN 'Votre commande a été expédiée ! Vous recevrez votre colis sous peu.'
        WHEN 'livrée' THEN 'Votre commande est prête à être récupérée. Vous pouvez venir la retirer et régler le paiement sur place (espèces).'
        WHEN 'annulée' THEN 'Votre commande a été annulée.'
        ELSE 'Le statut de votre commande a été mis à jour.'
      END
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Créer le trigger
DROP TRIGGER IF EXISTS on_order_status_change ON commandes;
CREATE TRIGGER on_order_status_change
  AFTER UPDATE ON commandes
  FOR EACH ROW
  EXECUTE FUNCTION notify_order_status_change();

-- Permettre aux utilisateurs de créer des notifications (système interne)
CREATE POLICY "System can create notifications"
  ON notifications
  FOR INSERT
  WITH CHECK (true);