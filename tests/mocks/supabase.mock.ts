import { SupabaseClient } from "@supabase/supabase-js";

export const mockSupabaseClient = {
  from: (table: string) => ({
    insert: (data: unknown[]) => ({
      select: () => ({
        single: async () => {
          const record = data[0] as Record<string, unknown>;

          if (record.email === "duplicate@example.com") {
            return {
              data: null,
              error: {
                code: "23505",
                message:
                  'duplicate key value violates unique constraint "conversions_email_key"',
              },
            };
          }

          return {
            data: { id: 1 },
            error: null,
          };
        },
      }),
    }),
    select: (columns?: string) => ({
      eq: (column: string, value: unknown) => ({
        single: async () => {
          // For utm_visits table, return mock data
          if (table === "utm_visits" && column === "id" && value === 1) {
            return {
              data: { id: 1 },
              error: null,
            };
          }
          // For non-existent UTM visits, return null
          return {
            data: null,
            error: { message: "No UTM visit found" },
          };
        },
      }),
    }),
  }),
} as unknown as SupabaseClient;
