import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SearchResult {
  id: string;
  titre: string;
  auteur: string;
  prix: number;
  images?: string[];
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    
    if (term.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("livres")
        .select("id, titre, auteur, prix, images")
        .or(`titre.ilike.%${term}%,auteur.ilike.%${term}%,description.ilike.%${term}%`)
        .eq("statut", "disponible")
        .limit(10);

      if (error) throw error;
      setResults(data || []);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de rechercher les livres",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectBook = (bookId: string) => {
    navigate(`/book/${bookId}`);
    onOpenChange(false);
    setSearchTerm("");
    setResults([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Rechercher un livre</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Titre, auteur ou catégorie..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>
          
          <div className="max-h-96 overflow-y-auto space-y-2">
            {loading && <p className="text-center text-muted-foreground py-4">Recherche...</p>}
            
            {!loading && searchTerm.length >= 2 && results.length === 0 && (
              <p className="text-center text-muted-foreground py-4">Aucun résultat trouvé</p>
            )}
            
            {results.map((book) => (
              <button
                key={book.id}
                onClick={() => handleSelectBook(book.id)}
                className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-secondary transition-colors text-left"
              >
                {book.images && book.images[0] && (
                  <img
                    src={book.images[0]}
                    alt={book.titre}
                    className="w-16 h-20 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <h4 className="font-semibold">{book.titre}</h4>
                  <p className="text-sm text-muted-foreground">{book.auteur}</p>
                  <p className="text-sm font-medium text-accent">{book.prix.toFixed(2)}€</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
