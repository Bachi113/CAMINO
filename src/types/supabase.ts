export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      bank_details: {
        Row: {
          account_number: string;
          bank_name: string;
          created_at: string;
          iban_code: string;
          id: string;
          purchasing_currency: string;
          sort_code: string | null;
          swift_code: string | null;
          user_id: string;
        };
        Insert: {
          account_number: string;
          bank_name: string;
          created_at?: string;
          iban_code: string;
          id?: string;
          purchasing_currency: string;
          sort_code?: string | null;
          swift_code?: string | null;
          user_id: string;
        };
        Update: {
          account_number?: string;
          bank_name?: string;
          created_at?: string;
          iban_code?: string;
          id?: string;
          purchasing_currency?: string;
          sort_code?: string | null;
          swift_code?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      banks_list: {
        Row: {
          bank_id: string | null;
          bank_name: string;
          created_at: string;
          id: number;
        };
        Insert: {
          bank_id?: string | null;
          bank_name: string;
          created_at?: string;
          id?: number;
        };
        Update: {
          bank_id?: string | null;
          bank_name?: string;
          created_at?: string;
          id?: number;
        };
        Relationships: [];
      };
      business_addresses: {
        Row: {
          city: string;
          country: string;
          created_at: string;
          id: string;
          phone_number: string;
          postal_code: string;
          street_address: string;
          user_id: string;
        };
        Insert: {
          city: string;
          country: string;
          created_at?: string;
          id?: string;
          phone_number: string;
          postal_code: string;
          street_address: string;
          user_id: string;
        };
        Update: {
          city?: string;
          country?: string;
          created_at?: string;
          id?: string;
          phone_number?: string;
          postal_code?: string;
          street_address?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      business_details: {
        Row: {
          business_name: string;
          business_type: string;
          created_at: string;
          id: string;
          registration_type: string;
          user_id: string;
          vat_registration_number: string;
        };
        Insert: {
          business_name: string;
          business_type: string;
          created_at?: string;
          id?: string;
          registration_type: string;
          user_id: string;
          vat_registration_number: string;
        };
        Update: {
          business_name?: string;
          business_type?: string;
          created_at?: string;
          id?: string;
          registration_type?: string;
          user_id?: string;
          vat_registration_number?: string;
        };
        Relationships: [];
      };
      customers: {
        Row: {
          address: string | null;
          created_at: string;
          customer_name: string | null;
          email: string | null;
          id: string;
          phone: string | null;
          stripe_id: string | null;
          user_id: string | null;
        };
        Insert: {
          address?: string | null;
          created_at?: string;
          customer_name?: string | null;
          email?: string | null;
          id?: string;
          phone?: string | null;
          stripe_id?: string | null;
          user_id?: string | null;
        };
        Update: {
          address?: string | null;
          created_at?: string;
          customer_name?: string | null;
          email?: string | null;
          id?: string;
          phone?: string | null;
          stripe_id?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      documents: {
        Row: {
          created_at: string;
          document_urls: Json;
          experience: string;
          id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          document_urls: Json;
          experience: string;
          id?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          document_urls?: Json;
          experience?: string;
          id?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      merchants_customers: {
        Row: {
          created_at: string;
          customer_id: string;
          id: string;
          merchant_id: string;
        };
        Insert: {
          created_at?: string;
          customer_id: string;
          id?: string;
          merchant_id: string;
        };
        Update: {
          created_at?: string;
          customer_id?: string;
          id?: string;
          merchant_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'merchants_customers_customer_id_fkey';
            columns: ['customer_id'];
            isOneToOne: false;
            referencedRelation: 'customers';
            referencedColumns: ['id'];
          },
        ];
      };
      onboarding: {
        Row: {
          bank_details: string | null;
          business_addresses: string | null;
          business_details: string | null;
          created_at: string;
          documents: string | null;
          id: string;
          onboarded_at: string | null;
          personal_informations: string | null;
          stripe_product_id: string | null;
          user_id: string;
        };
        Insert: {
          bank_details?: string | null;
          business_addresses?: string | null;
          business_details?: string | null;
          created_at?: string;
          documents?: string | null;
          id?: string;
          onboarded_at?: string | null;
          personal_informations?: string | null;
          stripe_product_id?: string | null;
          user_id: string;
        };
        Update: {
          bank_details?: string | null;
          business_addresses?: string | null;
          business_details?: string | null;
          created_at?: string;
          documents?: string | null;
          id?: string;
          onboarded_at?: string | null;
          personal_informations?: string | null;
          stripe_product_id?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'onboarding_bank_details_fkey';
            columns: ['bank_details'];
            isOneToOne: false;
            referencedRelation: 'bank_details';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'onboarding_business_addresses_fkey';
            columns: ['business_addresses'];
            isOneToOne: false;
            referencedRelation: 'business_addresses';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'onboarding_business_details_fkey';
            columns: ['business_details'];
            isOneToOne: false;
            referencedRelation: 'business_details';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'onboarding_documents_fkey';
            columns: ['documents'];
            isOneToOne: false;
            referencedRelation: 'documents';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'onboarding_personal_informations_fkey';
            columns: ['personal_informations'];
            isOneToOne: false;
            referencedRelation: 'personal_informations';
            referencedColumns: ['id'];
          },
        ];
      };
      orders: {
        Row: {
          created_at: string;
          currency: string;
          id: string;
          installments_options: Json[];
          interval: string | null;
          period: number | null;
          price: string;
          product_id: string;
          quantity: number;
          status: Database['public']['Enums']['orderstatus'];
          stripe_cus_id: string;
          stripe_id: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          currency: string;
          id?: string;
          installments_options: Json[];
          interval?: string | null;
          period?: number | null;
          price: string;
          product_id: string;
          quantity: number;
          status?: Database['public']['Enums']['orderstatus'];
          stripe_cus_id: string;
          stripe_id?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string;
          currency?: string;
          id?: string;
          installments_options?: Json[];
          interval?: string | null;
          period?: number | null;
          price?: string;
          product_id?: string;
          quantity?: number;
          status?: Database['public']['Enums']['orderstatus'];
          stripe_cus_id?: string;
          stripe_id?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'orders_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'orders_stripe_cus_id_fkey';
            columns: ['stripe_cus_id'];
            isOneToOne: false;
            referencedRelation: 'customers';
            referencedColumns: ['stripe_id'];
          },
        ];
      };
      personal_informations: {
        Row: {
          created_at: string;
          email: string;
          first_name: string;
          id: string;
          last_name: string;
          phone: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          first_name: string;
          id?: string;
          last_name: string;
          phone: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          first_name?: string;
          id?: string;
          last_name?: string;
          phone?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      product_categories: {
        Row: {
          category: string;
          created_at: string;
          id: number;
        };
        Insert: {
          category: string;
          created_at?: string;
          id?: number;
        };
        Update: {
          category?: string;
          created_at?: string;
          id?: number;
        };
        Relationships: [];
      };
      products: {
        Row: {
          category: string | null;
          created_at: string;
          currency: string;
          id: string;
          price: string;
          product_name: string;
          remarks: string | null;
          status: string;
          stripe_id: string | null;
          user_id: string;
        };
        Insert: {
          category?: string | null;
          created_at?: string;
          currency: string;
          id?: string;
          price: string;
          product_name: string;
          remarks?: string | null;
          status?: string;
          stripe_id?: string | null;
          user_id: string;
        };
        Update: {
          category?: string | null;
          created_at?: string;
          currency?: string;
          id?: string;
          price?: string;
          product_name?: string;
          remarks?: string | null;
          status?: string;
          stripe_id?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      transactions: {
        Row: {
          amount: string | null;
          created_at: string;
          customer_id: string;
          customer_name: string;
          id: string;
          merchant_id: string;
          order_id: string;
          product_id: string;
          product_name: string;
          status: Database['public']['Enums']['transactionstatus'];
          stripe_id: string;
        };
        Insert: {
          amount?: string | null;
          created_at?: string;
          customer_id: string;
          customer_name: string;
          id?: string;
          merchant_id: string;
          order_id: string;
          product_id: string;
          product_name: string;
          status?: Database['public']['Enums']['transactionstatus'];
          stripe_id: string;
        };
        Update: {
          amount?: string | null;
          created_at?: string;
          customer_id?: string;
          customer_name?: string;
          id?: string;
          merchant_id?: string;
          order_id?: string;
          product_id?: string;
          product_name?: string;
          status?: Database['public']['Enums']['transactionstatus'];
          stripe_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'transactions_customer_id_fkey';
            columns: ['customer_id'];
            isOneToOne: false;
            referencedRelation: 'customers';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'transactions_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      gen_unique_id: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
    };
    Enums: {
      orderstatus: 'pending' | 'processing' | 'failed' | 'active' | 'canceled' | 'completed';
      transactionstatus: 'initiated' | 'failed' | 'completed';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    ? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends keyof PublicSchema['Enums'] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes'] | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
    ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;
