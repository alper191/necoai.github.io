import { createHash, createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { getStore } from "@netlify/blobs";

// Kisisel kullanim icin gomulu sifre; ortam degiskeni varsa o onceliklidir
const BUILTIN_PASSWORD = "neco1234";
// Token imzasi icin gomulu gizli anahtar; chat.js ile AYNI olmali
const BUILTIN_SECRET = "12c655983acf0db7d4d58c2e696e7ad21feb1596b8f673e535bd054a2eada92a";

const USERS_KEY = "users";
const MIN_PASSWORD = 6;
const MAX_EMAIL = 254;
const MAX_PASSWORD = 128;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, x-neco-token",
};

function json(status, data) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...CORS_HEADERS },
  });
}

function matches(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function hashPassword(password, salt) {
  return scryptSync(password, salt, 64).toString("hex");
}

function makeToken(email, secret) {
  const sig = createHmac("sha256", secret).update(email.toLowerCase()).digest("hex");
  return `${Buffer.from(email, "utf8").toString("base64url")}.${sig}`;
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
  if (!email || email.length > MAX_EMAIL) return false;
  const expected = createHmac("sha256", secret).update(email.toLowerCase()).digest("hex");
  return matches(token.slice(dot + 1), expected);
}

// Ayni instance icinde blob okuma-yazmayi siralar (kayip guncelleme riskini azaltir)
let queue = Promise.resolve();
function withLock(fn) {
  const run = queue.then(fn, fn);
  queue = run.then(() => {}, () => {});
  return run;
}

async function readUsers(store) {
  const raw = await store.get(USERS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeUsers(store, users) {
  await store.set(USERS_KEY, JSON.stringify(users));
}

function toTxt(users) {
  const lines = ["NECO.AI - Kayitli Kullanicilar", `Toplam: ${users.length}`, "----------------------------------------"];
  users.forEach((u, i) => {
    const d = u.created_at ? new Date(u.created_at).toLocaleString("tr-TR") : "-";
    lines.push(`${i + 1}. ${u.email}  (${d})`);
  });
  return lines.join("\n");
}

export default async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }
  if (req.method !== "POST") {
    return json(405, { error: "method_not_allowed" });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return json(400, { error: "invalid_json" });
  }

  const appPassword =
    (globalThis.Netlify && Netlify.env.get("NECO_PASSWORD")) ||
    process.env.NECO_PASSWORD ||
    BUILTIN_PASSWORD;
  const secret =
    (globalThis.Netlify && Netlify.env.get("NECO_SECRET")) ||
    process.env.NECO_SECRET ||
    BUILTIN_SECRET;

  const action = typeof body.action === "string" ? body.action : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (action === "register") {
    if (!EMAIL_RE.test(email) || email.length > MAX_EMAIL) {
      return json(400, { error: "invalid_email" });
    }
    if (password.length < MIN_PASSWORD || password.length > MAX_PASSWORD) {
      return json(400, { error: "weak_password" });
    }
    try {
      return await withLock(async () => {
        const store = getStore("neco-users");
        const users = await readUsers(store);
        if (users.some((u) => u.email === email)) {
          return json(409, { error: "email_exists" });
        }
        const salt = randomBytes(16).toString("hex");
        users.push({
          email,
          salt,
          hash: hashPassword(password, salt),
          created_at: Date.now(),
        });
        await writeUsers(store, users);
        return json(200, { ok: true, token: makeToken(email, secret), email });
      });
    } catch {
      return json(500, { error: "storage_unavailable" });
    }
  }

  if (action === "login") {
    if (!email) {
      return json(400, { error: "invalid_email" });
    }
    try {
      return await withLock(async () => {
        const store = getStore("neco-users");
        const users = await readUsers(store);
        const user = users.find((u) => u.email === email);
        if (!user) return json(401, { error: "invalid_credentials" });
        const candidate = hashPassword(password, user.salt);
        const ok = matches(candidate, user.hash);
        if (!ok) return json(401, { error: "invalid_credentials" });
        return json(200, { ok: true, token: makeToken(email, secret), email });
      });
    } catch {
      return json(500, { error: "storage_unavailable" });
    }
  }

  if (action === "admin") {
    const token = (req.headers.get("x-neco-token") || "").trim();
    const isAdmin =
      matches(password, appPassword) || isValidToken(token, secret);
    if (!isAdmin) {
      return json(401, { error: "wrong_password" });
    }
    try {
      const store = getStore("neco-users");
      const users = await readUsers(store);
      const list = users.map((u) => ({ email: u.email, created_at: u.created_at }));
      return json(200, { ok: true, count: list.length, users: list, txt: toTxt(users) });
    } catch {
      return json(500, { error: "storage_unavailable" });
    }
  }

  return json(400, { error: "unknown_action" });
};
