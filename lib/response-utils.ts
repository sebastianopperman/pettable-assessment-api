type ErrorResponse = {
  error: string;
};

type SuccessResponse = {
  id: string;
};

export const sendErrorResponse = (
  error: unknown,
  status: number = 500
): Response => {
  const errorMessage = error instanceof Error ? error.message : String(error);

  return new Response(
    JSON.stringify({ error: errorMessage } satisfies ErrorResponse),
    {
      status,
      headers: { "Content-Type": "application/json" },
    }
  );
};

export const sendSuccessResponse = (
  data: SuccessResponse,
  status: number = 201
): Response => {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
};

export const sendValidationError = (message: string): Response => {
  return sendErrorResponse(message, 400);
};
