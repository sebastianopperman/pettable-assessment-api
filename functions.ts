const createUtmVisit = async (_req: Request): Promise<Response> => {
  return new Response(JSON.stringify({ message: "Created UTM Visit Record" }), {
    headers: { "Content-Type": "application/json" },
  });
};

const createConversion = async (_req: Request): Promise<Response> => {
  return new Response(
    JSON.stringify({ message: "Created Conversion Record" }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
};

const handler = async (req: Request): Promise<Response> => {
  const url = new URL(req.url);

  if (req.method === "POST") {
    switch (url.pathname) {
      case "/utm-visit":
        return await createUtmVisit(req);
      case "/conversion":
        return await createConversion(req);
    }
  }

  return new Response(JSON.stringify({ error: "Not Found" }), {
    status: 404,
    headers: { "Content-Type": "application/json" },
  });
};

Deno.serve({ port: 8000 }, handler);
