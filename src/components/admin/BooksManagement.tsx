import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Search, Plus } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Book {
  id: string;
  titre: string;
  auteur: string;
  prix: number;
  etat: string;
  statut: string;
  vendeur_id: string;
  a_la_une?: boolean;
}

export function BooksManagement() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteBookId, setDeleteBookId] = useState<string | null>(null);
  const [editBook, setEditBook] = useState<Book | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    titre: "",
    auteur: "",
    prix: 0,
    description: "",
    etat: "bon" as "bon" | "neuf" | "usé",
    statut: "disponible" as "disponible" | "réservé" | "vendu",
    images: [] as string[],
    categorie_id: "" as string,
    a_la_une: false,
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("nom");
    setCategories(data || []);
  };

  useEffect(() => {
    if (editBook) {
      setFormData({
        titre: editBook.titre,
        auteur: editBook.auteur,
        prix: editBook.prix,
        description: "",
        etat: editBook.etat as "bon" | "neuf" | "usé",
        statut: editBook.statut as "disponible" | "réservé" | "vendu",
        images: [],
        categorie_id: "",
        a_la_une: editBook.a_la_une || false,
      });
    }
  }, [editBook]);

  const fetchBooks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("livres")
      .select("*")
      .order("date_ajout", { ascending: false });

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les livres",
        variant: "destructive",
      });
    } else {
      setBooks(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!deleteBookId) return;

    const { error } = await supabase
      .from("livres")
      .delete()
      .eq("id", deleteBookId);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le livre",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Succès",
        description: "Livre supprimé avec succès",
      });
      fetchBooks();
    }
    setDeleteBookId(null);
  };

  const handleUpdate = async () => {
    if (!editBook) return;

    const { error } = await supabase
      .from("livres")
      .update({
        titre: formData.titre,
        auteur: formData.auteur,
        prix: formData.prix,
        description: formData.description,
        etat: formData.etat,
        statut: formData.statut,
        a_la_une: formData.a_la_une,
      })
      .eq("id", editBook.id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le livre",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Succès",
        description: "Livre modifié avec succès",
      });
      fetchBooks();
      setEditBook(null);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Math.random()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('book-covers')
      .upload(fileName, file);

    if (uploadError) {
      toast({
        title: "Erreur",
        description: "Impossible de télécharger l'image",
        variant: "destructive",
      });
      setUploading(false);
      return;
    }

    const { data } = supabase.storage
      .from('book-covers')
      .getPublicUrl(fileName);

    setFormData({ ...formData, images: [data.publicUrl] });
    setUploading(false);
    toast({
      title: "Succès",
      description: "Image téléchargée avec succès",
    });
  };

  const handleAdd = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (!formData.titre || !formData.auteur || formData.prix <= 0) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from("livres")
      .insert({
        titre: formData.titre,
        auteur: formData.auteur,
        prix: formData.prix,
        description: formData.description,
        etat: formData.etat,
        statut: formData.statut,
        vendeur_id: user.id,
        images: formData.images,
        categorie_id: formData.categorie_id || null,
      });

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le livre",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Succès",
        description: "Livre ajouté avec succès",
      });
      fetchBooks();
      setAddDialogOpen(false);
      setFormData({
        titre: "",
        auteur: "",
        prix: 0,
        description: "",
        etat: "bon",
        statut: "disponible",
        images: [],
        categorie_id: "",
        a_la_une: false,
      });
    }
  };

  const filteredBooks = books.filter(
    (book) =>
      book.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.auteur.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par titre ou auteur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => setAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un livre
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Auteur</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>État</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Chargement...
                </TableCell>
              </TableRow>
            ) : filteredBooks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Aucun livre trouvé
                </TableCell>
              </TableRow>
            ) : (
              filteredBooks.map((book) => (
                <TableRow key={book.id}>
                  <TableCell className="font-medium">{book.titre}</TableCell>
                  <TableCell>{book.auteur}</TableCell>
                  <TableCell>{book.prix.toFixed(2)}€</TableCell>
                  <TableCell>
                    <Badge variant="outline">{book.etat}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={book.statut === "disponible" ? "default" : "secondary"}>
                      {book.statut}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setEditBook(book)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setDeleteBookId(book.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog de modification */}
      <Dialog open={!!editBook} onOpenChange={() => setEditBook(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifier le livre</DialogTitle>
            <DialogDescription>
              Modifiez les informations du livre
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="titre">Titre</Label>
              <Input
                id="titre"
                value={formData.titre}
                onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="auteur">Auteur</Label>
              <Input
                id="auteur"
                value={formData.auteur}
                onChange={(e) => setFormData({ ...formData, auteur: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="prix">Prix (€)</Label>
              <Input
                id="prix"
                type="number"
                step="0.01"
                value={formData.prix}
                onChange={(e) => setFormData({ ...formData, prix: parseFloat(e.target.value) })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="etat">État</Label>
                <Select
                  value={formData.etat}
                  onValueChange={(value) => setFormData({ ...formData, etat: value as "bon" | "neuf" | "usé" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="neuf">Neuf</SelectItem>
                    <SelectItem value="bon">Bon</SelectItem>
                    <SelectItem value="usé">Usé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="statut">Statut</Label>
                <Select
                  value={formData.statut}
                  onValueChange={(value) => setFormData({ ...formData, statut: value as "disponible" | "réservé" | "vendu" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="disponible">Disponible</SelectItem>
                    <SelectItem value="vendu">Vendu</SelectItem>
                    <SelectItem value="réservé">Réservé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-a-la-une"
                checked={formData.a_la_une}
                onCheckedChange={(checked) => setFormData({ ...formData, a_la_une: checked as boolean })}
              />
              <Label htmlFor="edit-a-la-une" className="cursor-pointer">
                Mettre à la une
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditBook(null)}>
              Annuler
            </Button>
            <Button onClick={handleUpdate}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog d'ajout */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ajouter un livre</DialogTitle>
            <DialogDescription>
              Ajoutez un nouveau livre au catalogue
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="add-titre">Titre</Label>
              <Input
                id="add-titre"
                value={formData.titre}
                onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-auteur">Auteur</Label>
              <Input
                id="add-auteur"
                value={formData.auteur}
                onChange={(e) => setFormData({ ...formData, auteur: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-prix">Prix (€)</Label>
              <Input
                id="add-prix"
                type="number"
                step="0.01"
                value={formData.prix}
                onChange={(e) => setFormData({ ...formData, prix: parseFloat(e.target.value) })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-description">Description</Label>
              <Textarea
                id="add-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-image">Image de couverture</Label>
              <div className="flex gap-2">
                <Input
                  ref={fileInputRef}
                  id="add-image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {uploading ? "Téléchargement..." : formData.images[0] ? "Changer l'image" : "Télécharger une image"}
                </Button>
              </div>
              {formData.images[0] && (
                <div className="mt-2">
                  <img src={formData.images[0]} alt="Aperçu" className="h-32 w-24 object-cover rounded" />
                </div>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-categorie">Catégorie</Label>
              <Select
                value={formData.categorie_id}
                onValueChange={(value) => setFormData({ ...formData, categorie_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="add-etat">État</Label>
                <Select
                  value={formData.etat}
                  onValueChange={(value) => setFormData({ ...formData, etat: value as "bon" | "neuf" | "usé" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="neuf">Neuf</SelectItem>
                    <SelectItem value="bon">Bon</SelectItem>
                    <SelectItem value="usé">Usé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="add-statut">Statut</Label>
                <Select
                  value={formData.statut}
                  onValueChange={(value) => setFormData({ ...formData, statut: value as "disponible" | "réservé" | "vendu" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="disponible">Disponible</SelectItem>
                    <SelectItem value="vendu">Vendu</SelectItem>
                    <SelectItem value="réservé">Réservé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="add-a-la-une"
                checked={formData.a_la_une}
                onCheckedChange={(checked) => setFormData({ ...formData, a_la_une: checked as boolean })}
              />
              <Label htmlFor="add-a-la-une" className="cursor-pointer">
                Mettre à la une
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleAdd}>Ajouter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={!!deleteBookId} onOpenChange={() => setDeleteBookId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce livre ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
