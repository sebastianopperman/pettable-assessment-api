import { getSupabaseClient } from "../lib/supabase.ts";
import {
  sendErrorResponse,
  sendSuccessResponse,
  sendValidationError,
} from "../lib/response-utils.ts";

export const createUtmVisit = async (req: Request): Promise<Response> => {
  try {
    const { utm_source, utm_medium, utm_campaign } = await req.json();

    if (!utm_source || !utm_medium || !utm_campaign) {
      return sendValidationError(
        "utm_source, utm_medium, and utm_campaign are required"
      );
    }

    const { data, error } = await getSupabaseClient()
      .from("utm_visits")
      .insert([{ utm_source, utm_medium, utm_campaign }])
      .select("id")
      .single();

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    return sendSuccessResponse({ id: data.id });
  } catch (error) {
    console.error("Caught error:", error);
    return sendErrorResponse(error);
  }
};
