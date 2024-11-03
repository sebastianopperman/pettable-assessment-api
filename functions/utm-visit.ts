import { getSupabaseClient } from "../lib/supabase.ts";

export const createUtmVisit = async (req: Request): Promise<Response> => {
  try {
    const { utm_source, utm_medium, utm_campaign } = await req.json();

    if (!utm_source || !utm_medium || !utm_campaign) {
      return new Response(
        JSON.stringify({
          error: "utm_source, utm_medium, and utm_campaign are required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { data, error } = await getSupabaseClient()
      .from("utm_visits")
      .insert([{ utm_source, utm_medium, utm_campaign }])
      .select("id")
      .single();

    if (error) throw error;

    return new Response(JSON.stringify({ id: data.id }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
