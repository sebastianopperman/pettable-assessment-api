import { assertEquals } from "jsr:@std/assert";
import { createConversion } from "../functions/conversion.ts";
import {
  createTestRequest,
  setupTest,
  cleanupTest,
} from "../lib/test-helpers.ts";

Deno.test({
  name: "Conversion Tests",
  fn: async (t) => {
    setupTest();

    await t.step("successful creation", async () => {
      const response = await createConversion(
        createTestRequest("conversion", {
          name: "John Doe",
          email: `test_${Date.now()}@example.com`,
          product: "premium_plan",
        })
      );
      const data = await response.json();

      assertEquals(response.status, 201);
      assertEquals(typeof data.id, "number");
    });

    await t.step("with UTM ID", async () => {
      const response = await createConversion(
        createTestRequest("conversion", {
          name: "Jane Doe",
          email: `test_${Date.now()}@example.com`,
          product: "basic_plan",
          utm_id: 1,
        })
      );
      const data = await response.json();

      assertEquals(response.status, 201);
      assertEquals(typeof data.id, "number");
    });

    await t.step("missing required fields", async () => {
      const response = await createConversion(
        createTestRequest("conversion", {
          name: "John Doe",
        })
      );
      const data = await response.json();

      assertEquals(response.status, 400);
      assertEquals(data.error, "Validation failed: email, product");
    });

    await t.step("invalid JSON", async () => {
      const response = await createConversion(
        createTestRequest("conversion", "invalid json")
      );
      const data = await response.json();

      assertEquals(response.status, 400);
      assertEquals(data.error, "Invalid JSON format");
    });

    await t.step("duplicate email", async () => {
      const email = "duplicate@example.com";

      await createConversion(
        createTestRequest("conversion", {
          name: "John Doe",
          email,
          product: "premium_plan",
        })
      );

      const response = await createConversion(
        createTestRequest("conversion", {
          name: "Jane Doe",
          email,
          product: "basic_plan",
        })
      );
      const data = await response.json();

      assertEquals(response.status, 409);
      assertEquals(data.error, "A conversion with this email already exists");
    });

    cleanupTest();
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
