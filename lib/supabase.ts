import { createClient, SupabaseClient } from "@supabase/supabase-js";

let clientOverride: SupabaseClient | null = null;

export const getSupabaseClient = () => {
  if (clientOverride) {
    return clientOverride;
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY");

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables");
  }

  return createClient(supabaseUrl, supabaseKey);
};

export const setTestClient = (client: SupabaseClient | null) => {
  clientOverride = client;
};
