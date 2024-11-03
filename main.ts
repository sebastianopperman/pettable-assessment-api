import "@std/dotenv/load";

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

const handler = async (req: Request): Promise<Response> => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", Allow: "POST" },
    });
  }

  const routeHandler = functionHandlers.get(new URL(req.url).pathname);

  return routeHandler
    ? await routeHandler(req)
    : new Response(JSON.stringify({ error: "Not Found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
};

Deno.serve({ port: 3000 }, handler);
