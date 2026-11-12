import { createHmac } from "node:crypto";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = "qwen/qwen3.8-27b";
const DEFAULT_MAX_TOKENS = 900;
const MAX_MESSAGES = 40;
const MAX_CONTENT_LENGTH = 32000;
// Kisisel kullanim icin gomulu anahtar; ortam degiskeni varsa o onceliklidir
const BUILTIN_API_KEY = "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";
// Token imzasi icin gomulu gizli anahtar; auth.js ile AYNI olmali
const BUILTIN_SECRET = "12c655983acf0db7d4d58c2e696e7ad21feb1596b8f673e535bd054a2eada92a";

const SYSTEM_PROMPT =
  "Senin adın NECO.AI. Türkçe konuş, kullanıcı başka dil kullanırsa o dilde yanıt ver. " +
  "Yardımcı, doğal, samimi ve bilgili ol. Kendini NECO.AI olarak tanıt. " +
  "İstendiğinde HTML/CSS/JavaScript ile tam web sayfası yazabilirsin; web sayfası " +
  "kodunu eksiksiz (DOCTYPE dahil) tek bir ```html kod bloğu içinde ver. " +
  "Diğer programlama dillerinde de yardımcı ol. " +
  "Bilmediğin konularda uydurma bilgi verme.";

// Internet aramasi: Groq'un yerlesik tarayici arama aracini destekleyen model
// (varsayilan qwen modeli browser_search desteklemiyor)
const SEARCH_MODEL = "openai/gpt-oss-20b";
const SEARCH_KEYWORDS = [
  "araştır", "arastir", "internette", "internetten", "webde", "web'de",
  "güncel", "guncel", "bugün", "bugun", "haber", "hava durumu", "hava nasıl",
  "hava nasil", "fiyat", "dolar", "euro", "borsa", "altın", "altin",
  "skor", "maç sonucu", "mac sonucu", "deprem", "trafik", "son dakika",
  "saat kaç", "saat kac", "ne zaman", "kimdir", "canlı", "canli",
  "kaç para", "kac para", "ne oldu", "son durum", "nedir",
  "weather", "news", "price", "search",
];

function wantsSearch(text) {
  if (typeof text !== "string") return false;
  const t = text.toLowerCase();
  if (t.includes("?")) return true;
  return SEARCH_KEYWORDS.some((k) => t.includes(k));
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, x-neco-token",
};

function matches(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function isValidToken(token, secret) {
  if (typeof token !== "string" || token.length > 600) return false;
  const dot = token.indexOf(".");
  if (dot <= 0 || dot === token.length - 1) return false;
  let email;
  try {
    email = Buffer.from(token.slice(0, dot), "base64url").toString("utf8");
  } catch {
    return false;
  }
  if (!email || email.length > 254) return false;
  const expected = createHmac("sha256", secret).update(email.toLowerCase()).digest("hex");
  return matches(token.slice(dot + 1), expected);
}

function json(status, data) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...CORS_HEADERS,
    },
  });
}

export default async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }
  if (req.method !== "POST") {
    return json(405, { error: "method_not_allowed" });
  }

  const secret =
    (globalThis.Netlify && Netlify.env.get("NECO_SECRET")) ||
    process.env.NECO_SECRET ||
    BUILTIN_SECRET;
  const providedToken = (req.headers.get("x-neco-token") || "").trim();
  if (providedToken && !isValidToken(providedToken, secret)) {
    return json(401, { error: "auth_required" });
  }

  const apiKey =
    (globalThis.Netlify && Netlify.env.get("GROQ_API_KEY")) ||
    process.env.GROQ_API_KEY ||
    BUILTIN_API_KEY;
  if (!apiKey) {
    return json(500, { error: "missing_api_key" });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return json(400, { error: "invalid_json" });
  }

  const rawMessages = Array.isArray(body && body.messages) ? body.messages : [];
  const messages = [];
  for (const m of rawMessages.slice(-MAX_MESSAGES)) {
    if (!m || typeof m !== "object") continue;
    const role = m.role === "assistant" || m.role === "user" ? m.role : null;
    if (!role || typeof m.content !== "string") continue;
    messages.push({ role, content: m.content.slice(0, MAX_CONTENT_LENGTH) });
  }
  if (messages.length === 0) {
    return json(400, { error: "missing_messages" });
  }

  const stream = body.stream === true;
  const model =
    (globalThis.Netlify && Netlify.env.get("GROQ_MODEL")) ||
    process.env.GROQ_MODEL ||
    DEFAULT_MODEL;
  const requestedTokens = Number(body.max_tokens);
  const maxTokens = Math.min(
    Number.isFinite(requestedTokens) && requestedTokens > 0
      ? Math.floor(requestedTokens)
      : DEFAULT_MAX_TOKENS,
    4096
  );

  let lastUserMsg = "";
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "user") { lastUserMsg = messages[i].content; break; }
  }
  const searchOn = wantsSearch(lastUserMsg);

  const payload = {
    model: searchOn ? SEARCH_MODEL : model,
    messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
    temperature: 0.7,
    max_tokens: maxTokens,
    stream,
  };
  if (searchOn) {
    payload.tool_choice = "required";
    payload.tools = [{ type: "browser_search" }];
  }

  const sendUpstream = async (p) => {
    try {
      return await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(p),
      });
    } catch {
      return null;
    }
  };

  let upstream = await sendUpstream(payload);
  if (searchOn && (!upstream || !upstream.ok)) {
    // Arama modeli kullanilamadiysa normal modelle devam et
    upstream = await sendUpstream({ ...payload, model, tool_choice: undefined, tools: undefined });
  }
  if (!upstream) {
    return json(502, { error: "upstream_unreachable" });
  }

  if (!upstream.ok) {
    let detail = "";
    try {
      const text = await upstream.text();
      const parsed = JSON.parse(text);
      detail = (parsed && parsed.error && parsed.error.message) || "";
    } catch {}
    if (upstream.status === 429) {
      return json(429, { error: "rate_limited" });
    }
    return json(upstream.status, {
      error: "upstream_error",
      detail: String(detail).slice(0, 300),
    });
  }

  if (stream) {
    return new Response(upstream.body, {
      status: 200,
      headers: {
        ...CORS_HEADERS,
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "X-Accel-Buffering": "no",
      },
    });
  }

  const data = await upstream.json();
  return json(200, data);
};
