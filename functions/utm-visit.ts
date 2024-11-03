import { getSupabaseClient } from "../lib/supabase.ts";

export const createUtmVisit = async (_req: Request): Promise<Response> => {
  try {
    const supabase = getSupabaseClient();

    const { data: utmVisits, error } = await supabase
      .from("utm_visits")
      .select("*");

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(utmVisits), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
