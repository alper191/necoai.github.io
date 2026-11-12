// neco-ai ZIP uretici: ileri egik cizgili girdi adlari ile (Linux/Netlify uyumlu)
// Kullanim: node zip-build.js  (cikti: proje klasorunun yanindaki neco-ai.zip)
"use strict";
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "..", "neco-ai.zip");

function walk(dir, prefix) {
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const rel = prefix + "/" + name;
    if (fs.statSync(full).isDirectory()) out.push(...walk(full, rel));
    else out.push(rel);
  }
  return out;
}

const ENTRIES = [
  "index.html",
  "assets/style.css",
  "assets/app.js",
  "netlify.toml",
  "netlify/functions/chat.js",
  "netlify/functions/auth.js",
  "netlify/functions/package.json",
  ...walk(path.join(ROOT, "netlify", "functions", "node_modules"), "netlify/functions/node_modules"),
  "README.txt",
];

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function dosTime(date) {
  return ((date.getHours() << 11) | (date.getMinutes() << 5) | (date.getSeconds() >> 1)) & 0xffff;
}

function dosDate(date) {
  return (((date.getFullYear() - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate()) & 0xffff;
}

const chunks = [];
const central = [];
let offset = 0;
const now = new Date();

for (const rel of ENTRIES) {
  const filePath = path.join(ROOT, rel);
  if (!fs.existsSync(filePath)) {
    console.error("MISSING_FILE: " + rel);
    process.exit(1);
  }
  const raw = fs.readFileSync(filePath);
  const nameBuf = Buffer.from(rel, "utf8");
  const crc = crc32(raw);
  const compressed = zlib.deflateRawSync(raw, { level: 9 });
  const useStore = compressed.length >= raw.length;
  const data = useStore ? raw : compressed;
  const method = useStore ? 0 : 8;

  const local = Buffer.alloc(30);
  local.writeUInt32LE(0x04034b50, 0);
  local.writeUInt16LE(20, 4);
  local.writeUInt16LE(0x0800, 6); // UTF-8 isim bayragi
  local.writeUInt16LE(method, 8);
  local.writeUInt16LE(dosTime(now), 10);
  local.writeUInt16LE(dosDate(now), 12);
  local.writeUInt32LE(crc, 14);
  local.writeUInt32LE(data.length, 18);
  local.writeUInt32LE(raw.length, 22);
  local.writeUInt16LE(nameBuf.length, 26);
  local.writeUInt16LE(0, 28);

  chunks.push(local, nameBuf, data);

  const cd = Buffer.alloc(46);
  cd.writeUInt32LE(0x02014b50, 0);
  cd.writeUInt16LE(20, 4); // version made by
  cd.writeUInt16LE(20, 6); // version needed
  cd.writeUInt16LE(0x0800, 8);
  cd.writeUInt16LE(method, 10);
  cd.writeUInt16LE(dosTime(now), 12);
  cd.writeUInt16LE(dosDate(now), 14);
  cd.writeUInt32LE(crc, 16);
  cd.writeUInt32LE(data.length, 20);
  cd.writeUInt32LE(raw.length, 24);
  cd.writeUInt16LE(nameBuf.length, 28);
  cd.writeUInt16LE(0, 30); // extra alan
  cd.writeUInt16LE(0, 32); // yorum
  cd.writeUInt16LE(0, 34); // disk no
  cd.writeUInt16LE(0, 36); // ic oznitelikler
  cd.writeUInt32LE(0, 38); // dis oznitelikler
  cd.writeUInt32LE(offset, 42);
  central.push(cd, nameBuf);

  offset += local.length + nameBuf.length + data.length;
  console.log(`ADD ${rel} (${raw.length} b -> ${data.length} b, crc ${crc.toString(16)})`);
}

const cdSize = central.reduce((s, b) => s + b.length, 0);
const eocd = Buffer.alloc(22);
eocd.writeUInt32LE(0x06054b50, 0);
eocd.writeUInt16LE(0, 4); // disk no
eocd.writeUInt16LE(0, 6); // cd baslangic diski
eocd.writeUInt16LE(ENTRIES.length, 8);
eocd.writeUInt16LE(ENTRIES.length, 10);
eocd.writeUInt32LE(cdSize, 12);
eocd.writeUInt32LE(offset, 16);
eocd.writeUInt16LE(0, 20); // yorum uzunlugu

fs.writeFileSync(OUT, Buffer.concat([...chunks, ...central, eocd]));
console.log("ALL_OK " + OUT + " (" + (offset + cdSize + 22) + " bytes)");
