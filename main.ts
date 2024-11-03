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
        .replace(/([A-Z])/g, (match) => match.toLowerCase())
        .replace(/-/g, "-");
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
  const url = new URL(req.url);

  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": ALLOWED_ORIGIN || "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "86400",
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

  try {
    const routeHandler = functionHandlers.get(url.pathname);

    if (!routeHandler) {
      const response = new Response(JSON.stringify({ error: "Not Found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
      return setCorsHeaders(response, origin || "*");
    }

    const response = await routeHandler(req);
    return setCorsHeaders(response, origin || "*");
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error(`Error processing request to ${url.pathname}:`, error);
    const response = new Response(
      JSON.stringify({
        error: "Internal Server Error",
        message: errorMessage,
        path: url.pathname,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
    return setCorsHeaders(response, origin || "*");
  }
};

Deno.serve({ port: 3000 }, handler);
