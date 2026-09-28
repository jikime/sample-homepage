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
      agency_applications: {
        Row: {
          agree_privacy: boolean
          code: string
          company: string
          contact_name: string
          created_at: string
          email: string
          id: string
          status: string
          updated_at: string
        }
        Insert: {
          agree_privacy: boolean
          code?: string
          company: string
          contact_name: string
          created_at?: string
          email: string
          id?: string
          status?: string
          updated_at?: string
        }
        Update: {
          agree_privacy?: boolean
          code?: string
          company?: string
          contact_name?: string
          created_at?: string
          email?: string
          id?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      artworks: {
        Row: {
          category: string
          created_at: string
          creator: string
          height: number
          id: string
          placement: string
          placement_short: string
          size_label: string
          storage_path: string
          title: string
          tone: string
          updated_at: string
          width: number
        }
        Insert: {
          category: string
          created_at?: string
          creator: string
          height: number
          id: string
          placement: string
          placement_short: string
          size_label: string
          storage_path: string
          title: string
          tone: string
          updated_at?: string
          width: number
        }
        Update: {
          category?: string
          created_at?: string
          creator?: string
          height?: number
          id?: string
          placement?: string
          placement_short?: string
          size_label?: string
          storage_path?: string
          title?: string
          tone?: string
          updated_at?: string
          width?: number
        }
        Relationships: []
      }
      landing_candidates: {
        Row: {
          artwork_id: string
          base_price: number
          display_order: number
          generation: string
          generation_mobile: string | null
          id: string
          lead_days: number
          license: string
          page_slug: string
          quality_note: string
          quality_note_mobile: string | null
          variations: string
          variations_mobile: string | null
        }
        Insert: {
          artwork_id: string
          base_price: number
          display_order: number
          generation: string
          generation_mobile?: string | null
          id: string
          lead_days: number
          license: string
          page_slug: string
          quality_note: string
          quality_note_mobile?: string | null
          variations: string
          variations_mobile?: string | null
        }
        Update: {
          artwork_id?: string
          base_price?: number
          display_order?: number
          generation?: string
          generation_mobile?: string | null
          id?: string
          lead_days?: number
          license?: string
          page_slug?: string
          quality_note?: string
          quality_note_mobile?: string | null
          variations?: string
          variations_mobile?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "landing_candidates_artwork_id_fkey"
            columns: ["artwork_id"]
            isOneToOne: false
            referencedRelation: "artworks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "landing_candidates_page_slug_fkey"
            columns: ["page_slug"]
            isOneToOne: false
            referencedRelation: "landing_pages"
            referencedColumns: ["slug"]
          },
        ]
      }
      landing_compare_examples: {
        Row: {
          caption: string
          caption_mobile: string | null
          default_candidate_id: string
          page_slug: string
        }
        Insert: {
          caption: string
          caption_mobile?: string | null
          default_candidate_id: string
          page_slug: string
        }
        Update: {
          caption?: string
          caption_mobile?: string | null
          default_candidate_id?: string
          page_slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "landing_compare_examples_default_candidate_id_fkey"
            columns: ["default_candidate_id"]
            isOneToOne: false
            referencedRelation: "landing_candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "landing_compare_examples_page_slug_fkey"
            columns: ["page_slug"]
            isOneToOne: true
            referencedRelation: "landing_pages"
            referencedColumns: ["slug"]
          },
        ]
      }
      landing_compare_row_labels: {
        Row: {
          label: string
          label_mobile: string | null
          page_slug: string
          position: number
        }
        Insert: {
          label: string
          label_mobile?: string | null
          page_slug: string
          position: number
        }
        Update: {
          label?: string
          label_mobile?: string | null
          page_slug?: string
          position?: number
        }
        Relationships: [
          {
            foreignKeyName: "landing_compare_row_labels_page_slug_fkey"
            columns: ["page_slug"]
            isOneToOne: false
            referencedRelation: "landing_pages"
            referencedColumns: ["slug"]
          },
        ]
      }
      landing_faqs: {
        Row: {
          answer: string
          answer_mobile: string | null
          id: string
          page_slug: string
          question: string
          sort_order: number
        }
        Insert: {
          answer: string
          answer_mobile?: string | null
          id: string
          page_slug: string
          question: string
          sort_order: number
        }
        Update: {
          answer?: string
          answer_mobile?: string | null
          id?: string
          page_slug?: string
          question?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "landing_faqs_page_slug_fkey"
            columns: ["page_slug"]
            isOneToOne: false
            referencedRelation: "landing_pages"
            referencedColumns: ["slug"]
          },
        ]
      }
      landing_final_ctas: {
        Row: {
          description: string
          overline: string
          page_slug: string
          primary_cta: string
          secondary_cta_href: string
          secondary_cta_label: string
          title_lines: string[]
          title_lines_mobile: string[] | null
        }
        Insert: {
          description: string
          overline: string
          page_slug: string
          primary_cta: string
          secondary_cta_href: string
          secondary_cta_label: string
          title_lines: string[]
          title_lines_mobile?: string[] | null
        }
        Update: {
          description?: string
          overline?: string
          page_slug?: string
          primary_cta?: string
          secondary_cta_href?: string
          secondary_cta_label?: string
          title_lines?: string[]
          title_lines_mobile?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "landing_final_ctas_page_slug_fkey"
            columns: ["page_slug"]
            isOneToOne: true
            referencedRelation: "landing_pages"
            referencedColumns: ["slug"]
          },
        ]
      }
      landing_footer_links: {
        Row: {
          href: string
          id: number
          label: string
          page_slug: string
          sort_order: number
        }
        Insert: {
          href: string
          id?: never
          label: string
          page_slug: string
          sort_order: number
        }
        Update: {
          href?: string
          id?: never
          label?: string
          page_slug?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "landing_footer_links_page_slug_fkey"
            columns: ["page_slug"]
            isOneToOne: false
            referencedRelation: "landing_pages"
            referencedColumns: ["slug"]
          },
        ]
      }
      landing_footers: {
        Row: {
          copyright: string
          creator_contact_href: string
          creator_contact_label: string
          creator_contact_link_label: string
          creator_contact_link_label_mobile: string | null
          page_slug: string
          tagline: string
        }
        Insert: {
          copyright: string
          creator_contact_href: string
          creator_contact_label: string
          creator_contact_link_label: string
          creator_contact_link_label_mobile?: string | null
          page_slug: string
          tagline: string
        }
        Update: {
          copyright?: string
          creator_contact_href?: string
          creator_contact_label?: string
          creator_contact_link_label?: string
          creator_contact_link_label_mobile?: string | null
          page_slug?: string
          tagline?: string
        }
        Relationships: [
          {
            foreignKeyName: "landing_footers_page_slug_fkey"
            columns: ["page_slug"]
            isOneToOne: true
            referencedRelation: "landing_pages"
            referencedColumns: ["slug"]
          },
        ]
      }
      landing_hero_showcase_items: {
        Row: {
          artwork_id: string
          id: number
          layout: string
          page_slug: string
          position: number
          variant_height: number | null
          variant_size_label: string | null
          variant_storage_path: string | null
          variant_width: number | null
        }
        Insert: {
          artwork_id: string
          id?: never
          layout: string
          page_slug: string
          position: number
          variant_height?: number | null
          variant_size_label?: string | null
          variant_storage_path?: string | null
          variant_width?: number | null
        }
        Update: {
          artwork_id?: string
          id?: never
          layout?: string
          page_slug?: string
          position?: number
          variant_height?: number | null
          variant_size_label?: string | null
          variant_storage_path?: string | null
          variant_width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "landing_hero_showcase_items_artwork_id_fkey"
            columns: ["artwork_id"]
            isOneToOne: false
            referencedRelation: "artworks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "landing_hero_showcase_items_page_slug_fkey"
            columns: ["page_slug"]
            isOneToOne: false
            referencedRelation: "landing_pages"
            referencedColumns: ["slug"]
          },
        ]
      }
      landing_heroes: {
        Row: {
          description: string
          description_mobile: string | null
          headline_accent: string
          headline_lines: string[]
          note: string
          note_mobile: string | null
          overline: string
          overline_mobile: string | null
          page_slug: string
          primary_cta: string
          secondary_cta_href: string
          secondary_cta_label: string
          updated_at: string
        }
        Insert: {
          description: string
          description_mobile?: string | null
          headline_accent: string
          headline_lines: string[]
          note: string
          note_mobile?: string | null
          overline: string
          overline_mobile?: string | null
          page_slug: string
          primary_cta: string
          secondary_cta_href: string
          secondary_cta_label: string
          updated_at?: string
        }
        Update: {
          description?: string
          description_mobile?: string | null
          headline_accent?: string
          headline_lines?: string[]
          note?: string
          note_mobile?: string | null
          overline?: string
          overline_mobile?: string | null
          page_slug?: string
          primary_cta?: string
          secondary_cta_href?: string
          secondary_cta_label?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "landing_heroes_page_slug_fkey"
            columns: ["page_slug"]
            isOneToOne: true
            referencedRelation: "landing_pages"
            referencedColumns: ["slug"]
          },
        ]
      }
      landing_nav_items: {
        Row: {
          href: string
          id: number
          label: string
          page_slug: string
          sort_order: number
        }
        Insert: {
          href: string
          id?: never
          label: string
          page_slug: string
          sort_order: number
        }
        Update: {
          href?: string
          id?: never
          label?: string
          page_slug?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "landing_nav_items_page_slug_fkey"
            columns: ["page_slug"]
            isOneToOne: false
            referencedRelation: "landing_pages"
            referencedColumns: ["slug"]
          },
        ]
      }
      landing_operating_rules: {
        Row: {
          description: string
          description_mobile: string | null
          emphasis: boolean
          id: number
          page_slug: string
          sort_order: number
          title: string
          unit: string
          value: string
        }
        Insert: {
          description: string
          description_mobile?: string | null
          emphasis?: boolean
          id?: never
          page_slug: string
          sort_order: number
          title: string
          unit: string
          value: string
        }
        Update: {
          description?: string
          description_mobile?: string | null
          emphasis?: boolean
          id?: never
          page_slug?: string
          sort_order?: number
          title?: string
          unit?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "landing_operating_rules_page_slug_fkey"
            columns: ["page_slug"]
            isOneToOne: false
            referencedRelation: "landing_pages"
            referencedColumns: ["slug"]
          },
        ]
      }
      landing_pages: {
        Row: {
          created_at: string
          login_href: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          login_href: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          login_href?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      landing_problem_items: {
        Row: {
          code: string
          id: number
          label: string
          page_slug: string
          problem: string
          solution: string
          sort_order: number
          title: string
        }
        Insert: {
          code: string
          id?: never
          label: string
          page_slug: string
          problem: string
          solution: string
          sort_order: number
          title: string
        }
        Update: {
          code?: string
          id?: never
          label?: string
          page_slug?: string
          problem?: string
          solution?: string
          sort_order?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "landing_problem_items_page_slug_fkey"
            columns: ["page_slug"]
            isOneToOne: false
            referencedRelation: "landing_pages"
            referencedColumns: ["slug"]
          },
        ]
      }
      landing_process_steps: {
        Row: {
          code: string
          description: string
          description_mobile: string | null
          id: number
          page_slug: string
          sort_order: number
          title: string
        }
        Insert: {
          code: string
          description: string
          description_mobile?: string | null
          id?: never
          page_slug: string
          sort_order: number
          title: string
        }
        Update: {
          code?: string
          description?: string
          description_mobile?: string | null
          id?: never
          page_slug?: string
          sort_order?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "landing_process_steps_page_slug_fkey"
            columns: ["page_slug"]
            isOneToOne: false
            referencedRelation: "landing_pages"
            referencedColumns: ["slug"]
          },
        ]
      }
      landing_sample_items: {
        Row: {
          artwork_id: string
          page_slug: string
          sort_order: number
        }
        Insert: {
          artwork_id: string
          page_slug: string
          sort_order: number
        }
        Update: {
          artwork_id?: string
          page_slug?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "landing_sample_items_artwork_id_fkey"
            columns: ["artwork_id"]
            isOneToOne: false
            referencedRelation: "artworks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "landing_sample_items_page_slug_fkey"
            columns: ["page_slug"]
            isOneToOne: false
            referencedRelation: "landing_pages"
            referencedColumns: ["slug"]
          },
        ]
      }
      landing_sample_sections: {
        Row: {
          initial_count_desktop: number
          initial_count_mobile: number
          more_label: string
          page_slug: string
        }
        Insert: {
          initial_count_desktop: number
          initial_count_mobile: number
          more_label: string
          page_slug: string
        }
        Update: {
          initial_count_desktop?: number
          initial_count_mobile?: number
          more_label?: string
          page_slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "landing_sample_sections_page_slug_fkey"
            columns: ["page_slug"]
            isOneToOne: true
            referencedRelation: "landing_pages"
            referencedColumns: ["slug"]
          },
        ]
      }
      landing_section_headings: {
        Row: {
          description: string | null
          description_mobile: string | null
          overline: string
          page_slug: string
          section: string
          title_lines: string[]
          title_lines_mobile: string[] | null
        }
        Insert: {
          description?: string | null
          description_mobile?: string | null
          overline: string
          page_slug: string
          section: string
          title_lines: string[]
          title_lines_mobile?: string[] | null
        }
        Update: {
          description?: string | null
          description_mobile?: string | null
          overline?: string
          page_slug?: string
          section?: string
          title_lines?: string[]
          title_lines_mobile?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "landing_section_headings_page_slug_fkey"
            columns: ["page_slug"]
            isOneToOne: false
            referencedRelation: "landing_pages"
            referencedColumns: ["slug"]
          },
        ]
      }
      landing_term_rows: {
        Row: {
          desktop_only: boolean
          id: number
          label: string
          mono_prefix: string | null
          note: string | null
          note_mobile: string | null
          page_slug: string
          sort_order: number
          value: string
          value_mobile: string | null
        }
        Insert: {
          desktop_only?: boolean
          id?: never
          label: string
          mono_prefix?: string | null
          note?: string | null
          note_mobile?: string | null
          page_slug: string
          sort_order: number
          value: string
          value_mobile?: string | null
        }
        Update: {
          desktop_only?: boolean
          id?: never
          label?: string
          mono_prefix?: string | null
          note?: string | null
          note_mobile?: string | null
          page_slug?: string
          sort_order?: number
          value?: string
          value_mobile?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "landing_term_rows_page_slug_fkey"
            columns: ["page_slug"]
            isOneToOne: false
            referencedRelation: "landing_pages"
            referencedColumns: ["slug"]
          },
        ]
      }
      landing_terms_sections: {
        Row: {
          detail_link_href: string
          detail_link_label: string
          faq_title: string
          page_slug: string
        }
        Insert: {
          detail_link_href: string
          detail_link_label: string
          faq_title: string
          page_slug: string
        }
        Update: {
          detail_link_href?: string
          detail_link_label?: string
          faq_title?: string
          page_slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "landing_terms_sections_page_slug_fkey"
            columns: ["page_slug"]
            isOneToOne: true
            referencedRelation: "landing_pages"
            referencedColumns: ["slug"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const

