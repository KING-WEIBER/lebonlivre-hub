import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { Package, Eye } from "lucide-react";

interface Order {
  id: string;
  date_creation: string;
  montant_total: number;
  statut: string;
  livre_titre?: string;
}

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data: ordersData } = await supabase
        .from("commandes")
        .select("*")
        .eq("acheteur_id", session.user.id)
        .order("date_creation", { ascending: false });

      if (ordersData) {
        setOrders(ordersData);
      }
      
      setLoading(false);
    };

    loadOrders();
  }, [navigate]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "en_attente":
        return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20";
      case "validee":
        return "bg-green-500/10 text-green-700 border-green-500/20";
      case "expediee":
        return "bg-blue-500/10 text-blue-700 border-blue-500/20";
      case "livree":
        return "bg-emerald-500/10 text-emerald-700 border-emerald-500/20";
      case "annulee":
        return "bg-red-500/10 text-red-700 border-red-500/20";
      default:
        return "bg-secondary";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "en_attente":
        return "En attente";
      case "validee":
        return "Validée";
      case "expediee":
        return "Expédiée";
      case "livree":
        return "Livrée";
      case "annulee":
        return "Annulée";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen py-20 px-4">
          <div className="container max-w-4xl mx-auto">
            <p className="text-center">Chargement...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen py-20 px-4 bg-secondary/20">
        <div className="container max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-bold font-serif">Mes Commandes</h1>
            <p className="text-muted-foreground mt-2">
              Consultez l'historique et le statut de vos commandes
            </p>
          </div>

          {orders.length === 0 ? (
            <Card className="text-center py-16">
              <CardContent className="space-y-4">
                <Package className="h-24 w-24 mx-auto text-muted-foreground" />
                <h2 className="text-2xl font-semibold">Aucune commande</h2>
                <p className="text-muted-foreground">
                  Vous n'avez pas encore passé de commande
                </p>
                <Button onClick={() => navigate("/catalog")} className="mt-4">
                  Découvrir le catalogue
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          Commande #{order.id.slice(0, 8)}
                        </CardTitle>
                        <CardDescription>
                          Passée le {new Date(order.date_creation).toLocaleDateString("fr-FR")}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(order.statut)}>
                        {getStatusLabel(order.statut)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="text-2xl font-bold text-accent">
                          {order.montant_total.toFixed(2)}€
                        </p>
                      </div>
                      
                      <Button variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        Détails
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
