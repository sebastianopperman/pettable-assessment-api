import { assertEquals } from "jsr:@std/assert";
import { createUtmVisit } from "../functions/utm-visit.ts";
import {
  createTestRequest,
  setupTest,
  cleanupTest,
} from "../lib/test-helpers.ts";

Deno.test({
  name: "UTM Visit Tests",
  fn: async (t) => {
    setupTest();

    await t.step("successful creation", async () => {
      const response = await createUtmVisit(
        createTestRequest("utm-visit", {
          utm_source: "google",
          utm_medium: "cpc",
          utm_campaign: "summer_sale",
        })
      );
      const data = await response.json();

      assertEquals(response.status, 201);
      assertEquals(typeof data.id, "number");
    });

    await t.step("missing required fields", async () => {
      const response = await createUtmVisit(
        createTestRequest("utm-visit", {
          utm_source: "google",
        })
      );
      const data = await response.json();

      assertEquals(response.status, 400);
      assertEquals(data.error, "Validation failed: utm_medium, utm_campaign");
    });

    await t.step("invalid JSON", async () => {
      const response = await createUtmVisit(
        createTestRequest("utm-visit", "invalid json")
      );
      const data = await response.json();

      assertEquals(response.status, 400);
      assertEquals(data.error, "Invalid JSON format");
    });

    cleanupTest();
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
