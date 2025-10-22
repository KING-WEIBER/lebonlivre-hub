import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Plus, BookOpen, ShoppingCart, Euro } from "lucide-react";

export default function SellerDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalSales: 0,
    revenue: 0,
  });

  useEffect(() => {
    const checkAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      // Vérifier si l'utilisateur a le rôle vendeur ou admin
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "administrateur")
        .maybeSingle();

      if (!roleData) {
        toast({
          title: "Accès refusé",
          description: "Vous n'avez pas les permissions nécessaires",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      // Charger les statistiques
      const { data: booksData } = await supabase
        .from("livres")
        .select("*")
        .eq("vendeur_id", session.user.id);

      const { data: ordersData } = await supabase
        .from("commandes")
        .select("*")
        .eq("vendeur_id", session.user.id);

      setStats({
        totalBooks: booksData?.length || 0,
        totalSales: ordersData?.length || 0,
        revenue: ordersData?.reduce((sum, order) => sum + Number(order.montant_total), 0) || 0,
      });

      setLoading(false);
    };

    checkAccess();
  }, [navigate]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen py-20 px-4">
          <div className="container max-w-6xl mx-auto">
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
        <div className="container max-w-6xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold font-serif">Tableau de bord Vendeur</h1>
              <p className="text-muted-foreground mt-2">
                Gérez vos livres et suivez vos ventes
              </p>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Ajouter un livre
            </Button>
          </div>

          {/* Statistiques */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Livres en vente</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalBooks}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Livres actifs sur la plateforme
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Ventes totales</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalSales}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Commandes validées
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Revenus</CardTitle>
                <Euro className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.revenue.toFixed(2)}€</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Chiffre d'affaires total
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contenu principal */}
          <Tabs defaultValue="books" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
              <TabsTrigger value="books">Mes Livres</TabsTrigger>
              <TabsTrigger value="orders">Commandes</TabsTrigger>
              <TabsTrigger value="settings">Paramètres</TabsTrigger>
            </TabsList>

            <TabsContent value="books" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Mes livres en vente</CardTitle>
                  <CardDescription>
                    Gérez votre inventaire de livres
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-muted-foreground">
                    <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>Aucun livre pour le moment</p>
                    <Button className="mt-4" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter votre premier livre
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Commandes reçues</CardTitle>
                  <CardDescription>
                    Suivez et gérez vos commandes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-muted-foreground">
                    <ShoppingCart className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>Aucune commande pour le moment</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Paramètres du vendeur</CardTitle>
                  <CardDescription>
                    Configurez votre profil vendeur
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Fonctionnalité à venir...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </>
  );
}
