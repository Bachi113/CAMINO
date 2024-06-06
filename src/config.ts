import { TypeConfig } from './types/config';

// Supabase API credentials retrieved from environment variables for secure access.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const config = {
  // Boolean flag to determine if Supabase should be enabled based on the availability of necessary environment variables.
  isSupabaseEnabled: !!supabaseUrl && !!supabaseKey,

  // APP: Basic application settings used globally for branding and links.
  app: {
    name: 'BuilderKit',
    description: 'NextJS SaaS AI Boilerplate',
    url: 'https://base.builderkit.ai',
  },

  // SUPPORT: Contact email for application support, should be updated with an actual email address.
  supportEmail: '',

  // STRIPE: payment configuration similar in structure to Lemon Squeezy for processing payments.
  stripe: {
    // Base URL for Stripe checkout sessions.
    baseUrl: 'https://buy.stripe.com',
  },
};

export default config as TypeConfig;
