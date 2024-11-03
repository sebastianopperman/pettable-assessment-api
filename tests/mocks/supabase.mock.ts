import { SupabaseClient } from "@supabase/supabase-js";

export const mockSupabaseClient = {
  from: (_table: string) => ({
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
  }),
} as unknown as SupabaseClient;
