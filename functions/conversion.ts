import { getSupabaseClient } from "../lib/supabase.ts";
import {
  sendErrorResponse,
  sendSuccessResponse,
  sendValidationError,
} from "../lib/response-utils.ts";

export const createConversion = async (req: Request): Promise<Response> => {
  try {
    const { name, email, product, utm_id } = await req.json();

    if (!name || !email || !product) {
      return sendValidationError("name, email, and product are required");
    }

    const supabase = getSupabaseClient();

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
        return sendErrorResponse(
          "A conversion with this email already exists",
          409
        );
      }
      throw error;
    }

    return sendSuccessResponse({ id: data.id });
  } catch (error) {
    console.error("Caught error:", error);
    return sendErrorResponse(error);
  }
};
