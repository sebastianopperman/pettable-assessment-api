import { getSupabaseClient } from "../lib/supabase.ts";

export const createConversion = async (req: Request): Promise<Response> => {
  try {
    const { name, email, product, utm_id } = await req.json();

    if (!name || !email || !product) {
      return new Response(
        JSON.stringify({
          error: "name, email, and product are required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const supabase = getSupabaseClient();
    console.log("Attempting to insert conversion...");

    const { data, error } = await supabase
      .from("conversions")
      .insert([
        {
          name,
          email,
          product,
          ...(utm_id && { utm_visit_id: utm_id }),
        },
      ])
      .select("id")
      .single();

    if (error) {
      console.error("Supabase error:", error);
      if (
        error.code === "23505" &&
        error.message.includes("conversions_email_key")
      ) {
        return new Response(
          JSON.stringify({
            error: "A conversion with this email already exists",
          }),
          { status: 409, headers: { "Content-Type": "application/json" } }
        );
      }
      throw error;
    }

    return new Response(JSON.stringify({ id: data.id }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Caught error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : String(error),
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
