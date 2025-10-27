import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { BookCard } from "@/components/BookCard";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface Book {
  id: string;
  titre: string;
  auteur: string;
  prix: number;
  images: string[] | null;
}

export default function Favorites() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate("/auth");
      return;
    }

    const { data, error } = await supabase
      .from("favoris")
      .select(`
        livre_id,
        livres:livre_id (
          id,
          titre,
          auteur,
          prix,
          images
        )
      `)
      .eq("utilisateur_id", user.id);

    if (!error && data) {
      const books = data
        .map((fav: any) => fav.livres)
        .filter((book: any) => book !== null);
      setFavorites(books);
    }
    setLoading(false);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen py-20 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Heart className="h-8 w-8 text-accent fill-accent" />
            <h1 className="text-4xl font-bold font-serif">Mes Favoris</h1>
          </div>

          {loading ? (
            <p className="text-center py-12">Chargement...</p>
          ) : favorites.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="h-16 w-16 mx-auto mb-4 text-muted" />
              <p className="text-xl text-muted-foreground mb-4">
                Vous n'avez pas encore de favoris
              </p>
              <Button onClick={() => navigate("/catalog")}>
                Découvrir le catalogue
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favorites.map((book) => (
                <BookCard
                  key={book.id}
                  id={book.id}
                  title={book.titre}
                  author={book.auteur}
                  price={book.prix}
                  image={book.images?.[0] || ""}
                  category="Livre"
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
