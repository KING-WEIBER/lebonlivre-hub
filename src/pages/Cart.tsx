import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";

export default function Cart() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, totalPrice } = useCart();

  const shipping = totalPrice > 50 ? 0 : 5.99;
  const finalTotal = totalPrice + shipping;

  return (
    <>
      <Header />
      <main className="min-h-screen py-20 px-4 bg-secondary/20">
        <div className="container max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold font-serif mb-8">Mon Panier</h1>

          {items.length === 0 ? (
            <Card className="text-center py-16">
              <CardContent className="space-y-4">
                <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground" />
                <h2 className="text-2xl font-semibold">Votre panier est vide</h2>
                <p className="text-muted-foreground">
                  Découvrez notre catalogue et ajoutez des livres à votre panier
                </p>
                <Button onClick={() => navigate("/catalog")} className="mt-4">
                  Voir le catalogue
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-8 md:grid-cols-3">
              <div className="md:col-span-2 space-y-4">
                {items.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.titre}
                          className="w-24 h-32 object-cover rounded"
                        />
                        <div className="flex-1 space-y-2">
                          <div>
                            <h3 className="font-semibold text-lg">{item.titre}</h3>
                            <p className="text-sm text-muted-foreground">{item.auteur}</p>
                          </div>
                          
                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-2">
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-12 text-center font-medium">
                                {item.quantity}
                              </span>
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <div className="flex items-center gap-4">
                              <span className="text-xl font-bold text-accent">
                                {(item.prix * item.quantity).toFixed(2)}€
                              </span>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="text-destructive hover:text-destructive"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <Trash2 className="h-5 w-5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="md:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>Résumé de la commande</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                      <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Sous-total</span>
                        <span>{totalPrice.toFixed(2)}€</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Livraison</span>
                        <span>{shipping === 0 ? "Gratuite" : `${shipping.toFixed(2)}€`}</span>
                      </div>
                      {totalPrice < 50 && (
                        <p className="text-xs text-muted-foreground">
                          Livraison gratuite à partir de 50€
                        </p>
                      )}
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-accent">{finalTotal.toFixed(2)}€</span>
                    </div>
                    
                    <Button className="w-full" size="lg" onClick={() => navigate("/checkout")}>
                      Passer la commande
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => navigate("/catalog")}
                    >
                      Continuer mes achats
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
