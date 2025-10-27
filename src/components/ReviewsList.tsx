import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Review {
  id: string;
  note: number;
  commentaire: string | null;
  date_creation: string;
  auteur_id: string;
  profiles: {
    nom_complet: string;
  };
}

interface ReviewsListProps {
  bookId: string;
  refreshTrigger?: number;
}

export function ReviewsList({ bookId, refreshTrigger }: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [bookId, refreshTrigger]);

  const fetchReviews = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("avis")
      .select(`
        *,
        profiles:auteur_id (
          nom_complet
        )
      `)
      .eq("cible_id", bookId)
      .eq("cible_type", "livre")
      .order("date_creation", { ascending: false });

    if (!error && data) {
      setReviews(data as any);
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="text-center py-8">Chargement des avis...</div>;
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucun avis pour le moment. Soyez le premier à en laisser un !
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold">
        Avis ({reviews.length})
      </h3>
      
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="p-4 bg-secondary/20 rounded-lg space-y-3">
            <div className="flex items-start gap-4">
              <Avatar>
                <AvatarFallback>
                  {review.profiles?.nom_complet?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{review.profiles?.nom_complet || "Utilisateur"}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(review.date_creation).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.note
                          ? "fill-accent text-accent"
                          : "text-muted"
                      }`}
                    />
                  ))}
                </div>
                {review.commentaire && (
                  <p className="mt-2 text-sm leading-relaxed">{review.commentaire}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
