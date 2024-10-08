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
      block_models: {
        Row: {
          args: number[] | null
          created_at: string
          id: string
          is_rigid: boolean | null
          land_id: string | null
          material_color: string | null
          material_map: string | null
          material_normal_map: string | null
          material_type: string | null
          model: string | null
          model_url: string | null
          name: string | null
          pid: string | null
          position: number[] | null
          rotation: string[] | null
          scale: number[] | null
          type: string | null
        }
        Insert: {
          args?: number[] | null
          created_at?: string
          id?: string
          is_rigid?: boolean | null
          land_id?: string | null
          material_color?: string | null
          material_map?: string | null
          material_normal_map?: string | null
          material_type?: string | null
          model?: string | null
          model_url?: string | null
          name?: string | null
          pid?: string | null
          position?: number[] | null
          rotation?: string[] | null
          scale?: number[] | null
          type?: string | null
        }
        Update: {
          args?: number[] | null
          created_at?: string
          id?: string
          is_rigid?: boolean | null
          land_id?: string | null
          material_color?: string | null
          material_map?: string | null
          material_normal_map?: string | null
          material_type?: string | null
          model?: string | null
          model_url?: string | null
          name?: string | null
          pid?: string | null
          position?: number[] | null
          rotation?: string[] | null
          scale?: number[] | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_block_models_land_id_fkey"
            columns: ["land_id"]
            isOneToOne: false
            referencedRelation: "land_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_block_models_pid_fkey"
            columns: ["pid"]
            isOneToOne: false
            referencedRelation: "block_models"
            referencedColumns: ["id"]
          },
        ]
      }
      CommentRecord: {
        Row: {
          comment_id: number | null
          content: string | null
          created_at: string
          id: number
          image_url: string | null
          like_num: number
          parent_id: number
          post_id: string | null
          user_id: string
        }
        Insert: {
          comment_id?: number | null
          content?: string | null
          created_at?: string
          id?: number
          image_url?: string | null
          like_num?: number
          parent_id?: number
          post_id?: string | null
          user_id: string
        }
        Update: {
          comment_id?: number | null
          content?: string | null
          created_at?: string
          id?: number
          image_url?: string | null
          like_num?: number
          parent_id?: number
          post_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "commentrecord_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "PxCmtyArticles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commentrecord_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      FansInfo: {
        Row: {
          avatar: string | null
          b_id: string | null
          created_at: string
          id: number
          sign: string | null
          user_name: string | null
        }
        Insert: {
          avatar?: string | null
          b_id?: string | null
          created_at?: string
          id?: number
          sign?: string | null
          user_name?: string | null
        }
        Update: {
          avatar?: string | null
          b_id?: string | null
          created_at?: string
          id?: number
          sign?: string | null
          user_name?: string | null
        }
        Relationships: []
      }
      Keyword: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          id: number
          label_name: string | null
          label_type: number | null
          user_id: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: number
          label_name?: string | null
          label_type?: number | null
          user_id?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: number
          label_name?: string | null
          label_type?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "keyword_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      land_info: {
        Row: {
          block_count: number
          border_size: number
          capacity_size: number | null
          cover_icon_url: string | null
          created_at: string
          external_link: string | null
          external_link_type: string | null
          fill_color: string
          id: string
          is_inland: boolean
          land_description: string | null
          land_level: string
          land_name: string
          land_owner: string
          land_status: string
          land_type: string
          parent_land_id: string | null
          show_cover_list: Json[] | null
          skip_url: string | null
          use_external_link: boolean
          used_pixel_blocks: number
          world_coordinates_x: number
          world_coordinates_y: number
          world_size_x: number
          world_size_y: number
        }
        Insert: {
          block_count?: number
          border_size?: number
          capacity_size?: number | null
          cover_icon_url?: string | null
          created_at?: string
          external_link?: string | null
          external_link_type?: string | null
          fill_color?: string
          id?: string
          is_inland?: boolean
          land_description?: string | null
          land_level?: string
          land_name: string
          land_owner: string
          land_status?: string
          land_type?: string
          parent_land_id?: string | null
          show_cover_list?: Json[] | null
          skip_url?: string | null
          use_external_link?: boolean
          used_pixel_blocks?: number
          world_coordinates_x: number
          world_coordinates_y: number
          world_size_x: number
          world_size_y: number
        }
        Update: {
          block_count?: number
          border_size?: number
          capacity_size?: number | null
          cover_icon_url?: string | null
          created_at?: string
          external_link?: string | null
          external_link_type?: string | null
          fill_color?: string
          id?: string
          is_inland?: boolean
          land_description?: string | null
          land_level?: string
          land_name?: string
          land_owner?: string
          land_status?: string
          land_type?: string
          parent_land_id?: string | null
          show_cover_list?: Json[] | null
          skip_url?: string | null
          use_external_link?: boolean
          used_pixel_blocks?: number
          world_coordinates_x?: number
          world_coordinates_y?: number
          world_size_x?: number
          world_size_y?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_land_info_land_owner_fkey"
            columns: ["land_owner"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      land_world_info: {
        Row: {
          background_color: string | null
          background_src: string | null
          created_at: string
          height: number | null
          id: number
          land_id: string | null
          name: string | null
          status: number | null
          width: number | null
        }
        Insert: {
          background_color?: string | null
          background_src?: string | null
          created_at?: string
          height?: number | null
          id?: number
          land_id?: string | null
          name?: string | null
          status?: number | null
          width?: number | null
        }
        Update: {
          background_color?: string | null
          background_src?: string | null
          created_at?: string
          height?: number | null
          id?: number
          land_id?: string | null
          name?: string | null
          status?: number | null
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "land_world_info_land_id_fkey"
            columns: ["land_id"]
            isOneToOne: false
            referencedRelation: "land_info"
            referencedColumns: ["id"]
          },
        ]
      }
      LikeRecord: {
        Row: {
          comment_id: number | null
          created_at: string
          id: number
          like_user_id: string | null
          liked: boolean
          post_id: string | null
          type: number | null
          type_index: number
          user_id: string | null
        }
        Insert: {
          comment_id?: number | null
          created_at?: string
          id?: number
          like_user_id?: string | null
          liked?: boolean
          post_id?: string | null
          type?: number | null
          type_index?: number
          user_id?: string | null
        }
        Update: {
          comment_id?: number | null
          created_at?: string
          id?: number
          like_user_id?: string | null
          liked?: boolean
          post_id?: string | null
          type?: number | null
          type_index?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "likerecord_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "CommentRecord"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likerecord_like_user_id_fkey"
            columns: ["like_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likerecord_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "PxCmtyArticles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likerecord_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      likes: {
        Row: {
          created_at: string
          id: string
          land_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          land_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          land_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_land_id_fkey"
            columns: ["land_id"]
            isOneToOne: false
            referencedRelation: "land_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      PixelInfo: {
        Row: {
          created_at: string
          fill_color: string | null
          height: number | null
          id: number
          image_src: string | null
          name: string | null
          skip_type: number | null
          skip_url: string | null
          type: number | null
          width: number | null
          x: number | null
          y: number | null
        }
        Insert: {
          created_at?: string
          fill_color?: string | null
          height?: number | null
          id?: number
          image_src?: string | null
          name?: string | null
          skip_type?: number | null
          skip_url?: string | null
          type?: number | null
          width?: number | null
          x?: number | null
          y?: number | null
        }
        Update: {
          created_at?: string
          fill_color?: string | null
          height?: number | null
          id?: number
          image_src?: string | null
          name?: string | null
          skip_type?: number | null
          skip_url?: string | null
          type?: number | null
          width?: number | null
          x?: number | null
          y?: number | null
        }
        Relationships: []
      }
      ProductsInfo: {
        Row: {
          created_at: string
          description: string | null
          hot_num: number | null
          icon_url: string | null
          id: number
          is_verify: boolean | null
          keywords: number[] | null
          name: string | null
          pay_text: string | null
          pay_type: string | null
          post_id: string | null
          provider_id: string | null
          score_num: number | null
          type: number | null
          web_url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          hot_num?: number | null
          icon_url?: string | null
          id?: number
          is_verify?: boolean | null
          keywords?: number[] | null
          name?: string | null
          pay_text?: string | null
          pay_type?: string | null
          post_id?: string | null
          provider_id?: string | null
          score_num?: number | null
          type?: number | null
          web_url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          hot_num?: number | null
          icon_url?: string | null
          id?: number
          is_verify?: boolean | null
          keywords?: number[] | null
          name?: string | null
          pay_text?: string | null
          pay_type?: string | null
          post_id?: string | null
          provider_id?: string | null
          score_num?: number | null
          type?: number | null
          web_url?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          id: string
          name: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          id: string
          name?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          id?: string
          name?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      PxCmtyArticles: {
        Row: {
          banner_img_url: string | null
          comment_record_num: number | null
          content: string | null
          created_at: string
          description: string | null
          id: string
          keywords: number[] | null
          like_array: number[] | null
          title: string | null
          user_id: string
        }
        Insert: {
          banner_img_url?: string | null
          comment_record_num?: number | null
          content?: string | null
          created_at?: string
          description?: string | null
          id?: string
          keywords?: number[] | null
          like_array?: number[] | null
          title?: string | null
          user_id?: string
        }
        Update: {
          banner_img_url?: string | null
          comment_record_num?: number | null
          content?: string | null
          created_at?: string
          description?: string | null
          id?: string
          keywords?: number[] | null
          like_array?: number[] | null
          title?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "PxCmtyArticles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      RejectRecord: {
        Row: {
          created_at: string
          describe: string | null
          id: number
          post_id: string | null
          status: boolean | null
          type: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          describe?: string | null
          id?: number
          post_id?: string | null
          status?: boolean | null
          type?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          describe?: string | null
          id?: number
          post_id?: string | null
          status?: boolean | null
          type?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rejectrecord_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "PxCmtyArticles"
            referencedColumns: ["id"]
          },
        ]
      }
      ShowCoverImg: {
        Row: {
          alt: string | null
          created_at: string
          id: number
          land_id: string | null
          show_cover_list: Json[] | null
          sort: number | null
          src: string | null
          user_id: string | null
        }
        Insert: {
          alt?: string | null
          created_at?: string
          id?: number
          land_id?: string | null
          show_cover_list?: Json[] | null
          sort?: number | null
          src?: string | null
          user_id?: string | null
        }
        Update: {
          alt?: string | null
          created_at?: string
          id?: number
          land_id?: string | null
          show_cover_list?: Json[] | null
          sort?: number | null
          src?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ShowCoverImg_land_id_fkey"
            columns: ["land_id"]
            isOneToOne: false
            referencedRelation: "land_info"
            referencedColumns: ["id"]
          },
        ]
      }
      test: {
        Row: {
          created_at: string
          id: string
        }
        Insert: {
          created_at?: string
          id?: string
        }
        Update: {
          created_at?: string
          id?: string
        }
        Relationships: []
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
