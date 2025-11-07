import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BookCard } from "@/components/BookCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Shield, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import heroImage from "@/assets/hero-bg.jpg";


const Index = () => {
  const navigate = useNavigate();
  const [featuredBooks, setFeaturedBooks] = useState<any[]>([]);
  const [booksByCategory, setBooksByCategory] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetchFeaturedBooks();
    fetchBooksByCategory();
  }, []);

  const fetchFeaturedBooks = async () => {
    const { data, error } = await supabase
      .from("livres")
      .select(`
        id,
        titre,
        auteur,
        prix,
        images,
        categories (nom)
      `)
      .eq("a_la_une", true)
      .eq("statut", "disponible")
      .limit(6);

    if (!error && data) {
      setFeaturedBooks(data.map(book => ({
        id: book.id,
        title: book.titre,
        author: book.auteur,
        price: book.prix,
        image: book.images && book.images.length > 0 ? book.images[0] : "/placeholder.svg",
        category: book.categories?.nom || "Sans catégorie"
      })));
    }
  };

  const fetchBooksByCategory = async () => {
    // Fetch categories
    const { data: categoriesData } = await supabase
      .from("categories")
      .select("*")
      .limit(4);

    if (categoriesData) {
      setCategories(categoriesData);
      
      // Fetch books for each category
      const booksPromises = categoriesData.map(async (category) => {
        const { data } = await supabase
          .from("livres")
          .select(`
            id,
            titre,
            auteur,
            prix,
            images,
            categorie_id
          `)
          .eq("categorie_id", category.id)
          .eq("statut", "disponible")
          .limit(3);

        return {
          category: category.nom,
          books: data?.map(book => ({
            id: book.id,
            title: book.titre,
            author: book.auteur,
            price: book.prix,
            image: book.images && book.images.length > 0 ? book.images[0] : "/placeholder.svg",
            category: category.nom
          })) || []
        };
      });

      const booksData = await Promise.all(booksPromises);
      setBooksByCategory(booksData.filter(cat => cat.books.length > 0));
    }
  };

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


      {/* Featured Books Section - À la une */}
      {featuredBooks.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-accent/5 to-transparent">
          <div className="container">
            <div className="text-center space-y-4 mb-12 animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-serif font-bold">
                À la Une
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Les livres les plus en vogue du moment
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up">
              {featuredBooks.map((book) => (
                <BookCard key={book.id} {...book} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Books by Category */}
      {booksByCategory.map((categorySection, index) => (
        <section key={index} className="py-20">
          <div className="container">
            <div className="flex justify-between items-center mb-12 animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-serif font-bold">
                {categorySection.category}
              </h2>
              <Button 
                variant="ghost"
                className="text-accent hover:text-accent/80"
                onClick={() => navigate("/catalog")}
              >
                Voir tout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up">
              {categorySection.books.map((book: any) => (
                <BookCard key={book.id} {...book} />
              ))}
            </div>
          </div>
        </section>
      ))}

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
