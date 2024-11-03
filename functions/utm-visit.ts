import { getSupabaseClient } from "../lib/supabase.ts";

export const createUtmVisit = async (req: Request): Promise<Response> => {
  try {
    const supabase = getSupabaseClient();

    const body = await req.json();
    const { utm_source, utm_medium, utm_campaign } = body;

    if (!utm_source || !utm_medium || !utm_campaign) {
      return new Response(
        JSON.stringify({
          error: "utm_source, utm_medium, and utm_campaign are required",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { data, error } = await supabase
      .from("utm_visits")
      .insert([
        {
          utm_source,
          utm_medium,
          utm_campaign,
        },
      ])
      .select("id")
      .single();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ id: data.id }), {
      status: 201,
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
