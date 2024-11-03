import { getSupabaseClient } from "../lib/supabase.ts";
import {
  sendErrorResponse,
  sendSuccessResponse,
  sendValidationError,
  parseJsonRequest,
} from "../lib/response-utils.ts";
import { validateFields } from "../lib/validation-utils.ts";

export const createConversion = async (req: Request): Promise<Response> => {
  try {
    const { data, error: parseError } = await parseJsonRequest(req);
    if (parseError) return parseError;

    const payload = data as Record<string, unknown>;
    const { name, email, product, utm_id } = payload;

    const { isValid, errors } = validateFields([
      { value: name, name: "name", type: "string", required: true },
      { value: email, name: "email", type: "string", required: true },
      { value: product, name: "product", type: "string", required: true },
      { value: utm_id, name: "utm_id", type: "integer", required: false },
    ]);

    if (!isValid) {
      return sendValidationError(`Validation failed: ${errors.join(", ")}`);
    }

    const supabase = getSupabaseClient();

    if (utm_id) {
      const { data: utmData, error: utmError } = await supabase
        .from("utm_visits")
        .select("id")
        .eq("id", utm_id)
        .single();

      if (utmError || !utmData) {
        return sendErrorResponse(`No UTM visit found with ID: ${utm_id}`, 400);
      }
    }

    const { data: dbData, error } = await supabase
      .from("conversions")
      .insert([
        {
          name,
          email,
          product,
          ...(utm_id ? { utm_id } : {}),
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
