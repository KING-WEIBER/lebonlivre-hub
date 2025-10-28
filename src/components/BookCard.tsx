import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

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

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour ajouter au panier",
        variant: "destructive",
      });
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

        <div className="flex items-center justify-between pt-2">
          <span className="text-2xl font-bold text-accent">{price}€</span>
          <Button 
            size="sm" 
            className="bg-primary hover:bg-primary/90 transition-smooth"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        </div>
      </div>
    </Card>
  );
};
