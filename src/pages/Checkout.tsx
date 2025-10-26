import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2, CheckCircle } from "lucide-react";

export default function Checkout() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [formData, setFormData] = useState({
    nom: "",
    adresse: "",
    telephone: "",
    modePaiement: "espèces",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      // Récupérer les infos des livres pour obtenir le vendeur_id
      const bookIds = items.map(item => item.id);
      const { data: books, error: booksError } = await supabase
        .from("livres")
        .select("id, vendeur_id")
        .in("id", bookIds);

      if (booksError) throw booksError;

      // Créer une commande pour chaque livre
      for (const item of items) {
        const book = books?.find(b => b.id === item.id);
        if (!book) continue;

        const { error } = await supabase.from("commandes").insert({
          acheteur_id: user.id,
          livre_id: item.id,
          vendeur_id: book.vendeur_id,
          montant_total: item.prix * item.quantity,
          mode_paiement: formData.modePaiement as any,
          statut: "en_attente",
        });

        if (error) throw error;
      }

      // Récupérer le premier ID de commande pour l'affichage
      if (books && books.length > 0) {
        const firstBook = books[0];
        const { data: orderData } = await supabase
          .from("commandes")
          .select("id")
          .eq("acheteur_id", user.id)
          .eq("livre_id", items[0].id)
          .order("date_creation", { ascending: false })
          .limit(1)
          .single();

        if (orderData) {
          setOrderId(orderData.id);
        }
      }

      // Créer une notification
      const { error: notifError } = await supabase.from("notifications").insert({
        utilisateur_id: user.id,
        type: "commande",
        titre: "Commande confirmée",
        message: `Votre commande de ${items.length} article(s) a été confirmée avec succès. Mode de paiement : ${formData.modePaiement}. Vous serez notifié à chaque étape de la livraison.`,
      });

      if (notifError) console.error("Erreur notification:", notifError);

      clearCart();
      setShowSuccess(true);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de valider la commande",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate("/orders");
  };

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  const shipping = totalPrice > 50 ? 0 : 5.99;
  const finalTotal = totalPrice + shipping;

  return (
    <>
      <Header />
      <main className="min-h-screen py-20 px-4 bg-secondary/20">
        <div className="container max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold font-serif mb-8">Validation de la commande</h1>

          <div className="grid gap-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Informations de livraison</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="nom">Nom complet</Label>
                    <Input
                      id="nom"
                      required
                      value={formData.nom}
                      onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="adresse">Adresse de livraison</Label>
                    <Input
                      id="adresse"
                      required
                      value={formData.adresse}
                      onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="telephone">Téléphone</Label>
                    <Input
                      id="telephone"
                      type="tel"
                      required
                      value={formData.telephone}
                      onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="paiement">Mode de paiement</Label>
                    <select
                      id="paiement"
                      className="w-full border rounded-md p-2"
                      value={formData.modePaiement}
                      onChange={(e) => setFormData({ ...formData, modePaiement: e.target.value })}
                    >
                      <option value="espèces">Espèces à la livraison</option>
                      <option value="carte">Carte bancaire (à la récupération)</option>
                      <option value="virement">Virement</option>
                    </select>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Traitement...
                      </>
                    ) : (
                      "Confirmer ma commande"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Récapitulatif</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.titre} x{item.quantity}
                      </span>
                      <span>{(item.prix * item.quantity).toFixed(2)}€</span>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between text-sm">
                    <span>Sous-total</span>
                    <span>{totalPrice.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Livraison</span>
                    <span>{shipping === 0 ? "Gratuite" : `${shipping.toFixed(2)}€`}</span>
                  </div>
                  {totalPrice < 50 && (
                    <p className="text-xs text-muted-foreground">
                      Livraison gratuite à partir de 50€
                    </p>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-accent">{finalTotal.toFixed(2)}€</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl">
              Commande confirmée !
            </DialogTitle>
            <DialogDescription className="text-center">
              Votre commande a été enregistrée avec succès.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-secondary/20 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Numéro de commande</p>
              <p className="font-mono font-semibold">{orderId.slice(0, 8).toUpperCase()}</p>
            </div>
            <div className="space-y-2 text-sm">
              <p>✅ Votre commande a été enregistrée</p>
              <p>📧 Un reçu vous a été envoyé</p>
              <p>🚚 Vous recevrez des notifications à chaque étape</p>
              <p className="font-medium mt-4 text-accent">
                Mode de paiement : {formData.modePaiement === "espèces" ? "Espèces à la livraison" : formData.modePaiement}
              </p>
            </div>
            <Button className="w-full" onClick={handleSuccessClose}>
              Voir mes commandes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
