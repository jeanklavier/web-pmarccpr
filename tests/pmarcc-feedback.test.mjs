import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import handler, { config } from "../netlify/functions/pmarcc-feedback.mts";

const originalFetch = globalThis.fetch;

function feedbackForm(overrides = {}) {
  const values = {
    _source: "pmarcc",
    tipo_negocio: "Corrección P-MARCC",
    producto: "P-MARCC - Energía (sectores/energia.html)",
    mensaje: "El porcentaje mostrado parece estar desactualizado.",
    nombre: "",
    correo: "",
    _gotcha: "",
    _form_started_at: String(Date.now() - 5000),
    _feedback_version: "2",
    _page_url: "https://planclimaticopr.com/sectores/energia.html",
    ...overrides,
  };
  const form = new FormData();
  for (const [key, value] of Object.entries(values)) form.set(key, value);
  return form;
}

function request(form, origin = "https://planclimaticopr.com") {
  return new Request("https://planclimaticopr.com/api/feedback", {
    method: "POST",
    headers: { Origin: origin },
    body: form,
  });
}

test.afterEach(() => {
  globalThis.fetch = originalFetch;
});

test("the browser form validates locally and uses only the same-site endpoint", async () => {
  const source = await readFile(new URL("../correction.js", import.meta.url), "utf8");
  assert.match(source, /var FEEDBACK_URL = '\/api\/feedback'/);
  assert.match(source, /form\.checkValidity\(\)/);
  assert.match(source, /if \(submitting \|\| submittedSuccessfully\) return/);
  assert.doesNotMatch(source, /supabase\.co\/functions\/v1\/form-submit/);
});

test("defines a same-site endpoint with per-IP rate limiting", () => {
  assert.equal(config.path, "/api/feedback");
  assert.deepEqual(config.rateLimit.aggregateBy, ["ip", "domain"]);
  assert.equal(config.rateLimit.windowLimit, 5);
});

test("forwards complete anonymous feedback with the sentinel email", async () => {
  let forwarded;
  globalThis.fetch = async (_url, options) => {
    forwarded = options;
    return Response.json({ success: true, lead_id: "lead-1" });
  };

  const response = await handler(request(feedbackForm()), {});
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { success: true, lead_id: "lead-1" });
  assert.equal(forwarded.headers.Origin, "https://planclimaticopr.com");
  assert.equal(forwarded.body.get("correo"), "anonimo@pmarcc-reporte.info");
  assert.match(forwarded.body.get("mensaje"), /desactualizado/);
  assert.equal(forwarded.body.has("_form_started_at"), false);
});

test("rejects empty and one-token messages without contacting the upstream", async () => {
  let calls = 0;
  globalThis.fetch = async () => {
    calls += 1;
    return Response.json({ success: true });
  };

  const empty = await handler(request(feedbackForm({ mensaje: "" })), {});
  const gibberish = await handler(request(feedbackForm({ mensaje: "TdwjuQwkbkvHQPyn" })), {});
  assert.equal(empty.status, 400);
  assert.equal(gibberish.status, 400);
  assert.equal(calls, 0);
});

test("silently discards honeypot and implausibly fast submissions", async () => {
  let calls = 0;
  globalThis.fetch = async () => {
    calls += 1;
    return Response.json({ success: true });
  };

  const honeypot = await handler(request(feedbackForm({ _gotcha: "spam" })), {});
  const tooFast = await handler(request(feedbackForm({ _form_started_at: String(Date.now()) })), {});
  assert.equal(honeypot.status, 200);
  assert.equal(tooFast.status, 200);
  assert.equal(calls, 0);
});

test("rejects cross-site browser submissions", async () => {
  const response = await handler(request(feedbackForm(), "https://example.com"), {});
  assert.equal(response.status, 403);
});
