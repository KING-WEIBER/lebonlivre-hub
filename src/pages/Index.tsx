import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BookCard } from "@/components/BookCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Shield, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-bg.jpg";
import book1 from "@/assets/book1.jpg";
import book2 from "@/assets/book2.jpg";
import book3 from "@/assets/book3.jpg";

const featuredBooks = [
  {
    id: "1",
    title: "Les Mystères de Paris",
    author: "Marie Dufresne",
    price: 24.99,
    image: book1,
    category: "Roman Classique",
  },
  {
    id: "2",
    title: "Lumières d'Automne",
    author: "Laurent Mercier",
    price: 19.99,
    image: book2,
    category: "Littérature Moderne",
  },
  {
    id: "3",
    title: "Contes d'Or et d'Azur",
    author: "Sophie Beaumont",
    price: 29.99,
    image: book3,
    category: "Édition de Luxe",
  },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 to-primary/80" />
        
        <div className="relative z-10 container text-center space-y-6 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-primary-foreground leading-tight">
            Découvrez le plaisir
            <br />
            <span className="text-gradient-gold">de la lecture</span>
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-2xl mx-auto">
            Une sélection soigneusement choisie de livres qui éveilleront votre imagination
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              size="lg" 
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-lg px-8 py-6 transition-spring"
              onClick={() => navigate("/catalog")}
            >
              Explorer le catalogue
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary font-semibold text-lg px-8 py-6 transition-spring"
              onClick={() => navigate("/about")}
            >
              En savoir plus
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center space-y-4 p-6 animate-fade-in-up">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                <Star className="h-8 w-8 text-accent" />
              </div>
              <h3 className="font-serif font-bold text-xl">Sélection Premium</h3>
              <p className="text-muted-foreground">
                Chaque livre est soigneusement choisi pour sa qualité littéraire
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-4 p-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                <Shield className="h-8 w-8 text-accent" />
              </div>
              <h3 className="font-serif font-bold text-xl">Paiement Sécurisé</h3>
              <p className="text-muted-foreground">
                Vos transactions sont protégées par les meilleurs standards
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-4 p-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                <Truck className="h-8 w-8 text-accent" />
              </div>
              <h3 className="font-serif font-bold text-xl">Livraison Rapide</h3>
              <p className="text-muted-foreground">
                Recevez vos livres dans les meilleurs délais, partout en France
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center space-y-4 mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-serif font-bold">
              Nos Livres en Vedette
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Découvrez notre sélection spéciale de ce mois-ci
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up">
            {featuredBooks.map((book) => (
              <BookCard key={book.id} {...book} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              size="lg"
              className="bg-primary hover:bg-primary/90 transition-smooth"
              onClick={() => navigate("/catalog")}
            >
              Voir tous les livres
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
        <div className="container text-center space-y-6 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-serif font-bold">
            Rejoignez notre communauté de lecteurs
          </h2>
          <p className="text-xl max-w-2xl mx-auto opacity-90">
            Inscrivez-vous à notre newsletter et recevez nos recommandations exclusives
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto pt-4">
            <input
              type="email"
              placeholder="Votre adresse email"
              className="px-6 py-3 rounded-lg text-foreground flex-1 focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <Button 
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground transition-smooth"
            >
              S'inscrire
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
