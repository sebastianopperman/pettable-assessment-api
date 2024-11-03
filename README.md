# Pettable Assessment API

[![Test Status](https://github.com/pettable/assessment-api/actions/workflows/test.yml/badge.svg)](https://github.com/pettable/assessment-api/actions)
[![Deno Version](https://img.shields.io/badge/deno-v2.0.4-green.svg)](https://deno.land)

This is a simple, lightweight REST API app that handles functions which integrates post data to the database. This keeps sensitive data out of Webflow which exposes them in the user's browser.

## Running the Application

### Environment Setup

```bash
# Copy the environment template
cp .env.example .env

# Configure your Supabase credentials in .env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

### Local Development

```bash
deno run --allow-net --allow-read --allow-env main.ts
```

### Docker

```bash
docker build -t pettable-assessment-api .
docker run -p 3000:3000 pettable-assessment-api
```

## Running Tests

### Local Testing

```bash
deno test --allow-net --allow-read --allow-env
```

### Docker Testing

```bash
docker build -f Dockerfile.test -t pettable-assessment-api-test .
docker run pettable-assessment-api-test
```

Tests are located in the `tests/` directory and use mock Supabase responses for reliable testing.

## Creating Functions

The API automatically converts files in the `functions/` directory into endpoints. To create a new endpoint:

1. Create a new TypeScript file in the `functions/` directory
2. Export a default async function that handles POST requests:

```typescript
export default async function (req: Request): Promise<Response> {
  return new Response(JSON.stringify({ status: "success" }), {
    headers: { "Content-Type": "application/json" },
  });
}
```

### Important Notes

- All endpoints **only** accept POST requests
- Function filenames are converted to kebab-case routes (e.g., `myFunction.ts` → `/my-function`)
- Non-POST requests will receive a 405 Method Not Allowed response
