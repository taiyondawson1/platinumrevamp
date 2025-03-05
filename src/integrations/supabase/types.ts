export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      account_metrics: {
        Row: {
          account_number: string
          average_loss: number | null
          average_win: number | null
          balance: number | null
          created_at: string
          equity: number | null
          floating: number | null
          free_margin: number | null
          id: string
          margin: number | null
          margin_level: number | null
          max_drawdown: number | null
          open_positions: number | null
          profit_factor: number | null
          total_orders: number | null
          user_id: string
          win_rate: number | null
        }
        Insert: {
          account_number: string
          average_loss?: number | null
          average_win?: number | null
          balance?: number | null
          created_at?: string
          equity?: number | null
          floating?: number | null
          free_margin?: number | null
          id?: string
          margin?: number | null
          margin_level?: number | null
          max_drawdown?: number | null
          open_positions?: number | null
          profit_factor?: number | null
          total_orders?: number | null
          user_id: string
          win_rate?: number | null
        }
        Update: {
          account_number?: string
          average_loss?: number | null
          average_win?: number | null
          balance?: number | null
          created_at?: string
          equity?: number | null
          floating?: number | null
          free_margin?: number | null
          id?: string
          margin?: number | null
          margin_level?: number | null
          max_drawdown?: number | null
          open_positions?: number | null
          profit_factor?: number | null
          total_orders?: number | null
          user_id?: string
          win_rate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "account_metrics_account_number_fkey"
            columns: ["account_number"]
            isOneToOne: false
            referencedRelation: "mt4_accounts"
            referencedColumns: ["account_number"]
          },
        ]
      }
      account_requests: {
        Row: {
          created_at: string | null
          id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      course_progress: {
        Row: {
          completed: boolean | null
          course_id: string
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string
          watch_time: number | null
        }
        Insert: {
          completed?: boolean | null
          course_id: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
          watch_time?: number | null
        }
        Update: {
          completed?: boolean | null
          course_id?: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
          watch_time?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "course_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          created_at: string | null
          description: string | null
          duration: string | null
          id: string
          lessons: number | null
          name: string
          path: string | null
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration?: string | null
          id?: string
          lessons?: number | null
          name: string
          path?: string | null
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration?: string | null
          id?: string
          lessons?: number | null
          name?: string
          path?: string | null
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      customer_accounts: {
        Row: {
          created_at: string
          email: string
          enrolled_by: string | null
          id: string
          license_key: string | null
          name: string
          phone: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          enrolled_by?: string | null
          id?: string
          license_key?: string | null
          name: string
          phone?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          enrolled_by?: string | null
          id?: string
          license_key?: string | null
          name?: string
          phone?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      customer_requests: {
        Row: {
          created_at: string
          customer_id: string | null
          customer_name: string
          description: string | null
          handled_by: string | null
          id: string
          request_type: string
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          customer_name: string
          description?: string | null
          handled_by?: string | null
          id?: string
          request_type: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          customer_name?: string
          description?: string | null
          handled_by?: string | null
          id?: string
          request_type?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_requests_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
          revenue: string
          sales_rep_id: string
          staff_key: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          phone?: string | null
          revenue?: string
          sales_rep_id: string
          staff_key?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
          revenue?: string
          sales_rep_id?: string
          staff_key?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      license_keys: {
        Row: {
          account_numbers: string[]
          created_at: string | null
          email: string
          enrolled_by: string | null
          enroller_id: string | null
          expiry_date: string | null
          id: string
          license_key: string
          name: string
          phone: string
          product_code: string
          staff_id: string | null
          staff_key: string
          status: string | null
          subscription_type: string
          user_id: string
        }
        Insert: {
          account_numbers: string[]
          created_at?: string | null
          email: string
          enrolled_by?: string | null
          enroller_id?: string | null
          expiry_date?: string | null
          id?: string
          license_key: string
          name: string
          phone?: string
          product_code: string
          staff_id?: string | null
          staff_key: string
          status?: string | null
          subscription_type: string
          user_id: string
        }
        Update: {
          account_numbers?: string[]
          created_at?: string | null
          email?: string
          enrolled_by?: string | null
          enroller_id?: string | null
          expiry_date?: string | null
          id?: string
          license_key?: string
          name?: string
          phone?: string
          product_code?: string
          staff_id?: string | null
          staff_key?: string
          status?: string | null
          subscription_type?: string
          user_id?: string
        }
        Relationships: []
      }
      mt4_accounts: {
        Row: {
          account_name: string | null
          account_number: string
          chart_suffix: string | null
          created_at: string
          id: string
          password: string
          platform: string | null
          server: string
          user_id: string
        }
        Insert: {
          account_name?: string | null
          account_number: string
          chart_suffix?: string | null
          created_at?: string
          id?: string
          password: string
          platform?: string | null
          server: string
          user_id: string
        }
        Update: {
          account_name?: string | null
          account_number?: string
          chart_suffix?: string | null
          created_at?: string
          id?: string
          password?: string
          platform?: string | null
          server?: string
          user_id?: string
        }
        Relationships: []
      }
      mt4_logs: {
        Row: {
          account_number: string
          created_at: string
          id: string
          log_message: string
          log_type: string
          user_id: string
        }
        Insert: {
          account_number: string
          created_at?: string
          id?: string
          log_message: string
          log_type: string
          user_id: string
        }
        Update: {
          account_number?: string
          created_at?: string
          id?: string
          log_message?: string
          log_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mt4_logs_account_number_fkey"
            columns: ["account_number"]
            isOneToOne: false
            referencedRelation: "mt4_accounts"
            referencedColumns: ["account_number"]
          },
        ]
      }
      myfxbook_sessions: {
        Row: {
          created_at: string
          email: string
          id: string
          session: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          session: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          session?: string
          user_id?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          product_code: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          product_code: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          product_code?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          staff_key: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"]
          staff_key?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          staff_key?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      sales: {
        Row: {
          amount: number
          created_at: string
          customer_id: string
          date: string
          id: string
          product_name: string | null
          sales_rep_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          customer_id: string
          date?: string
          id?: string
          product_name?: string | null
          sales_rep_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          customer_id?: string
          date?: string
          id?: string
          product_name?: string | null
          sales_rep_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_keys: {
        Row: {
          created_at: string
          created_by: string | null
          email: string | null
          id: string
          key: string
          name: string | null
          password: string | null
          role: string
          status: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          email?: string | null
          id?: string
          key: string
          name?: string | null
          password?: string | null
          role: string
          status?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          email?: string | null
          id?: string
          key?: string
          name?: string | null
          password?: string | null
          role?: string
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      trades: {
        Row: {
          account_number: string
          created_at: string
          duration: string | null
          entry_date: string
          exit_date: string
          id: string
          result: number
          size: number
          symbol: string
          trader_name: string | null
          type: string
          user_id: string
        }
        Insert: {
          account_number: string
          created_at?: string
          duration?: string | null
          entry_date: string
          exit_date: string
          id?: string
          result: number
          size: number
          symbol: string
          trader_name?: string | null
          type: string
          user_id: string
        }
        Update: {
          account_number?: string
          created_at?: string
          duration?: string | null
          entry_date?: string
          exit_date?: string
          id?: string
          result?: number
          size?: number
          symbol?: string
          trader_name?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trades_account_number_fkey"
            columns: ["account_number"]
            isOneToOne: false
            referencedRelation: "mt4_accounts"
            referencedColumns: ["account_number"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_user_role: {
        Args: {
          role_to_check: string
        }
        Returns: boolean
      }
      cleanup_all_customer_staff_keys: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_profile_with_role: {
        Args: {
          user_id: string
          role_name: string
          staff_key_value: string
        }
        Returns: undefined
      }
      ensure_user_profile: {
        Args: {
          user_id: string
          user_role: string
          user_staff_key: string
        }
        Returns: undefined
      }
      execute_admin_query: {
        Args: {
          query_text: string
        }
        Returns: undefined
      }
      generate_random_6digit: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_random_license_key: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_id_from_account: {
        Args: {
          account_number: string
        }
        Returns: string
      }
      is_staff_manager: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      repair_missing_customer_records: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      user_role: "ceo" | "admin" | "enroller" | "customer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
