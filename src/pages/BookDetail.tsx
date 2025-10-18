import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Heart, Share2, Star, Truck, Shield } from "lucide-react";
import { useParams } from "react-router-dom";
import book1 from "@/assets/book1.jpg";

const BookDetail = () => {
  const { id } = useParams();

  // Mock data - will be replaced with real data later
  const book = {
    id: "1",
    title: "Les Mystères de Paris",
    author: "Marie Dufresne",
    price: 24.99,
    image: book1,
    category: "Roman Classique",
    isbn: "978-2-1234-5678-9",
    pages: 456,
    publisher: "Éditions Le bon livre",
    publishDate: "2024",
    language: "Français",
    description: "Plongez dans les rues mystérieuses de Paris du XIXe siècle avec ce roman captivant. Marie Dufresne nous offre une fresque historique riche en rebondissements, où se mêlent intrigues politiques, romances interdites et secrets de famille. Une œuvre magistrale qui vous transportera dans une époque révolue, avec une plume élégante et un sens du détail remarquable.",
    inStock: true,
    rating: 4.5,
    reviews: 127,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Book Image */}
            <div className="animate-fade-in">
              <div className="sticky top-24">
                <div className="aspect-[3/4] overflow-hidden rounded-lg shadow-elegant bg-secondary/20">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Book Info */}
            <div className="space-y-6 animate-fade-in-up">
              <div>
                <Badge className="mb-3 bg-accent/10 text-accent hover:bg-accent/20">
                  {book.category}
                </Badge>
                <h1 className="text-4xl md:text-5xl font-serif font-bold mb-2">
                  {book.title}
                </h1>
                <p className="text-xl text-muted-foreground">
                  par <span className="text-foreground font-medium">{book.author}</span>
                </p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(book.rating)
                          ? "fill-accent text-accent"
                          : "text-muted"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {book.rating} ({book.reviews} avis)
                </span>
              </div>

              <Separator />

              {/* Price and Actions */}
              <div className="space-y-4">
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-bold text-accent">{book.price}€</span>
                  <span className="text-muted-foreground line-through">29.99€</span>
                </div>

                {book.inStock ? (
                  <p className="text-green-600 font-medium flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    En stock - Expédition immédiate
                  </p>
                ) : (
                  <p className="text-destructive font-medium">Temporairement indisponible</p>
                )}

                <div className="flex gap-3">
                  <Button 
                    size="lg" 
                    className="flex-1 bg-primary hover:bg-primary/90 text-lg py-6 transition-smooth"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Ajouter au panier
                  </Button>
                  <Button size="lg" variant="outline" className="transition-smooth">
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button size="lg" variant="outline" className="transition-smooth">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>

                <Button 
                  size="lg" 
                  variant="outline"
                  className="w-full border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-smooth"
                >
                  Acheter maintenant
                </Button>
              </div>

              <Separator />

              {/* Description */}
              <div>
                <h2 className="text-2xl font-serif font-bold mb-4">Description</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {book.description}
                </p>
              </div>

              {/* Details */}
              <div>
                <h2 className="text-2xl font-serif font-bold mb-4">Détails</h2>
                <dl className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="font-medium text-muted-foreground">ISBN</dt>
                    <dd className="mt-1">{book.isbn}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-muted-foreground">Pages</dt>
                    <dd className="mt-1">{book.pages}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-muted-foreground">Éditeur</dt>
                    <dd className="mt-1">{book.publisher}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-muted-foreground">Date de publication</dt>
                    <dd className="mt-1">{book.publishDate}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-muted-foreground">Langue</dt>
                    <dd className="mt-1">{book.language}</dd>
                  </div>
                </dl>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/30">
                  <Truck className="h-6 w-6 text-accent flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium">Livraison rapide</p>
                    <p className="text-muted-foreground">2-3 jours ouvrés</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/30">
                  <Shield className="h-6 w-6 text-accent flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium">Paiement sécurisé</p>
                    <p className="text-muted-foreground">100% protégé</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookDetail;
