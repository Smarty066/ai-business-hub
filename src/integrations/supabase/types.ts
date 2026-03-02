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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          action: string
          created_at: string
          details: string | null
          id: string
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: string | null
          id?: string
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: string | null
          id?: string
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      affiliate_content: {
        Row: {
          body: string
          created_at: string
          created_by: string | null
          id: string
          image_url: string | null
          title: string
        }
        Insert: {
          body: string
          created_at?: string
          created_by?: string | null
          id?: string
          image_url?: string | null
          title: string
        }
        Update: {
          body?: string
          created_at?: string
          created_by?: string | null
          id?: string
          image_url?: string | null
          title?: string
        }
        Relationships: []
      }
      bank_details: {
        Row: {
          account_name: string
          account_number: string
          bank_name: string
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          account_name?: string
          account_number?: string
          bank_name?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          account_name?: string
          account_number?: string
          bank_name?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          booking_date: string
          booking_time: string
          created_at: string
          email: string | null
          estimated_wait: number | null
          id: string
          name: string
          phone: string | null
          queue_position: number | null
          service: string
          status: string
          user_id: string
        }
        Insert: {
          booking_date: string
          booking_time: string
          created_at?: string
          email?: string | null
          estimated_wait?: number | null
          id?: string
          name: string
          phone?: string | null
          queue_position?: number | null
          service: string
          status?: string
          user_id: string
        }
        Update: {
          booking_date?: string
          booking_time?: string
          created_at?: string
          email?: string | null
          estimated_wait?: number | null
          id?: string
          name?: string
          phone?: string | null
          queue_position?: number | null
          service?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          channel: string | null
          created_at: string
          email: string | null
          id: string
          last_contact: string | null
          name: string
          next_follow_up: string | null
          notes: string | null
          phone: string | null
          status: string | null
          tags: string[] | null
          total_spent: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          channel?: string | null
          created_at?: string
          email?: string | null
          id?: string
          last_contact?: string | null
          name: string
          next_follow_up?: string | null
          notes?: string | null
          phone?: string | null
          status?: string | null
          tags?: string[] | null
          total_spent?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          channel?: string | null
          created_at?: string
          email?: string | null
          id?: string
          last_contact?: string | null
          name?: string
          next_follow_up?: string | null
          notes?: string | null
          phone?: string | null
          status?: string | null
          tags?: string[] | null
          total_spent?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      inventory: {
        Row: {
          category: string
          cost_price: number
          created_at: string
          id: string
          last_restocked: string | null
          name: string
          quantity: number
          reorder_level: number
          selling_price: number
          supplier: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          cost_price?: number
          created_at?: string
          id?: string
          last_restocked?: string | null
          name: string
          quantity?: number
          reorder_level?: number
          selling_price?: number
          supplier?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          cost_price?: number
          created_at?: string
          id?: string
          last_restocked?: string | null
          name?: string
          quantity?: number
          reorder_level?: number
          selling_price?: number
          supplier?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notes: {
        Row: {
          color: string | null
          content: string
          created_at: string
          id: string
          pinned: boolean
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          color?: string | null
          content?: string
          created_at?: string
          id?: string
          pinned?: boolean
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          color?: string | null
          content?: string
          created_at?: string
          id?: string
          pinned?: boolean
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          business_name: string
          created_at: string
          full_name: string
          id: string
          phone: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          business_name?: string
          created_at?: string
          full_name?: string
          id?: string
          phone?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          business_name?: string
          created_at?: string
          full_name?: string
          id?: string
          phone?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          created_at: string
          id: string
          referral_code: string
          referred_id: string | null
          referred_name: string | null
          referred_phone: string | null
          referrer_id: string
          signup_earned: number
          status: string
          subscription_earned: number
          total_earned: number
          withdrawn: number
        }
        Insert: {
          created_at?: string
          id?: string
          referral_code: string
          referred_id?: string | null
          referred_name?: string | null
          referred_phone?: string | null
          referrer_id: string
          signup_earned?: number
          status?: string
          subscription_earned?: number
          total_earned?: number
          withdrawn?: number
        }
        Update: {
          created_at?: string
          id?: string
          referral_code?: string
          referred_id?: string | null
          referred_name?: string | null
          referred_phone?: string | null
          referrer_id?: string
          signup_earned?: number
          status?: string
          subscription_earned?: number
          total_earned?: number
          withdrawn?: number
        }
        Relationships: []
      }
      sales_records: {
        Row: {
          category: string | null
          created_at: string
          id: string
          item_name: string
          notes: string | null
          quantity: number
          sale_date: string
          total_amount: number
          unit_price: number
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          item_name: string
          notes?: string | null
          quantity?: number
          sale_date?: string
          total_amount?: number
          unit_price?: number
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          item_name?: string
          notes?: string | null
          quantity?: number
          sale_date?: string
          total_amount?: number
          unit_price?: number
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          category: string | null
          created_at: string
          description: string
          id: string
          transaction_date: string
          type: string
          user_id: string
        }
        Insert: {
          amount?: number
          category?: string | null
          created_at?: string
          description: string
          id?: string
          transaction_date?: string
          type?: string
          user_id: string
        }
        Update: {
          amount?: number
          category?: string | null
          created_at?: string
          description?: string
          id?: string
          transaction_date?: string
          type?: string
          user_id?: string
        }
        Relationships: []
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
          role?: Database["public"]["Enums"]["app_role"]
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
    }
    Views: {
      referrals_safe: {
        Row: {
          created_at: string | null
          id: string | null
          referral_code: string | null
          referred_id: string | null
          referred_name: string | null
          referred_phone: string | null
          referrer_id: string | null
          signup_earned: number | null
          status: string | null
          subscription_earned: number | null
          total_earned: number | null
          withdrawn: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string | null
          referral_code?: string | null
          referred_id?: string | null
          referred_name?: string | null
          referred_phone?: never
          referrer_id?: string | null
          signup_earned?: number | null
          status?: string | null
          subscription_earned?: number | null
          total_earned?: number | null
          withdrawn?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string | null
          referral_code?: string | null
          referred_id?: string | null
          referred_name?: string | null
          referred_phone?: never
          referrer_id?: string | null
          signup_earned?: number | null
          status?: string | null
          subscription_earned?: number | null
          total_earned?: number | null
          withdrawn?: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      mask_phone: { Args: { phone: string }; Returns: string }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
