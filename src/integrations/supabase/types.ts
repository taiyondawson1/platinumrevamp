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
      get_user_id_from_account: {
        Args: {
          account_number: string
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
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
