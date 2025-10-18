import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BookCard } from "@/components/BookCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal } from "lucide-react";
import book1 from "@/assets/book1.jpg";
import book2 from "@/assets/book2.jpg";
import book3 from "@/assets/book3.jpg";

const allBooks = [
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
  {
    id: "4",
    title: "Voyage au Bout de la Nuit",
    author: "Jean Renard",
    price: 22.99,
    image: book1,
    category: "Roman Classique",
  },
  {
    id: "5",
    title: "Poésie Contemporaine",
    author: "Claire Dubois",
    price: 16.99,
    image: book2,
    category: "Poésie",
  },
  {
    id: "6",
    title: "Histoire de France",
    author: "Pierre Martin",
    price: 34.99,
    image: book3,
    category: "Histoire",
  },
];

const Catalog = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Page Header */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
        <div className="container text-center space-y-4 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-serif font-bold">
            Notre Catalogue
          </h1>
          <p className="text-xl max-w-2xl mx-auto opacity-90">
            Explorez notre collection complète de livres soigneusement sélectionnés
          </p>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 border-b bg-secondary/20">
        <div className="container">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher un livre, un auteur..."
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-4 w-full md:w-auto">
              <Select defaultValue="all">
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes catégories</SelectItem>
                  <SelectItem value="classic">Roman Classique</SelectItem>
                  <SelectItem value="modern">Littérature Moderne</SelectItem>
                  <SelectItem value="poetry">Poésie</SelectItem>
                  <SelectItem value="history">Histoire</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="newest">
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Plus récent</SelectItem>
                  <SelectItem value="price-asc">Prix croissant</SelectItem>
                  <SelectItem value="price-desc">Prix décroissant</SelectItem>
                  <SelectItem value="title">Titre A-Z</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon">
                <SlidersHorizontal className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Books Grid */}
      <section className="py-12 flex-1">
        <div className="container">
          <div className="mb-6">
            <p className="text-muted-foreground">
              {allBooks.length} livre{allBooks.length > 1 ? 's' : ''} trouvé{allBooks.length > 1 ? 's' : ''}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-fade-in-up">
            {allBooks.map((book) => (
              <BookCard key={book.id} {...book} />
            ))}
          </div>

          {/* Pagination placeholder */}
          <div className="mt-12 flex justify-center gap-2">
            <Button variant="outline" size="sm">Précédent</Button>
            <Button variant="default" size="sm">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <Button variant="outline" size="sm">Suivant</Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Catalog;
