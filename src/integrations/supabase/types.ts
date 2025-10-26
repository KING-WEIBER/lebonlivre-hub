export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      avis: {
        Row: {
          auteur_id: string
          cible_id: string
          cible_type: Database["public"]["Enums"]["type_avis"]
          commentaire: string | null
          date_creation: string | null
          id: string
          note: number
        }
        Insert: {
          auteur_id: string
          cible_id: string
          cible_type: Database["public"]["Enums"]["type_avis"]
          commentaire?: string | null
          date_creation?: string | null
          id?: string
          note: number
        }
        Update: {
          auteur_id?: string
          cible_id?: string
          cible_type?: Database["public"]["Enums"]["type_avis"]
          commentaire?: string | null
          date_creation?: string | null
          id?: string
          note?: number
        }
        Relationships: [
          {
            foreignKeyName: "avis_auteur_id_fkey"
            columns: ["auteur_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          icone: string | null
          id: string
          nom: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icone?: string | null
          id?: string
          nom: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icone?: string | null
          id?: string
          nom?: string
        }
        Relationships: []
      }
      commandes: {
        Row: {
          acheteur_id: string
          date_creation: string | null
          id: string
          livre_id: string
          mode_paiement: Database["public"]["Enums"]["mode_paiement"] | null
          montant_total: number
          statut: Database["public"]["Enums"]["statut_commande"] | null
          vendeur_id: string
        }
        Insert: {
          acheteur_id: string
          date_creation?: string | null
          id?: string
          livre_id: string
          mode_paiement?: Database["public"]["Enums"]["mode_paiement"] | null
          montant_total: number
          statut?: Database["public"]["Enums"]["statut_commande"] | null
          vendeur_id: string
        }
        Update: {
          acheteur_id?: string
          date_creation?: string | null
          id?: string
          livre_id?: string
          mode_paiement?: Database["public"]["Enums"]["mode_paiement"] | null
          montant_total?: number
          statut?: Database["public"]["Enums"]["statut_commande"] | null
          vendeur_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "commandes_acheteur_id_fkey"
            columns: ["acheteur_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commandes_livre_id_fkey"
            columns: ["livre_id"]
            isOneToOne: false
            referencedRelation: "livres"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commandes_vendeur_id_fkey"
            columns: ["vendeur_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      favoris: {
        Row: {
          date_ajout: string | null
          id: string
          livre_id: string
          utilisateur_id: string
        }
        Insert: {
          date_ajout?: string | null
          id?: string
          livre_id: string
          utilisateur_id: string
        }
        Update: {
          date_ajout?: string | null
          id?: string
          livre_id?: string
          utilisateur_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favoris_livre_id_fkey"
            columns: ["livre_id"]
            isOneToOne: false
            referencedRelation: "livres"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favoris_utilisateur_id_fkey"
            columns: ["utilisateur_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      historiques: {
        Row: {
          action: string
          date_action: string | null
          details: string | null
          id: string
          utilisateur_id: string
        }
        Insert: {
          action: string
          date_action?: string | null
          details?: string | null
          id?: string
          utilisateur_id: string
        }
        Update: {
          action?: string
          date_action?: string | null
          details?: string | null
          id?: string
          utilisateur_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "historiques_utilisateur_id_fkey"
            columns: ["utilisateur_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      livres: {
        Row: {
          auteur: string
          categorie_id: string | null
          date_ajout: string | null
          description: string | null
          etat: Database["public"]["Enums"]["etat_livre"] | null
          id: string
          images: string[] | null
          prix: number
          statut: Database["public"]["Enums"]["statut_livre"] | null
          titre: string
          vendeur_id: string
        }
        Insert: {
          auteur: string
          categorie_id?: string | null
          date_ajout?: string | null
          description?: string | null
          etat?: Database["public"]["Enums"]["etat_livre"] | null
          id?: string
          images?: string[] | null
          prix: number
          statut?: Database["public"]["Enums"]["statut_livre"] | null
          titre: string
          vendeur_id: string
        }
        Update: {
          auteur?: string
          categorie_id?: string | null
          date_ajout?: string | null
          description?: string | null
          etat?: Database["public"]["Enums"]["etat_livre"] | null
          id?: string
          images?: string[] | null
          prix?: number
          statut?: Database["public"]["Enums"]["statut_livre"] | null
          titre?: string
          vendeur_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "livres_categorie_id_fkey"
            columns: ["categorie_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "livres_vendeur_id_fkey"
            columns: ["vendeur_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          contenu: string
          date_envoi: string | null
          destinataire_id: string
          expediteur_id: string
          id: string
          lu: boolean | null
        }
        Insert: {
          contenu: string
          date_envoi?: string | null
          destinataire_id: string
          expediteur_id: string
          id?: string
          lu?: boolean | null
        }
        Update: {
          contenu?: string
          date_envoi?: string | null
          destinataire_id?: string
          expediteur_id?: string
          id?: string
          lu?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_destinataire_id_fkey"
            columns: ["destinataire_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_expediteur_id_fkey"
            columns: ["expediteur_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          date_envoi: string | null
          id: string
          lu: boolean | null
          message: string
          titre: string
          type: Database["public"]["Enums"]["type_notification"]
          utilisateur_id: string
        }
        Insert: {
          date_envoi?: string | null
          id?: string
          lu?: boolean | null
          message: string
          titre: string
          type: Database["public"]["Enums"]["type_notification"]
          utilisateur_id: string
        }
        Update: {
          date_envoi?: string | null
          id?: string
          lu?: boolean | null
          message?: string
          titre?: string
          type?: Database["public"]["Enums"]["type_notification"]
          utilisateur_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_utilisateur_id_fkey"
            columns: ["utilisateur_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          date_inscription: string | null
          derniere_connexion: string | null
          email: string
          id: string
          nom_complet: string
          photo_profil: string | null
          telephone: string | null
          verifie: boolean | null
        }
        Insert: {
          date_inscription?: string | null
          derniere_connexion?: string | null
          email: string
          id: string
          nom_complet: string
          photo_profil?: string | null
          telephone?: string | null
          verifie?: boolean | null
        }
        Update: {
          date_inscription?: string | null
          derniere_connexion?: string | null
          email?: string
          id?: string
          nom_complet?: string
          photo_profil?: string | null
          telephone?: string | null
          verifie?: boolean | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "utilisateur" | "administrateur"
      etat_livre: "neuf" | "bon" | "usé"
      mode_paiement: "espèces" | "autre"
      statut_commande:
        | "en_attente"
        | "confirmée"
        | "livrée"
        | "annulée"
        | "en_preparation"
        | "expédiée"
      statut_livre: "disponible" | "vendu" | "réservé"
      type_avis: "livre" | "vendeur"
      type_notification: "commande" | "message" | "systeme"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["utilisateur", "administrateur"],
      etat_livre: ["neuf", "bon", "usé"],
      mode_paiement: ["espèces", "autre"],
      statut_commande: [
        "en_attente",
        "confirmée",
        "livrée",
        "annulée",
        "en_preparation",
        "expédiée",
      ],
      statut_livre: ["disponible", "vendu", "réservé"],
      type_avis: ["livre", "vendeur"],
      type_notification: ["commande", "message", "systeme"],
    },
  },
} as const
