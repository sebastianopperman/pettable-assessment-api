import { getSupabaseClient } from "../lib/supabase.ts";
import {
  sendErrorResponse,
  sendSuccessResponse,
  sendValidationError,
  parseJsonRequest,
} from "../lib/response-utils.ts";
import { validateFields } from "../lib/validation-utils.ts";

export const createUtmVisit = async (req: Request): Promise<Response> => {
  try {
    const { data, error: parseError } = await parseJsonRequest(req);
    if (parseError) return parseError;

    const payload = data as Record<string, unknown>;
    const { utm_source, utm_medium, utm_campaign } = payload;

    const { isValid, errors } = validateFields([
      { value: utm_source, name: "utm_source", type: "string", required: true },
      { value: utm_medium, name: "utm_medium", type: "string", required: true },
      {
        value: utm_campaign,
        name: "utm_campaign",
        type: "string",
        required: true,
      },
    ]);

    if (!isValid) {
      return sendValidationError(`Validation failed: ${errors.join(", ")}`);
    }

    const { data: dbData, error } = await getSupabaseClient()
      .from("utm_visits")
      .insert([{ utm_source, utm_medium, utm_campaign }])
      .select("id")
      .single();

    if (error) {
      console.error("Supabase error:", error);
      // Handle Supabase error specifically
      return sendErrorResponse(error.message);
    }

    return sendSuccessResponse({ id: dbData.id });
  } catch (error) {
    console.error("Caught error:", error);
    return sendErrorResponse(
      error instanceof Error ? error.message : "An unexpected error occurred"
    );
  }
};
