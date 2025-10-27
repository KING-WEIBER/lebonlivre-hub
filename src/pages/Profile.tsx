import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { User, Mail, Phone, Shield, LogOut, Settings } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { EditProfileDialog } from "@/components/EditProfileDialog";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    // Vérifier la session et charger le profil
    const loadUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      setUser(session.user);

      // Charger le profil
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      }

      // Vérifier si l'utilisateur est admin
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "administrateur")
        .maybeSingle();

      setIsAdmin(!!roleData);
      setLoading(false);
    };

    loadUserData();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleProfileUpdated = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      }
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
      navigate("/");
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
      <main className="min-h-screen py-20 px-4">
        <div className="container max-w-4xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold font-serif">Mon Profil</h1>
            <Button onClick={handleSignOut} variant="outline">
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
                <CardDescription>Vos données de profil</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={profile?.photo_profil || user?.user_metadata?.avatar_url} />
                    <AvatarFallback>
                      {profile?.nom_complet?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">
                      {profile?.nom_complet || user?.user_metadata?.full_name || "Utilisateur"}
                    </h3>
                    {isAdmin && (
                      <span className="inline-flex items-center gap-1 text-sm text-accent">
                        <Shield className="h-4 w-4" />
                        Administrateur
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Mail className="h-5 w-5" />
                    <span>{user?.email}</span>
                  </div>
                  {profile?.telephone && (
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Phone className="h-5 w-5" />
                      <span>{profile.telephone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <User className="h-5 w-5" />
                    <span>
                      Membre depuis le{" "}
                      {new Date(profile?.date_inscription || user?.created_at).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => setEditDialogOpen(true)}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Modifier le profil
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mes activités</CardTitle>
                <CardDescription>Statistiques de votre compte</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-secondary/50 cursor-pointer hover:bg-secondary/70 transition-colors" onClick={() => navigate("/orders")}>
                    <p className="text-sm text-muted-foreground">Commandes</p>
                    <p className="text-2xl font-bold">-</p>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/50 cursor-pointer hover:bg-secondary/70 transition-colors" onClick={() => navigate("/favorites")}>
                    <p className="text-sm text-muted-foreground">Favoris</p>
                    <p className="text-2xl font-bold">-</p>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/50">
                    <p className="text-sm text-muted-foreground">Avis</p>
                    <p className="text-2xl font-bold">-</p>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/50 cursor-pointer hover:bg-secondary/70 transition-colors" onClick={() => navigate("/notifications")}>
                    <p className="text-sm text-muted-foreground">Notifications</p>
                    <p className="text-2xl font-bold">-</p>
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => navigate("/orders")}
                  >
                    Mes commandes
                  </Button>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => navigate("/favorites")}
                  >
                    Mes favoris
                  </Button>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => navigate("/notifications")}
                  >
                    Mes notifications
                  </Button>
                </div>

                {isAdmin && (
                  <div className="mt-6 p-4 border border-accent/20 rounded-lg bg-accent/5">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Shield className="h-5 w-5 text-accent" />
                      Accès administrateur
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Vous avez accès aux fonctionnalités d'administration.
                    </p>
                    <Button className="w-full" onClick={() => navigate("/admin")}>
                      Panneau d'administration
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
      <EditProfileDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        profile={profile}
        onProfileUpdated={handleProfileUpdated}
      />
    </>
  );
}
