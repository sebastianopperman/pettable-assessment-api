import { mockSupabaseClient } from "../tests/mocks/supabase.mock.ts";
import { setTestClient } from "./supabase.ts";

export const createTestRequest = (path: string, body: unknown) => {
  return new Request(`http://localhost:3000/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
};

export const setupTest = () => setTestClient(mockSupabaseClient);
export const cleanupTest = () => setTestClient(null);
