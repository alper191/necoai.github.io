// UI testi icin yerel statik sunucu + mock auth uclari (ZIP'e GIRMEZ)
import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const PORT = 8123;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  if (req.method === "POST" && url.pathname === "/.netlify/functions/chat") {
    const token = req.headers["x-neco-token"] || "";
    if (token === "bogus") {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "auth_required" }));
      return;
    }
    res.setHeader("Content-Type", "text/event-stream");
    let msg = "Merhaba! Sohbet calisiyor.";
    let body = "";
    for await (const chunk of req) body += chunk;
    try {
      const parsed = JSON.parse(body);
      const last = (parsed.messages || []).slice(-1)[0];
      if (last && /html/i.test(last.content)) {
        msg = 'Iste sayfa:\\n```html\\n<!DOCTYPE html>\\n<html><head><title>Test</title></head>\\n<body style="font-family:sans-serif;background:#0b1220;color:#fff;padding:40px">\\n<h1>Merhaba NECO.AI!</h1>\\n<p>Bu bir test sayfasidir.</p>\\n</body></html>\\n```';
      }
    } catch {}
    const payload = JSON.stringify({ choices: [{ delta: { content: msg } }] });
    res.end(`data: ${payload}\n\ndata: [DONE]\n\n`);
    return;
  }
  if (req.method === "POST" && url.pathname === "/.netlify/functions/auth") {
    let body = "";
    for await (const chunk of req) body += chunk;
    let data = {};
    try { data = JSON.parse(body); } catch {}
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    if (data.action === "admin") {
      if (data.password !== "neco1234") {
        res.writeHead(401); res.end(JSON.stringify({ error: "wrong_password" })); return;
      }
      res.end(JSON.stringify({
        ok: true, count: 2,
        users: [
          { email: "ali@ornek.com", created_at: Date.now() - 86400000 },
          { email: "ayse@ornek.com", created_at: Date.now() },
        ],
        txt: "NECO.AI - Kayitli Kullanicilar\nToplam: 2\n1. ali@ornek.com\n2. ayse@ornek.com",
      }));
      return;
    }
    if (data.action === "register" && data.email === "var@ornek.com") {
      res.writeHead(409); res.end(JSON.stringify({ error: "email_exists" })); return;
    }
    if (data.action === "login" && data.email !== "ali@ornek.com") {
      res.writeHead(401); res.end(JSON.stringify({ error: "invalid_credentials" })); return;
    }
    res.end(JSON.stringify({ ok: true, token: "dGVzdEBvcm5lay5jb20.abcd1234", email: data.email || "test@ornek.com" }));
    return;
  }
  const filePath = path.join(ROOT, url.pathname === "/" ? "index.html" : url.pathname);
  try {
    const buf = await readFile(filePath);
    res.setHeader("Content-Type", MIME[path.extname(filePath)] || "application/octet-stream");
    res.end(buf);
  } catch {
    res.writeHead(404); res.end("not found");
  }
});

server.listen(PORT, () => console.log("mock server on http://localhost:" + PORT));
