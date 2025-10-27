import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";

interface ReviewFormProps {
  bookId: string;
  onReviewAdded: () => void;
}

export function ReviewForm({ bookId, onReviewAdded }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une note",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour laisser un avis",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("avis").insert({
      auteur_id: user.id,
      cible_type: "livre",
      cible_id: bookId,
      note: rating,
      commentaire: comment || null,
    });

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter votre avis",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Succès",
        description: "Votre avis a été ajouté avec succès",
      });
      setRating(0);
      setComment("");
      onReviewAdded();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-secondary/20 rounded-lg">
      <h3 className="text-xl font-semibold">Laisser un avis</h3>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Note</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="transition-transform hover:scale-110"
            >
              <Star
                className={`h-8 w-8 ${
                  star <= (hoveredRating || rating)
                    ? "fill-accent text-accent"
                    : "text-muted"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="comment" className="text-sm font-medium">
          Commentaire (optionnel)
        </label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Partagez votre expérience avec ce livre..."
          rows={4}
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Envoi..." : "Publier mon avis"}
      </Button>
    </form>
  );
}
