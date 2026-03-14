export const env = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
};

export const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
export const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
