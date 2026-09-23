export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      claims: {
        Row: {
          catatan_petugas: string | null
          ciri_barang: string
          created_at: string
          diverifikasi_oleh: string | null
          diverifikasi_pada: string | null
          id: string
          item_id: string
          keterangan: string | null
          lokasi_kehilangan: string
          nama_pengklaim: string
          no_hp: string
          nomor_klaim: string
          status: Database["public"]["Enums"]["claim_status"]
          updated_at: string
          waktu_kehilangan: string
        }
        Insert: {
          catatan_petugas?: string | null
          ciri_barang: string
          created_at?: string
          diverifikasi_oleh?: string | null
          diverifikasi_pada?: string | null
          id?: string
          item_id: string
          keterangan?: string | null
          lokasi_kehilangan: string
          nama_pengklaim: string
          no_hp: string
          nomor_klaim?: string
          status?: Database["public"]["Enums"]["claim_status"]
          updated_at?: string
          waktu_kehilangan: string
        }
        Update: {
          catatan_petugas?: string | null
          ciri_barang?: string
          created_at?: string
          diverifikasi_oleh?: string | null
          diverifikasi_pada?: string | null
          id?: string
          item_id?: string
          keterangan?: string | null
          lokasi_kehilangan?: string
          nama_pengklaim?: string
          no_hp?: string
          nomor_klaim?: string
          status?: Database["public"]["Enums"]["claim_status"]
          updated_at?: string
          waktu_kehilangan?: string
        }
        Relationships: [
          {
            foreignKeyName: "claims_diverifikasi_oleh_fkey"
            columns: ["diverifikasi_oleh"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "claims_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
        ]
      }
      items: {
        Row: {
          created_at: string
          deskripsi: string | null
          dicatat_oleh: string | null
          foto_path: string | null
          id: string
          kategori: Database["public"]["Enums"]["item_kategori"]
          kode_barang: string
          lokasi_ditemukan: string
          nama_barang: string
          status: Database["public"]["Enums"]["item_status"]
          tampilkan_foto: boolean
          tanggal_ditemukan: string
          updated_at: string
          warna: string | null
        }
        Insert: {
          created_at?: string
          deskripsi?: string | null
          dicatat_oleh?: string | null
          foto_path?: string | null
          id?: string
          kategori: Database["public"]["Enums"]["item_kategori"]
          kode_barang?: string
          lokasi_ditemukan: string
          nama_barang: string
          status?: Database["public"]["Enums"]["item_status"]
          tampilkan_foto?: boolean
          tanggal_ditemukan: string
          updated_at?: string
          warna?: string | null
        }
        Update: {
          created_at?: string
          deskripsi?: string | null
          dicatat_oleh?: string | null
          foto_path?: string | null
          id?: string
          kategori?: Database["public"]["Enums"]["item_kategori"]
          kode_barang?: string
          lokasi_ditemukan?: string
          nama_barang?: string
          status?: Database["public"]["Enums"]["item_status"]
          tampilkan_foto?: boolean
          tanggal_ditemukan?: string
          updated_at?: string
          warna?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "items_dicatat_oleh_fkey"
            columns: ["dicatat_oleh"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      nomor_urut: {
        Row: {
          prefix: string
          tahun: number
          terakhir: number
        }
        Insert: {
          prefix: string
          tahun: number
          terakhir?: number
        }
        Update: {
          prefix?: string
          tahun?: number
          terakhir?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          nama: string
          status: string
        }
        Insert: {
          created_at?: string
          id: string
          nama: string
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          nama?: string
          status?: string
        }
        Relationships: []
      }
      rate_limit: {
        Row: {
          jendela: string
          jumlah: number
          kunci: string
        }
        Insert: {
          jendela: string
          jumlah: number
          kunci: string
        }
        Update: {
          jendela?: string
          jumlah?: number
          kunci?: string
        }
        Relationships: []
      }
      returns: {
        Row: {
          catatan: string | null
          claim_id: string
          created_at: string
          foto_serah_terima: string
          id: string
          item_id: string
          persetujuan_foto: boolean
          petugas_id: string | null
          tanggal_pengembalian: string
        }
        Insert: {
          catatan?: string | null
          claim_id: string
          created_at?: string
          foto_serah_terima: string
          id?: string
          item_id: string
          persetujuan_foto: boolean
          petugas_id?: string | null
          tanggal_pengembalian?: string
        }
        Update: {
          catatan?: string | null
          claim_id?: string
          created_at?: string
          foto_serah_terima?: string
          id?: string
          item_id?: string
          persetujuan_foto?: boolean
          petugas_id?: string | null
          tanggal_pengembalian?: string
        }
        Relationships: [
          {
            foreignKeyName: "returns_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: true
            referencedRelation: "claims"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "returns_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: true
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "returns_petugas_id_fkey"
            columns: ["petugas_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      ajukan_klaim: {
        Args: {
          p_ciri_barang: string
          p_item_id: string
          p_keterangan?: string
          p_lokasi_kehilangan: string
          p_nama_pengklaim: string
          p_no_hp: string
          p_waktu_kehilangan: string
        }
        Returns: string
      }
      barang_publik_detail: {
        Args: { p_id: string }
        Returns: {
          foto_path: string
          id: string
          kategori: Database["public"]["Enums"]["item_kategori"]
          lokasi_ditemukan: string
          nama_barang: string
          status_publik: string
          tanggal_ditemukan: string
          warna: string
        }[]
      }
      buat_nomor: { Args: { p_prefix: string }; Returns: string }
      cari_barang_publik: {
        Args: {
          p_cari?: string
          p_kategori?: Database["public"]["Enums"]["item_kategori"]
          p_limit?: number
          p_offset?: number
        }
        Returns: {
          foto_path: string
          id: string
          kategori: Database["public"]["Enums"]["item_kategori"]
          lokasi_ditemukan: string
          nama_barang: string
          status_publik: string
          tanggal_ditemukan: string
          total: number
          warna: string
        }[]
      }
      cek_password_sendiri: { Args: { p_password: string }; Returns: boolean }
      is_petugas: { Args: never; Returns: boolean }
      laporan_per_bulan: {
        Args: {
          p_kategori?: Database["public"]["Enums"]["item_kategori"]
          p_tahun: number
        }
        Returns: {
          bulan: number
          dikembalikan: number
          ditemukan: number
        }[]
      }
      laporan_ringkasan: {
        Args: {
          p_dari?: string
          p_kategori?: Database["public"]["Enums"]["item_kategori"]
          p_lokasi?: string
          p_sampai?: string
        }
        Returns: {
          barang_dikembalikan: number
          barang_diklaim: number
          barang_ditemukan: number
          barang_tersimpan: number
          klaim_disetujui: number
          klaim_ditolak: number
          klaim_masuk: number
          klaim_menunggu: number
          klaim_selesai: number
        }[]
      }
      pakai_kuota: {
        Args: { p_jendela_detik: number; p_kunci: string; p_maks: number }
        Returns: boolean
      }
      proses_pengembalian: {
        Args: {
          p_catatan?: string
          p_claim_id: string
          p_foto_path: string
          p_persetujuan_foto: boolean
        }
        Returns: string
      }
      statistik_dashboard: {
        Args: never
        Returns: {
          barang_dikembalikan: number
          barang_diklaim: number
          barang_tersimpan: number
          klaim_menunggu: number
        }[]
      }
      verifikasi_klaim: {
        Args: { p_catatan?: string; p_claim_id: string; p_setujui: boolean }
        Returns: undefined
      }
    }
    Enums: {
      claim_status: "menunggu" | "disetujui" | "ditolak" | "selesai"
      item_kategori:
        | "dompet"
        | "tas"
        | "elektronik"
        | "kunci"
        | "dokumen"
        | "pakaian"
        | "aksesoris"
        | "lainnya"
      item_status: "tersimpan" | "diklaim" | "dikembalikan"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      claim_status: ["menunggu", "disetujui", "ditolak", "selesai"],
      item_kategori: [
        "dompet",
        "tas",
        "elektronik",
        "kunci",
        "dokumen",
        "pakaian",
        "aksesoris",
        "lainnya",
      ],
      item_status: ["tersimpan", "diklaim", "dikembalikan"],
    },
  },
} as const

