export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      bank_details: {
        Row: {
          account_number: string;
          bank_name: string;
          created_at: string;
          iban_code: string | null;
          id: string;
          purchasing_currency: string;
          sort_code: string;
          swift_code: string | null;
          user_id: string;
        };
        Insert: {
          account_number: string;
          bank_name: string;
          created_at?: string;
          iban_code?: string | null;
          id?: string;
          purchasing_currency: string;
          sort_code: string;
          swift_code?: string | null;
          user_id: string;
        };
        Update: {
          account_number?: string;
          bank_name?: string;
          created_at?: string;
          iban_code?: string | null;
          id?: string;
          purchasing_currency?: string;
          sort_code?: string;
          swift_code?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'bank_details_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
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
        Relationships: [
          {
            foreignKeyName: 'business_addresses_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
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
        Relationships: [
          {
            foreignKeyName: 'business_details_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      customers: {
        Row: {
          address: string | null;
          created_at: string;
          customer_name: string | null;
          email: string;
          id: string;
          phone: string | null;
          stripe_id: string | null;
          user_id: string | null;
        };
        Insert: {
          address?: string | null;
          created_at?: string;
          customer_name?: string | null;
          email: string;
          id?: string;
          phone?: string | null;
          stripe_id?: string | null;
          user_id?: string | null;
        };
        Update: {
          address?: string | null;
          created_at?: string;
          customer_name?: string | null;
          email?: string;
          id?: string;
          phone?: string | null;
          stripe_id?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'customers_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
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
        Relationships: [
          {
            foreignKeyName: 'documents_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
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
          {
            foreignKeyName: 'merchants_customers_merchant_id_fkey';
            columns: ['merchant_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      onboarding: {
        Row: {
          bank_details: string | null;
          business_addresses: string | null;
          business_details: string | null;
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
          {
            foreignKeyName: 'onboarding_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      orders: {
        Row: {
          created_at: string;
          currency: string;
          id: string;
          installments_options: number[];
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
          installments_options: number[];
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
          installments_options?: number[];
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
          {
            foreignKeyName: 'orders_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
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
        Relationships: [
          {
            foreignKeyName: 'personal_informations_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
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
        Relationships: [
          {
            foreignKeyName: 'products_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
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
