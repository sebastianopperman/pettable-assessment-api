import "@std/dotenv/load";
import { createConversion } from "./functions/conversion.ts";
import { createUtmVisit } from "./functions/utm-visit.ts";

const handler = async (req: Request): Promise<Response> => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", Allow: "POST" },
    });
  }

  const pathname = new URL(req.url).pathname;

  switch (pathname) {
    case "/utm-visit":
      return await createUtmVisit(req);
    case "/conversion":
      return await createConversion(req);
    default:
      return new Response(JSON.stringify({ error: "Not Found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
  }
};

Deno.serve({ port: 3000 }, handler);
