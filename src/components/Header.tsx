import { Link } from "react-router-dom";
import { ShoppingCart, Search, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-3 transition-smooth hover:opacity-80">
          <img src={logo} alt="Le bon livre" className="h-12 w-auto" />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium transition-smooth hover:text-accent">
            Accueil
          </Link>
          <Link to="/catalog" className="text-sm font-medium transition-smooth hover:text-accent">
            Catalogue
          </Link>
          <Link to="/about" className="text-sm font-medium transition-smooth hover:text-accent">
            À propos
          </Link>
          <Link to="/contact" className="text-sm font-medium transition-smooth hover:text-accent">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="transition-smooth hover:text-accent">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="transition-smooth hover:text-accent">
            <ShoppingCart className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="transition-smooth hover:text-accent"
            asChild
          >
            <Link to="/auth">
              <User className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
