export type TypeConfig = {
  isSupabaseEnabled: boolean;
  app: {
    name: string;
    description: string;
    url: string;
  };
  supportEmail: string;
  stripe: {
    baseUrl: string;
  };
};
