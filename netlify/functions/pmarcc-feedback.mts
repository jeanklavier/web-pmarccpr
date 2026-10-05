import type { Config, Context } from "@netlify/functions";

const UPSTREAM_URL =
  "https://eexzkkypfkpscewufgrg.supabase.co/functions/v1/form-submit";
const ANONYMOUS_EMAIL = "anonimo@pmarcc-reporte.info";
const MIN_FILL_TIME_MS = 1500;
const MAX_FILL_TIME_MS = 60 * 60 * 1000;

function json(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function value(form: FormData, name: string): string {
  const raw = form.get(name);
  return typeof raw === "string" ? raw.trim() : "";
}

function isValidEmail(email: string): boolean {
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function wordCount(text: string): number {
  return text.match(/[A-Za-zÀ-ÖØ-öø-ÿ0-9%]+/g)?.length ?? 0;
}

function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

export default async function handler(
  request: Request,
  _context: Context,
): Promise<Response> {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }
  if (!isSameOrigin(request)) {
    return json({ error: "Origin not allowed" }, 403);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ error: "Invalid form data" }, 400);
  }

  // Bots often fill this hidden field. Return a fake success so they do not adapt.
  if (value(form, "_gotcha")) return json({ success: true });

  const startedAt = Number(value(form, "_form_started_at"));
  const elapsed = Date.now() - startedAt;
  if (!Number.isFinite(startedAt) || elapsed < MIN_FILL_TIME_MS || elapsed > MAX_FILL_TIME_MS) {
    return json({ success: true });
  }

  const source = value(form, "_source");
  const type = value(form, "tipo_negocio");
  const product = value(form, "producto");
  const message = value(form, "mensaje");
  const name = value(form, "nombre");
  const email = value(form, "correo").toLowerCase();

  if (source !== "pmarcc") return json({ error: "Invalid source" }, 400);
  if (type !== "Corrección P-MARCC" && type !== "Sugerencia P-MARCC") {
    return json({ error: "Invalid feedback type" }, 400);
  }
  if (product.length < 3 || product.length > 300) {
    return json({ error: "Indica la página, sección o dato relacionado." }, 400);
  }
  if (message.length < 12 || message.length > 4000 || wordCount(message) < 2) {
    return json({ error: "Describe el error o la sugerencia con al menos dos palabras." }, 400);
  }
  if (name.length > 120) return json({ error: "El nombre es demasiado largo." }, 400);
  if (email && !isValidEmail(email)) return json({ error: "Correo electrónico inválido." }, 400);

  form.set("producto", product);
  form.set("mensaje", message);
  form.set("nombre", name);
  form.set("correo", email || ANONYMOUS_EMAIL);
  form.delete("_form_started_at");
  form.delete("_feedback_version");
  form.delete("_page_url");

  try {
    const upstream = await fetch(UPSTREAM_URL, {
      method: "POST",
      headers: {
        Origin: "https://planclimaticopr.com",
        Referer: "https://planclimaticopr.com/",
      },
      body: form,
    });
    const result = await upstream.json().catch(() => null) as Record<string, unknown> | null;
    if (!upstream.ok || !result) {
      console.error("P-MARCC feedback upstream failure", upstream.status);
      return json({ error: "No se pudo enviar" }, 502);
    }
    return json(result, upstream.status);
  } catch (error) {
    console.error("P-MARCC feedback request failed", error);
    return json({ error: "No se pudo enviar" }, 502);
  }
}

export const config: Config = {
  path: "/api/feedback",
  method: ["POST"],
  rateLimit: {
    windowLimit: 5,
    windowSize: 60,
    aggregateBy: ["ip", "domain"],
  },
};
