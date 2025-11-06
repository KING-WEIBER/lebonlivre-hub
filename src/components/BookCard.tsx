import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingCart, Heart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/utils";
import { useState, useEffect } from "react";

interface BookCardProps {
  id: string;
  title: string;
  author: string;
  price: number;
  image: string;
  category: string;
}

export const BookCard = ({ id, title, author, price, image, category }: BookCardProps) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAuth();
    checkFavorite();
  }, [id]);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const checkFavorite = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !id) return;

    const { data } = await supabase
      .from("favoris")
      .select("id")
      .eq("utilisateur_id", user.id)
      .eq("livre_id", id)
      .maybeSingle();

    setIsFavorite(!!data);
  };

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour gérer vos favoris",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (isFavorite) {
      const { error } = await supabase
        .from("favoris")
        .delete()
        .eq("utilisateur_id", user.id)
        .eq("livre_id", id);

      if (!error) {
        setIsFavorite(false);
        toast({
          title: "Retiré des favoris",
          description: "Le livre a été retiré de vos favoris",
        });
      }
    } else {
      const { error } = await supabase
        .from("favoris")
        .insert({
          utilisateur_id: user.id,
          livre_id: id,
        });

      if (!error) {
        setIsFavorite(true);
        toast({
          title: "Ajouté aux favoris",
          description: "Le livre a été ajouté à vos favoris",
        });
      }
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour ajouter au panier",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    
    addToCart({
      id,
      titre: title,
      auteur: author,
      prix: price,
      image,
    });
  };

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-elegant hover:-translate-y-1">
      <Link to={`/book/${id}`}>
        <div className="aspect-[3/4] overflow-hidden bg-secondary/20">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </Link>
      
      <div className="p-4 space-y-3">
        <div className="space-y-1">
          <p className="text-xs text-accent font-medium uppercase tracking-wide">{category}</p>
          <Link to={`/book/${id}`}>
            <h3 className="font-serif font-semibold text-lg line-clamp-2 transition-smooth group-hover:text-accent">
              {title}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground">{author}</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-accent">{formatPrice(price)}</span>
            <Button 
              size="icon"
              variant="ghost"
              className="transition-smooth hover:text-accent"
              onClick={toggleFavorite}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? "fill-accent text-accent" : ""}`} />
            </Button>
          </div>
          <Button 
            size="sm" 
            className="w-full bg-primary hover:bg-primary/90 transition-smooth"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Ajouter au panier
          </Button>
        </div>
      </div>
    </Card>
  );
};
