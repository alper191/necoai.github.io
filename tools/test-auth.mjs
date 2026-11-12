import auth from "../netlify/functions/auth.js";
import chat from "../netlify/functions/chat.js";
import { createHmac } from "node:crypto";

const SECRET = "12c655983acf0db7d4d58c2e696e7ad21feb1596b8f673e535bd054a2eada92a";
const BASE = "https://test.local";

function makeToken(email) {
  const sig = createHmac("sha256", SECRET).update(email.toLowerCase()).digest("hex");
  return `${Buffer.from(email, "utf8").toString("base64url")}.${sig}`;
}

function post(path, headers = {}, body = null) {
  return new Request(BASE + path, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: body === null ? null : JSON.stringify(body),
  });
}

let pass = 0, fail = 0;
async function check(name, res, expectStatus, expectError) {
  let data = null;
  try { data = await res.json(); } catch {}
  const okStatus = res.status === expectStatus;
  const okError = expectError === undefined || (data && data.error === expectError);
  if (okStatus && okError) { pass++; console.log(`OK   ${name}`); }
  else { fail++; console.log(`FAIL ${name}: status=${res.status} (want ${expectStatus}) body=${JSON.stringify(data)}`); }
}

// --- auth.js ---
await check("auth OPTIONS", await auth(new Request(BASE, { method: "OPTIONS" })), 204);
await check("auth GET", await auth(new Request(BASE, { method: "GET" })), 405, "method_not_allowed");
await check("auth bad json", await auth(new Request(BASE, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{nope" })), 400, "invalid_json");
await check("auth unknown action", await auth(post("/", {}, { action: "x" })), 400, "unknown_action");
await check("auth register bad email", await auth(post("/", {}, { action: "register", email: "nope", password: "123456" })), 400, "invalid_email");
await check("auth register weak pass", await auth(post("/", {}, { action: "register", email: "a@b.com", password: "123" })), 400, "weak_password");
await check("auth login no email", await auth(post("/", {}, { action: "login", email: "", password: "x" })), 400, "invalid_email");
await check("auth admin wrong pass", await auth(post("/", {}, { action: "admin", password: "yanlis" })), 401, "wrong_password");
await check("auth admin no pass", await auth(post("/", {}, { action: "admin" })), 401, "wrong_password");
// valid token + storage unavailable locally (blobs context missing) -> 500 storage_unavailable proves token check passed
const token = makeToken("test@ornek.com");
await check("auth admin valid token (local no-blobs)", await auth(post("/", { "x-neco-token": token }, { action: "admin" })), 500, "storage_unavailable");

// --- chat.js ---
await check("chat OPTIONS", await chat(new Request(BASE, { method: "OPTIONS" })), 204);
await check("chat GET", await chat(new Request(BASE, { method: "GET" })), 405, "method_not_allowed");
// token olmadan da misafir olarak sohbet edilebilmeli (200)
await check("chat no token (misafir)", await chat(post("/", {}, { messages: [{ role: "user", content: "Sadece merhaba de" }], stream: false, max_tokens: 20 })), 200);
await check("chat bad token", await chat(post("/", { "x-neco-token": "abc.def" }, { messages: [{ role: "user", content: "selam" }] })), 401, "auth_required");
// farkli bir secret ile imzalanmis token -> 401
const wrongSecretSig = createHmac("sha256", "baska-secret").update("test@ornek.com").digest("hex");
await check("chat wrong-secret token", await chat(post("/", { "x-neco-token": `${Buffer.from("test@ornek.com").toString("base64url")}.${wrongSecretSig}` }, { messages: [{ role: "user", content: "selam" }] })), 401, "auth_required");

// tampered: valid sig but different email part
const parts = token.split(".");
const tampered = Buffer.from("hacker@x.com").toString("base64url") + "." + parts[1];
await check("chat tampered email", await chat(post("/", { "x-neco-token": tampered }, { messages: [{ role: "user", content: "selam" }] })), 401, "auth_required");

// valid token -> passes gate -> real Groq call (small)
const r = await chat(post("/", { "x-neco-token": token }, { messages: [{ role: "user", content: "Sadece merhaba de" }], stream: false, max_tokens: 20 }));
let rd = null; try { rd = await r.json(); } catch {}
if (r.status === 200 && rd && rd.choices && rd.choices[0] && rd.choices[0].message) {
  pass++; console.log(`OK   chat valid token -> Groq 200 (yanit: ${String(rd.choices[0].message.content || "").slice(0, 40)})`);
} else {
  fail++; console.log(`FAIL chat valid token: status=${r.status} body=${JSON.stringify(rd)}`);
}

console.log(`\n${pass} OK, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
