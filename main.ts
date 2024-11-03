import "@std/dotenv/load";

const ALLOWED_ORIGIN = Deno.env.get("ALLOWED_ORIGIN");

const functionHandlers = new Map<string, (req: Request) => Promise<Response>>();

for await (const { name, isFile } of Deno.readDir("./functions")) {
  if (isFile && name.endsWith(".ts")) {
    const module = await import(`./functions/${name}`);
    const route =
      "/" +
      name
        .replace(/\.ts$/, "")
        .replace(/([A-Z])/g, "-$1")
        .toLowerCase();
    functionHandlers.set(route, module[Object.keys(module)[0]]);
  }
}

const setCorsHeaders = (response: Response, origin: string): Response => {
  const headers = new Headers(response.headers);
  headers.set("Access-Control-Allow-Origin", origin);
  headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type");

  return new Response(response.body, {
    status: response.status,
    headers,
  });
};

const handler = async (req: Request): Promise<Response> => {
  const origin = req.headers.get("Origin");

  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": ALLOWED_ORIGIN || "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  if (req.method !== "POST") {
    const response = new Response(
      JSON.stringify({ error: "Method Not Allowed" }),
      {
        status: 405,
        headers: { "Content-Type": "application/json", Allow: "POST" },
      }
    );
    return setCorsHeaders(response, origin || "*");
  }

  if (ALLOWED_ORIGIN && origin !== ALLOWED_ORIGIN) {
    const response = new Response(JSON.stringify({ error: "Invalid Origin" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
    return setCorsHeaders(response, origin || "*");
  }

  const routeHandler = functionHandlers.get(new URL(req.url).pathname);

  const response = routeHandler
    ? await routeHandler(req)
    : new Response(JSON.stringify({ error: "Not Found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });

  return setCorsHeaders(response, origin || "*");
};

Deno.serve({ port: 3000 }, handler);
