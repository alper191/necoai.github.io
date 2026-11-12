// chat.js arama yolunu test et (lokal, gercek Groq cagrilari)
import chat from "../netlify/functions/chat.js";

const BASE = "https://test.local";
function post(body) {
  return new Request(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

let pass = 0, fail = 0;

// 1. "?" iceren soru -> arama tetiklenmeli (gpt-oss-20b + browser_search)
const r1 = await chat(post({ messages: [{ role: "user", content: "Bugün İstanbul'da hava nasıl?" }], stream: false, max_tokens: 200 }));
let d1 = null; try { d1 = await r1.json(); } catch {}
if (r1.status === 200 && d1 && d1.choices && d1.choices[0].message && d1.choices[0].message.content) {
  pass++; console.log(`OK   arama sorusu -> model=${d1.model} yanit: ${String(d1.choices[0].message.content).slice(0, 90)}`);
} else {
  fail++; console.log(`FAIL arama sorusu: status=${r1.status} body=${JSON.stringify(d1).slice(0, 300)}`);
}

// 2. normal mesaj -> arama YOK, qwen kullanilmali
const r2 = await chat(post({ messages: [{ role: "user", content: "Sadece merhaba de" }], stream: false, max_tokens: 20 }));
let d2 = null; try { d2 = await r2.json(); } catch {}
if (r2.status === 200 && d2 && d2.choices && d2.choices[0].message && d2.choices[0].message.content) {
  pass++; console.log(`OK   normal soru -> model=${d2.model} yanit: ${String(d2.choices[0].message.content).slice(0, 60)}`);
} else {
  fail++; console.log(`FAIL normal soru: status=${r2.status} body=${JSON.stringify(d2).slice(0, 300)}`);
}

// 3. akisli (stream) arama
const r3 = await chat(post({ messages: [{ role: "user", content: "Dolar kuru bugün kaç TL?" }], stream: true, max_tokens: 300 }));
if (r3.status === 200 && String(r3.headers.get("content-type") || "").includes("text/event-stream")) {
  const text = await r3.text();
  const hasContent = /"content":\s*"[^"]+"/.test(text);
  pass++; console.log(`OK   stream arama -> SSE ${text.length} b, icerik var: ${hasContent}`);
} else {
  fail++; console.log(`FAIL stream arama: status=${r3.status}`);
}

console.log(`\n${pass} OK, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
