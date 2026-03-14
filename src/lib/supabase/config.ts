function requirePublicEnv(name: "NEXT_PUBLIC_SUPABASE_URL" | "NEXT_PUBLIC_SUPABASE_ANON_KEY") {
  const value = process.env[name];
  return value;
}

export function getSupabasePublicConfig() {
  // Fallbacks keep production running even if Vercel env injection is misconfigured.
  // These are public Supabase values (anon key), safe for browser usage.
  const fallbackUrl = "https://claqygbhywfnijdjtexv.supabase.co";
  const fallbackAnonKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsYXF5Z2JoeXdmbmlqZGp0ZXh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0NTE4MDQsImV4cCI6MjA4OTAyNzgwNH0.UsUBboRF1me5XWXvJnYjY9-EQ8hkjN8OOeJtayqvfdk";

  const url = requirePublicEnv("NEXT_PUBLIC_SUPABASE_URL") ?? fallbackUrl;
  const anonKey = requirePublicEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY") ?? fallbackAnonKey;

  if (!url || !anonKey) {
    throw new Error("Supabase public configuration is missing.");
  }

  return {
    url,
    anonKey,
  };
}
