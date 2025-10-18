import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t bg-secondary/30 mt-20">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-serif font-bold text-lg mb-4">Le bon livre</h3>
            <p className="text-sm text-muted-foreground">
              Votre librairie en ligne pour découvrir des œuvres soigneusement sélectionnées.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground transition-smooth hover:text-accent">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/catalog" className="text-muted-foreground transition-smooth hover:text-accent">
                  Catalogue
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground transition-smooth hover:text-accent">
                  À propos
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Informations</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/contact" className="text-muted-foreground transition-smooth hover:text-accent">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/legal" className="text-muted-foreground transition-smooth hover:text-accent">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground transition-smooth hover:text-accent">
                  Confidentialité
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Suivez-nous</h4>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground transition-smooth hover:text-accent">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground transition-smooth hover:text-accent">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground transition-smooth hover:text-accent">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground transition-smooth hover:text-accent">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© 2025 Le bon livre. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};
