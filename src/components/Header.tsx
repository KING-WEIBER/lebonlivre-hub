import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, Search, Menu, User, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { SearchDialog } from "@/components/SearchDialog";
import logo from "@/assets/logo.png";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItems } = useCart();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      if (session) {
        loadUnreadNotifications(session.user.id);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      if (session) {
        loadUnreadNotifications(session.user.id);
      } else {
        setUnreadNotifications(0);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUnreadNotifications = async (userId: string) => {
    const { count } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("utilisateur_id", userId)
      .eq("lu", false);

    setUnreadNotifications(count || 0);
  };

  const handleUserClick = () => {
    navigate(isAuthenticated ? "/profile" : "/auth");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-3 transition-smooth hover:opacity-80">
          <img src={logo} alt="Le bon livre" className="h-12 w-auto" />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link 
            to="/" 
            className={`text-sm font-medium transition-smooth hover:text-accent ${
              isActive('/') ? 'text-accent border-b-2 border-accent pb-1' : ''
            }`}
          >
            Accueil
          </Link>
          <Link 
            to="/catalog" 
            className={`text-sm font-medium transition-smooth hover:text-accent ${
              isActive('/catalog') ? 'text-accent border-b-2 border-accent pb-1' : ''
            }`}
          >
            Catalogue
          </Link>
          <Link 
            to="/about" 
            className={`text-sm font-medium transition-smooth hover:text-accent ${
              isActive('/about') ? 'text-accent border-b-2 border-accent pb-1' : ''
            }`}
          >
            À propos
          </Link>
          <Link 
            to="/contact" 
            className={`text-sm font-medium transition-smooth hover:text-accent ${
              isActive('/contact') ? 'text-accent border-b-2 border-accent pb-1' : ''
            }`}
          >
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="transition-smooth hover:text-accent"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="transition-smooth hover:text-accent relative"
            onClick={() => navigate("/cart")}
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {totalItems}
              </Badge>
            )}
          </Button>
          {isAuthenticated && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="transition-smooth hover:text-accent relative"
              onClick={() => navigate("/notifications")}
            >
              <Bell className="h-5 w-5" />
              {unreadNotifications > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {unreadNotifications}
                </Badge>
              )}
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            className="transition-smooth hover:text-accent"
            onClick={handleUserClick}
          >
            <User className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
};
