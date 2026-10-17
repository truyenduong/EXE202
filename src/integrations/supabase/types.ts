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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          accepted_at: string | null
          addons: string[]
          address: string
          area: string
          checklist_done: string[]
          cleaner_id: string | null
          cleaner_name: string | null
          code: string
          completed_at: string | null
          created_at: string
          host_id: string
          id: string
          note: string | null
          phone: string
          photo_after: string | null
          photo_before: string | null
          photo_sent_at: string | null
          payment_method: string
          payment_status: string
          price: number
          property_name: string
          property_type: string
          room_type: string
          rooms: number
          service_date: string
          status: string
          time_slot: string
          updated_at: string
          urgency: string
        }
        Insert: {
          accepted_at?: string | null
          addons?: string[]
          address: string
          area?: string
          checklist_done?: string[]
          cleaner_id?: string | null
          cleaner_name?: string | null
          code: string
          completed_at?: string | null
          created_at?: string
          host_id: string
          id?: string
          note?: string | null
          phone: string
          photo_after?: string | null
          photo_before?: string | null
          photo_sent_at?: string | null
          payment_method?: string
          payment_status?: string
          price?: number
          property_name: string
          property_type?: string
          room_type?: string
          rooms?: number
          service_date?: string
          status?: string
          time_slot?: string
          updated_at?: string
          urgency?: string
        }
        Update: {
          accepted_at?: string | null
          addons?: string[]
          address?: string
          area?: string
          checklist_done?: string[]
          cleaner_id?: string | null
          cleaner_name?: string | null
          code?: string
          completed_at?: string | null
          created_at?: string
          host_id?: string
          id?: string
          note?: string | null
          phone?: string
          photo_after?: string | null
          photo_before?: string | null
          photo_sent_at?: string | null
          payment_method?: string
          payment_status?: string
          price?: number
          property_name?: string
          property_type?: string
          room_type?: string
          rooms?: number
          service_date?: string
          status?: string
          time_slot?: string
          updated_at?: string
          urgency?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          area: string | null
          created_at: string
          full_name: string
          id: string
          phone: string
          property_name: string | null
          updated_at: string
        }
        Insert: {
          area?: string | null
          created_at?: string
          full_name?: string
          id: string
          phone: string
          property_name?: string | null
          updated_at?: string
        }
        Update: {
          area?: string | null
          created_at?: string
          full_name?: string
          id?: string
          phone?: string
          property_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          booking_id: string
          cleaner_id: string | null
          comment: string | null
          created_at: string
          host_id: string
          id: string
          rating: number
        }
        Insert: {
          booking_id: string
          cleaner_id?: string | null
          comment?: string | null
          created_at?: string
          host_id: string
          id?: string
          rating?: number
        }
        Update: {
          booking_id?: string
          cleaner_id?: string | null
          comment?: string | null
          created_at?: string
          host_id?: string
          id?: string
          rating?: number
        }
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: true
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      service_pricing: {
        Row: {
          id: boolean
          standard_price: number
          kitchen_price: number
          urgent_fee_1_2: number
          urgent_fee_3_4: number
          urgent_fee_5_plus: number
          bank_name: string
          bank_account: string
          bank_account_holder: string
          updated_at: string
        }
        Insert: {
          id?: boolean
          standard_price?: number
          kitchen_price?: number
          urgent_fee_1_2?: number
          urgent_fee_3_4?: number
          urgent_fee_5_plus?: number
          bank_name?: string
          bank_account?: string
          bank_account_holder?: string
          updated_at?: string
        }
        Update: {
          id?: boolean
          standard_price?: number
          kitchen_price?: number
          urgent_fee_1_2?: number
          urgent_fee_3_4?: number
          urgent_fee_5_plus?: number
          bank_name?: string
          bank_account?: string
          bank_account_holder?: string
          updated_at?: string
        }
        Relationships: []
      }
      cleaner_applications: {
        Row: {
          id: string
          user_id: string
          work_experience: string
          availability: string
          status: string
          reviewed_by: string | null
          reviewed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          work_experience?: string
          availability?: string
          status?: string
          reviewed_by?: string | null
          reviewed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          work_experience?: string
          availability?: string
          status?: string
          reviewed_by?: string | null
          reviewed_at?: string | null
          created_at?: string
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
      review_cleaner_application: {
        Args: {
          _application_id: string
          _approve: boolean
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "host" | "cleaner" | "admin"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["host", "cleaner", "admin"],
    },
  },
} as const
