export const createConversion = async (_req: Request): Promise<Response> => {
  return new Response(JSON.stringify({ message: "Created UTM Visit Record" }), {
    headers: { "Content-Type": "application/json" },
  });
};
