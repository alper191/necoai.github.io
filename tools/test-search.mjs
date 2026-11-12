// Groq browser_search aracini test et (lokal, anahtar chat.js'ten)
import { readFileSync } from "node:fs";

const src = readFileSync(new URL("../netlify/functions/chat.js", import.meta.url), "utf8");
const key = (src.match(/BUILTIN_API_KEY = "([^"]+)"/) || [])[1];

async function tryModel(model, stream) {
  const payload = {
    model,
    messages: [{ role: "user", content: "Bugün İstanbul'da hava nasıl?" }],
    tool_choice: "required",
    tools: [{ type: "browser_search" }],
    max_tokens: 400,
    stream,
  };
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify(payload),
  });
  console.log(`\n=== ${model} stream=${stream} => HTTP ${res.status}`);
  if (!res.ok) {
    console.log(await res.text());
    return false;
  }
  if (stream) {
    const text = await res.text();
    console.log("SSE (ilk 1500):\n" + text.slice(0, 1500));
    return true;
  }
  const data = await res.json();
  console.log("choices:", JSON.stringify(data.choices, null, 1).slice(0, 1200));
  console.log("usage:", JSON.stringify(data.usage || {}));
  return true;
}

const ok1 = await tryModel("qwen/qwen3.8-27b", false);
if (!ok1) {
  await tryModel("openai/gpt-oss-20b", false);
  await tryModel("openai/gpt-oss-20b", true);
}
await tryModel("qwen/qwen3.8-27b", true);
