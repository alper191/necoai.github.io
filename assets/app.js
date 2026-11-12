/* ============================================================
   NECO.AI — Uygulama Mantığı (Vanilla JS)
   ============================================================ */
(() => {
  "use strict";

  /* ---------- Yardımcılar ---------- */

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));

  const el = (tag, cls, text) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  const ICONS = {
    chat: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M21 12a8 8 0 0 1-8 8H4l2.5-2.8A8 8 0 1 1 21 12z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    trash: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none"><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m3 0l-1 13a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1L6 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    copy: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none"><rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M5 15V5a2 2 0 0 1 2-2h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    eye: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8"/></svg>',
    download: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none"><path d="M12 3v12m0 0 5-5m-5 5-5-5M4 21h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    globe: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9S14.5 18.3 12 21c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z" stroke="currentColor" stroke-width="1.8"/></svg>',
    check: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none"><path d="M4 12.5l5 5L20 6.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    file: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none"><path d="M13 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9l-6-7z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M13 2v7h7" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    close: '<svg viewBox="0 0 24 24" width="12" height="12" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
    bulb: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 1 4 10.5c-.7.6-1 1.3-1 2.5h-6c0-1.2-.3-1.9-1-2.5A6 6 0 0 1 12 3z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    doc: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M14 3v5h5M9 13h6M9 17h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    code: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none"><path d="M8 6l-6 6 6 6M16 6l6 6-6 6M13.5 3l-3 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    sparkle: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3zM19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
    book: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5zM4 19a2 2 0 0 1 2-2h13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    grad: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none"><path d="M12 3v18M5 8l14 8M5 16l14-8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  };

  const escapeHtml = (s) =>
    s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- Çeviriler ---------- */

  const I18N = {
    tr: {
      newChat: "Yeni Sohbet",
      chats: "Sohbetler",
      clearAll: "Tümünü Sil",
      online: "Çevrimiçi",
      welcomeTitle: "Merhaba, ben <em>NECO.AI</em>",
      welcomeSub: "Sana nasıl yardımcı olabilirim? Soru sor, fikir üret, metin yaz veya kodlama desteği al.",
      hint: "Enter ile gönder · Shift+Enter yeni satır",
      placeholder: "NECO.AI'a bir şey sor...",
      you: "Sen",
      emptyChats: "Henüz sohbet yok. İlk mesajını gönder!",
      copy: "Kopyala",
      copied: "Kopyalandı!",
      preview: "Önizle",
      download: "İndir",
      previewOpen: "Yeni Sekmede Aç",
      close: "Kapat",
      deleteChatTitle: "Sohbeti Sil",
      deleteChatText: "Bu sohbet kalıcı olarak silinecek. Emin misin?",
      deleteAllTitle: "Tümünü Sil",
      deleteAllText: "Tüm sohbet geçmişi kalıcı olarak silinecek. Emin misin?",
      cancel: "İptal",
      delete: "Sil",
      stopped: "Yanıt üretimi durduruldu.",
      loginTab: "Giriş",
      registerTab: "Kaydol",
      loginSub: "E-postan ve şifrenle giriş yap",
      registerSub: "Yeni hesap oluştur",
      loginBtn: "Giriş Yap",
      registerBtn: "Kaydol",
      logout: "Çıkış Yap",
      loginMenuBtn: "Giriş Yap / Kaydol",
      adminLink: "Yönetici Girişi",
      adminSub: "Kayıtlı kullanıcıları görüntüle",
      adminShow: "Listeyi Göster",
      adminBack: "Geri Dön",
      adminCount: "Kayıtlı kullanıcı sayısı:",
      adminDownload: "TXT Olarak İndir",
      adminEmpty: "Henüz kayıtlı kullanıcı yok.",
      adminWrongPass: "Yönetici şifresi yanlış.",
      errEmailExists: "Bu e-posta zaten kayıtlı. Giriş yapmayı dene.",
      errInvalidCred: "E-posta veya şifre hatalı.",
      errWeakPass: "Şifre en az 6 karakter olmalı.",
      errInvalidEmail: "Geçerli bir e-posta adresi gir.",
      errSessionExpired: "Giriş bilgisi geçersiz. Misafir olarak devam ediyorsun.",
      errStorage: "Kayıt sunucuda saklanamadı. Lütfen site sahibine bildir.",
      errAuthNetwork: "Sunucuya ulaşılamadı. İnternet bağlantını kontrol et.",
      errMissingKey: "Sunucuda API anahtarı yapılandırılmamış. Lütfen site sahibine bildirin.",
      errNetwork: "Ağ hatası oluştu. İnternet bağlantını kontrol edip tekrar dene.",
      errFileProtocol: "Uygulama dosya olarak açıldığı için çalışamaz. Lütfen README.txt'deki adımlarla Netlify'da yayınla.",
      errNoFunction: "Sunucu fonksiyonu bulunamadı. Siteyi Netlify üzerinden yeniden yayınla (README.txt).",
      errBadGateway: "Sunucudan geçersiz yanıt alındı. Siteyi yeniden yayınlayıp tekrar dene.",
      errRateLimited: "Dakikalık istek sınırına ulaşıldı. Birkaç saniye bekleyip tekrar dene.",
      errUpstream: "Yapay zekâ servisine ulaşılamadı. Lütfen birazdan tekrar dene.",
      errGeneric: "Bir şeyler ters gitti. Lütfen tekrar dene.",
      errDetail: "Teknik detay:",
      fileTooBig: "dosyası çok büyük (en fazla 100 KB).",
      fileUnsupported: "dosya türü desteklenmiyor. Metin tabanlı dosyalar seç.",
      fileNotText: "dosyası okunamadı (metin dosyası değil).",
      fileReadError: "dosyası okunurken hata oluştu.",
      chatDeleted: "Sohbet silindi.",
      allDeleted: "Tüm sohbetler silindi.",
      saved: "Kaydedildi.",
      suggestions: [
        { icon: "bulb", title: "Fikir üret", prompt: "Bana yeni bir iş veya proje fikri üret." },
        { icon: "doc", title: "Makale yaz", prompt: "Teknoloji hakkında kısa, ilgi çekici bir makale yaz." },
        { icon: "code", title: "Kodlama yardımı", prompt: "Python'da bir liste sıralama örneği göster ve açıkla." },
        { icon: "globe", title: "Web sayfası yap", prompt: "Bana renkli, modern bir tanıtım web sayfası yap (tek html dosyası)." },
        { icon: "sparkle", title: "Metin özetle", prompt: "Sana vereceğim metni özetlemen için nasıl hazırlamam gerektiğini anlat." },
        { icon: "book", title: "Hikâye yaz", prompt: "Kısa, yaratıcı bir hikâye yaz." },
        { icon: "grad", title: "Bir şey öğret", prompt: "Bana yapay zekânın temellerini basitçe anlat." },
      ],
    },
    en: {
      newChat: "New Chat",
      chats: "Chats",
      clearAll: "Clear All",
      online: "Online",
      welcomeTitle: "Hi, I'm <em>NECO.AI</em>",
      welcomeSub: "How can I help you? Ask questions, brainstorm ideas, write text or get coding help.",
      hint: "Press Enter to send · Shift+Enter for a new line",
      placeholder: "Ask NECO.AI anything...",
      you: "You",
      emptyChats: "No chats yet. Send your first message!",
      copy: "Copy",
      copied: "Copied!",
      preview: "Preview",
      download: "Download",
      previewOpen: "Open in New Tab",
      close: "Close",
      deleteChatTitle: "Delete Chat",
      deleteChatText: "This chat will be permanently deleted. Are you sure?",
      deleteAllTitle: "Clear All",
      deleteAllText: "All chat history will be permanently deleted. Are you sure?",
      cancel: "Cancel",
      delete: "Delete",
      stopped: "Response generation stopped.",
      loginTab: "Sign In",
      registerTab: "Sign Up",
      loginSub: "Sign in with your email and password",
      registerSub: "Create a new account",
      loginBtn: "Sign In",
      registerBtn: "Sign Up",
      logout: "Sign Out",
      loginMenuBtn: "Sign In / Sign Up",
      adminLink: "Admin Sign In",
      adminSub: "View registered users",
      adminShow: "Show List",
      adminBack: "Back",
      adminCount: "Registered users:",
      adminDownload: "Download as TXT",
      adminEmpty: "No registered users yet.",
      adminWrongPass: "Wrong admin password.",
      errEmailExists: "This email is already registered. Try signing in.",
      errInvalidCred: "Wrong email or password.",
      errWeakPass: "Password must be at least 6 characters.",
      errInvalidEmail: "Enter a valid email address.",
      errSessionExpired: "Your sign-in info is invalid. Continuing as a guest.",
      errStorage: "The account could not be saved on the server. Contact the site owner.",
      errAuthNetwork: "Could not reach the server. Check your connection.",
      errMissingKey: "The server is missing its API key configuration. Please contact the site owner.",
      errNetwork: "A network error occurred. Check your connection and try again.",
      errFileProtocol: "This app cannot run when opened as a local file. Publish it on Netlify using the steps in README.txt.",
      errNoFunction: "Server function not found. Republish the site on Netlify (see README.txt).",
      errBadGateway: "Received an invalid response from the server. Republish the site and try again.",
      errRateLimited: "Rate limit reached. Wait a few seconds and try again.",
      errUpstream: "The AI service is unreachable. Please try again shortly.",
      errGeneric: "Something went wrong. Please try again.",
      errDetail: "Technical detail:",
      fileTooBig: "is too large (max 100 KB).",
      fileUnsupported: "file type is not supported. Choose text-based files.",
      fileNotText: "could not be read (not a text file).",
      fileReadError: "could not be read.",
      chatDeleted: "Chat deleted.",
      allDeleted: "All chats deleted.",
      saved: "Saved.",
      suggestions: [
        { icon: "bulb", title: "Brainstorm ideas", prompt: "Give me a new business or project idea." },
        { icon: "doc", title: "Write an article", prompt: "Write a short, engaging article about technology." },
        { icon: "code", title: "Coding help", prompt: "Show and explain a list sorting example in Python." },
        { icon: "globe", title: "Build a web page", prompt: "Build me a colorful, modern promo web page (single html file)." },
        { icon: "sparkle", title: "Summarize text", prompt: "Explain how I should prepare a text for you to summarize." },
        { icon: "book", title: "Write a story", prompt: "Write a short, creative story." },
        { icon: "grad", title: "Teach me something", prompt: "Explain the basics of artificial intelligence simply." },
      ],
    },
  };

  const t = (key) => (I18N[state.lang] && I18N[state.lang][key]) || I18N.tr[key] || key;

  /* ---------- Durum ---------- */

  const STORE_KEY = "neco_chats_v1";
  const LANG_KEY = "neco_lang";
  const TOKEN_KEY = "neco_token";
  const EMAIL_KEY = "neco_email";
  const MAX_FILE_SIZE = 100 * 1024;
  const BLOCKED_EXT = /\.(html?|xhtml)$/i;

  const state = {
    lang: "tr",
    chats: [],
    activeId: null,
    sending: false,
    abort: null,
    attachments: [],
    token: "",
    email: "",
    previewUrl: null,
  };

  const elByMsg = new Map();

  function loadState() {
    try {
      state.chats = JSON.parse(localStorage.getItem(STORE_KEY) || "[]");
      if (!Array.isArray(state.chats)) state.chats = [];
    } catch {
      state.chats = [];
    }
    state.lang = localStorage.getItem(LANG_KEY) === "en" ? "en" : "tr";
    state.token = localStorage.getItem(TOKEN_KEY) || "";
    state.email = localStorage.getItem(EMAIL_KEY) || "";
    if (state.activeId && !state.chats.some((c) => c.id === state.activeId)) state.activeId = null;
    if (!state.activeId && state.chats.length) {
      state.activeId = state.chats.reduce((a, b) => (b.updatedAt > a.updatedAt ? b : a)).id;
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(state.chats));
    } catch (e) {
      const quota = e && (e.name === "QuotaExceededError" || e.code === 22);
      showToast(
        quota
          ? state.lang === "tr" ? "Sohbet kaydedilemedi (depolama dolu)." : "Could not save chat (storage full)."
          : state.lang === "tr" ? "Sohbet kaydedilemedi." : "Could not save chat.",
        "error"
      );
    }
  }

  const activeChat = () => state.chats.find((c) => c.id === state.activeId) || null;

  /* ---------- Markdown ---------- */

  function renderMarkdown(src) {
    if (!src) return "";
    let text = src;
    if ((text.match(/```/g) || []).length % 2 === 1) text += "\n```";

    const blocks = [];
    text = text.replace(/```([\w#+.-]*)[ \t]*\n?([\s\S]*?)```/g, (_, lang, code) => {
      const i = blocks.length;
      blocks.push({ lang: lang.trim(), code: code.replace(/\n$/, "") });
      return `\n««BLOCK${i}»»\n`;
    });

    let html = escapeHtml(text);

    html = html
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*\n]+)\*/g, "<em>$1</em>")
      .replace(/`([^`\n]+)`/g, '<code class="inline-code">$1</code>')
      .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    const out = [];
    let inUl = false, inOl = false, inBq = false;
    const closeLists = () => {
      if (inUl) { out.push("</ul>"); inUl = false; }
      if (inOl) { out.push("</ol>"); inOl = false; }
    };

    for (const raw of html.split("\n")) {
      const line = raw.replace(/\s+$/, "");
      const trimmed = line.trim();
      let m;

      if (/^««BLOCK\d+»»$/.test(trimmed)) {
        closeLists();
        if (inBq) { out.push("</blockquote>"); inBq = false; }
        const b = blocks[Number(trimmed.slice(7, -2))];
        out.push(blockHtml(b));
        continue;
      }
      if (!trimmed) {
        closeLists();
        if (inBq) { out.push("</blockquote>"); inBq = false; }
        continue;
      }
      if ((m = trimmed.match(/^(#{1,4})\s+(.*)/))) {
        closeLists();
        if (inBq) { out.push("</blockquote>"); inBq = false; }
        out.push(`<h${m[1].length}>${m[2]}</h${m[1].length}>`);
        continue;
      }
      if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
        closeLists();
        if (inBq) { out.push("</blockquote>"); inBq = false; }
        out.push("<hr>");
        continue;
      }
      if ((m = trimmed.match(/^&gt;\s?(.*)/))) {
        closeLists();
        if (!inBq) { out.push("<blockquote>"); inBq = true; }
        out.push(m[1]);
        continue;
      }
      if ((m = trimmed.match(/^\s*[-*+]\s+(.*)/))) {
        if (!inUl) { closeLists(); out.push("<ul>"); inUl = true; }
        out.push(`<li>${m[1]}</li>`);
        continue;
      }
      if ((m = trimmed.match(/^\s*\d+[.)]\s+(.*)/))) {
        if (!inOl) { closeLists(); out.push("<ol>"); inOl = true; }
        out.push(`<li>${m[1]}</li>`);
        continue;
      }
      closeLists();
      if (inBq) { out.push("</blockquote>"); inBq = false; }
      out.push(`<p>${line}</p>`);
    }
    closeLists();
    if (inBq) out.push("</blockquote>");
    return out.join("\n");
  }

  function blockHtml(b) {
    const label = b.lang ? `<span class="code-lang">${escapeHtml(b.lang)}</span>` : "<span></span>";
    const isHtml =
      /^(html|htm)$/i.test(b.lang || "") ||
      (!b.lang && /^\s*(<!doctype html|<html[\s>])/i.test(b.code));
    const extra = isHtml
      ? `<button type="button" class="copy-btn html-preview-btn">${ICONS.eye}<span>${t("preview")}</span></button>` +
        `<button type="button" class="copy-btn html-download-btn">${ICONS.download}<span>${t("download")}</span></button>`
      : "";
    return (
      `<div class="code-block"><div class="code-head">${label}` +
      `<span class="code-actions">${extra}` +
      `<button type="button" class="copy-btn">${ICONS.copy}<span>${t("copy")}</span></button></span></div>` +
      `<pre><code>${escapeHtml(b.code)}</code></pre></div>`
    );
  }

  /* ---------- SSE / API ---------- */

  function parseSSELines(bufRef) {
    const events = [];
    let idx;
    while ((idx = bufRef.value.indexOf("\n")) !== -1) {
      const line = bufRef.value.slice(0, idx);
      bufRef.value = bufRef.value.slice(idx + 1);
      const trimmed = line.trim();
      if (trimmed.startsWith("data:")) events.push(trimmed.slice(5).trim());
    }
    return events;
  }

  async function streamChat(messages, asstMsg) {
    if (typeof location !== "undefined" && location.protocol === "file:") {
      throw { key: "errFileProtocol" };
    }
    const controller = new AbortController();
    state.abort = controller;
    const doFetch = () =>
      fetch("/.netlify/functions/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-neco-token": state.token || "" },
        body: JSON.stringify({ messages, stream: true }),
        signal: controller.signal,
      });
    let res;
    try {
      res = await doFetch();
    } catch (err) {
      if (err && err.name === "AbortError") throw { aborted: true };
      throw { key: "errNetwork" };
    }

    if (res.status === 401 && state.token) {
      clearAuth();
      showToast(t("errSessionExpired"));
      try {
        res = await doFetch();
      } catch (err) {
        if (err && err.name === "AbortError") throw { aborted: true };
        throw { key: "errNetwork" };
      }
    }

    if (!res.ok) {
      let data = {};
      let isJson = true;
      try { data = await res.json(); } catch { isJson = false; }
      if (res.status === 401) throw { key: "errSessionExpired" };
      if (res.status === 404) throw { key: "errNoFunction" };
      if (!isJson) throw { key: "errBadGateway" };
      throw mapServerError(data);
    }

    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("text/event-stream")) {
      let data;
      try { data = await res.json(); } catch { throw { key: "errGeneric" }; }
      const content = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || "";
      asstMsg.text = content;
      renderStreaming(asstMsg);
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");
    const buf = { value: "" };
    let done = false;
    while (!done) {
      let chunk;
      try {
        chunk = await reader.read();
      } catch (err) {
        if (err && err.name === "AbortError") throw { aborted: true };
        throw { key: "errNetwork" };
      }
      if (chunk.done) break;
      buf.value += decoder.decode(chunk.value, { stream: true });
      for (const ev of parseSSELines(buf)) {
        if (ev === "[DONE]") { done = true; break; }
        let parsed;
        try { parsed = JSON.parse(ev); } catch { continue; }
        const delta = parsed && parsed.choices && parsed.choices[0] && parsed.choices[0].delta && parsed.choices[0].delta.content;
        if (typeof delta === "string" && delta) {
          asstMsg.text += delta;
          scheduleRender(asstMsg);
        }
      }
    }
    buf.value += decoder.decode();
    for (const ev of parseSSELines(buf)) {
      if (ev === "[DONE]") break;
      let parsed;
      try { parsed = JSON.parse(ev); } catch { continue; }
      const delta = parsed && parsed.choices && parsed.choices[0] && parsed.choices[0].delta && parsed.choices[0].delta.content;
      if (typeof delta === "string" && delta) asstMsg.text += delta;
    }
    renderStreaming(asstMsg);
  }

  function mapServerError(data) {
    if (data && data.error === "missing_api_key") return { key: "errMissingKey" };
    if (data && data.error === "upstream_unreachable") return { key: "errUpstream" };
    if (data && data.error === "rate_limited") return { key: "errRateLimited" };
    if (data && data.error === "upstream_error") return { key: "errGeneric", detail: data.detail };
    return { key: "errGeneric" };
  }

  /* ---------- Sohbet yönetimi ---------- */

  function newChatId() {
    return "c" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function ensureActiveChat() {
    if (activeChat()) return;
    const chat = { id: newChatId(), title: "", createdAt: Date.now(), updatedAt: Date.now(), messages: [] };
    state.chats.unshift(chat);
    state.activeId = chat.id;
  }

  function historyForApi(chat) {
    return chat.messages
      .filter((m) => m.role === "assistant" ? String(m.text || "").length > 0 : true)
      .slice(-30)
      .map((m) => ({ role: m.role, content: m.role === "user" ? m.content : m.text }));
  }

  function addMessage(role, content, extra = {}) {
    const chat = activeChat();
    const msg = {
      id: "m" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      role,
      time: Date.now(),
      text: role === "assistant" ? "" : undefined,
      content: role === "user" ? content : undefined,
      display: extra.display,
      ...extra,
    };
    chat.messages.push(msg);
    chat.updatedAt = Date.now();
    if (role === "user" && !chat.title) {
      const base = content.replace(/```[\s\S]*?```/g, "").replace(/\s+/g, " ").trim();
      chat.title = (base || "Yeni sohbet").slice(0, 48);
    }
    saveState();
    return msg;
  }

  /* ---------- Görüntüleme ---------- */

  const messagesEl = $("#messages");
  const welcomeEl = $("#welcome");
  const chatScroll = $("#chatScroll");

  function isNearBottom() {
    return chatScroll.scrollHeight - chatScroll.scrollTop - chatScroll.clientHeight < 160;
  }

  function scrollToBottom(force) {
    if (force || isNearBottom()) chatScroll.scrollTop = chatScroll.scrollHeight;
  }

  function formatTime(ts) {
    return new Date(ts).toLocaleTimeString(state.lang === "tr" ? "tr-TR" : "en-US", { hour: "2-digit", minute: "2-digit" });
  }

  function formatDate(ts) {
    const d = new Date(ts);
    const now = new Date();
    const sameDay = d.toDateString() === now.toDateString();
    if (sameDay) return formatTime(ts);
    return d.toLocaleDateString(state.lang === "tr" ? "tr-TR" : "en-US", { day: "numeric", month: "short" });
  }

  function renderActiveChat() {
    const chat = activeChat();
    messagesEl.innerHTML = "";
    if (!chat || chat.messages.length === 0) {
      welcomeEl.hidden = false;
      messagesEl.hidden = true;
      $("#chatTitle").textContent = "";
      return;
    }
    welcomeEl.hidden = true;
    messagesEl.hidden = false;
    $("#chatTitle").textContent = chat.title || "";
    const fragment = document.createDocumentFragment();
    const last = chat.messages[chat.messages.length - 1];
    for (const msg of chat.messages) {
      const isLive = state.sending && msg === last && msg.role === "assistant";
      if (
        msg.role === "assistant" &&
        !String(msg.text || "").length &&
        !isLive &&
        !msg.error &&
        !msg.stopped
      ) continue;
      fragment.appendChild(buildMessageEl(msg, { streaming: isLive }));
    }
    messagesEl.appendChild(fragment);
    requestAnimationFrame(() => scrollToBottom(true));
  }

  function buildMessageEl(msg, opts = {}) {
    const isUser = msg.role === "user";
    const row = el("div", "msg " + (isUser ? "user" : "assistant") + (msg.error ? " error" : ""));
    const avatar = el("div", "msg-avatar", isUser ? "S" : "N");
    const body = el("div", "msg-body");
    const head = el("div", "msg-head");
    head.appendChild(el("span", "msg-name", isUser ? t("you") : "NECO.AI"));
    head.appendChild(el("span", "msg-time", formatTime(msg.time)));
    body.appendChild(head);
    const content = el("div", "msg-content");
    if (isUser) {
      const textNode = document.createElement("span");
      textNode.textContent = String(msg.display !== undefined ? msg.display : msg.content || "");
      content.appendChild(textNode);
      if (msg.files && msg.files.length) {
        const wrap = el("div", "msg-files");
        for (const f of msg.files) wrap.appendChild(el("span", "msg-file", f));
        content.appendChild(wrap);
      }
    } else if (opts.streaming && !String(msg.text || "").length) {
      content.innerHTML = '<span class="typing"><span></span><span></span><span></span></span>';
    } else if (msg.error) {
      content.innerHTML = renderMarkdown(t(msg.errorKey || "errGeneric")) +
        (msg.errorDetail ? `<p><small>${t("errDetail")} ${escapeHtml(msg.errorDetail)}</small></p>` : "");
    } else if (msg.stopped) {
      content.innerHTML = renderMarkdown(msg.text || t("stopped"));
    } else {
      content.innerHTML = renderMarkdown(msg.text || "");
    }
    body.appendChild(content);
    row.appendChild(avatar);
    row.appendChild(body);
    if (opts.streaming) {
      elByMsg.set(msg, row);
    } else {
      elByMsg.delete(msg);
    }
    return row;
  }

  const pendingRenders = new Set();
  let rafScheduled = false;

  function scheduleRender(asstMsg) {
    pendingRenders.add(asstMsg);
    if (rafScheduled) return;
    rafScheduled = true;
    requestAnimationFrame(() => {
      rafScheduled = false;
      for (const m of pendingRenders) renderStreaming(m);
      pendingRenders.clear();
    });
  }

  function renderStreaming(asstMsg) {
    const row = elByMsg.get(asstMsg);
    if (!row || !row.isConnected) return;
    const content = row.querySelector(".msg-content");
    if (!content) return;
    if (!String(asstMsg.text || "").length) {
      content.innerHTML = '<span class="typing"><span></span><span></span><span></span></span>';
    } else {
      content.innerHTML = renderMarkdown(asstMsg.text);
    }
    scrollToBottom();
  }

  function renderChatList() {
    const list = $("#chatList");
    list.innerHTML = "";
    if (state.chats.length === 0) {
      list.appendChild(el("div", "chat-empty", t("emptyChats")));
      return;
    }
    const sorted = [...state.chats].sort((a, b) => b.updatedAt - a.updatedAt);
    for (const chat of sorted) {
      const item = el("button", "chat-item" + (chat.id === state.activeId ? " active" : ""));
      item.type = "button";
      item.dataset.id = chat.id;
      item.innerHTML = `<span class="chat-icon">${ICONS.chat}</span>`;
      const meta = el("span", "chat-meta");
      meta.appendChild(el("span", "chat-name", chat.title || t("newChat")));
      meta.appendChild(el("span", "chat-date", formatDate(chat.updatedAt)));
      item.appendChild(meta);
      const del = el("span", "chat-del");
      del.innerHTML = ICONS.trash;
      del.title = t("delete");
      del.addEventListener("click", (e) => {
        e.stopPropagation();
        askDeleteChat(chat.id);
      });
      item.appendChild(del);
      item.addEventListener("click", () => switchChat(chat.id));
      list.appendChild(item);
    }
  }

  function switchChat(id) {
    state.activeId = id;
    renderChatList();
    renderActiveChat();
    closeSidebar();
  }

  function askDeleteChat(id) {
    showModal({
      title: t("deleteChatTitle"),
      text: t("deleteChatText"),
      confirmText: t("delete"),
      onConfirm: () => {
        state.chats = state.chats.filter((c) => c.id !== id);
        if (state.activeId === id) state.activeId = null;
        saveState();
        renderChatList();
        renderActiveChat();
        showToast(t("chatDeleted"), "success");
      },
    });
  }

  function askClearAll() {
    showModal({
      title: t("deleteAllTitle"),
      text: t("deleteAllText"),
      confirmText: t("delete"),
      onConfirm: () => {
        state.chats = [];
        state.activeId = null;
        saveState();
        renderChatList();
        renderActiveChat();
        showToast(t("allDeleted"), "success");
      },
    });
  }

  /* ---------- Modal ve toast ---------- */

  function showModal({ title, text, confirmText, onConfirm }) {
    $("#modalTitle").textContent = title;
    $("#modalText").textContent = text;
    $("#modalCancel").textContent = t("cancel");
    $("#modalConfirm").textContent = confirmText;
    const backdrop = $("#modalBackdrop");
    backdrop.hidden = false;
    const close = () => { backdrop.hidden = true; cleanup(); };
    const cleanup = () => {
      $("#modalCancel").removeEventListener("click", close);
      $("#modalConfirm").removeEventListener("click", confirm);
      backdrop.removeEventListener("click", backdropClick);
      document.removeEventListener("keydown", esc);
    };
    const confirm = () => { close(); onConfirm(); };
    const backdropClick = (e) => { if (e.target === backdrop) close(); };
    const esc = (e) => { if (e.key === "Escape") close(); };
    $("#modalCancel").addEventListener("click", close);
    $("#modalConfirm").addEventListener("click", confirm);
    backdrop.addEventListener("click", backdropClick);
    document.addEventListener("keydown", esc);
  }

  function openHtmlPreview(code) {
    closeHtmlPreview();
    const url = URL.createObjectURL(new Blob([code], { type: "text/html;charset=utf-8" }));
    state.previewUrl = url;
    $("#previewFrame").src = url;
    $("#previewOverlay").hidden = false;
  }

  function closeHtmlPreview() {
    const overlay = $("#previewOverlay");
    if (!overlay) return;
    overlay.hidden = true;
    $("#previewFrame").src = "about:blank";
    if (state.previewUrl) {
      URL.revokeObjectURL(state.previewUrl);
      state.previewUrl = null;
    }
  }

  function showToast(message, type, duration = 3500) {
    const toast = el("div", "toast" + (type ? " " + type : ""));
    toast.textContent = message;
    $("#toasts").appendChild(toast);
    setTimeout(() => {
      toast.style.transition = "opacity 0.3s, transform 0.3s";
      toast.style.opacity = "0";
      toast.style.transform = "translateY(10px)";
      setTimeout(() => toast.remove(), 320);
    }, duration);
  }

  /* ---------- Gönderme ---------- */

  async function sendMessage(rawText) {
    if (state.sending) return;
    const text = rawText.trim();
    const files = [...state.attachments];
    if (!text && files.length === 0) return;

    let content = text;
    if (files.length) {
      const parts = files.map((f) => `--- Dosya: ${f.name} ---\n${f.content}`);
      content = content ? content + "\n\n" + parts.join("\n\n") : parts.join("\n\n");
    }

    ensureActiveChat();
    const chat = activeChat();
    addMessage("user", content, { display: text, files: files.map((f) => f.name) });
    const asstMsg = addMessage("assistant", "", {});
    clearAttachments();
    $("#input").value = "";
    autosize();
    state.sending = true;
    updateSendUI();
    renderActiveChat();
    renderChatList();

    try {
      await streamChat(historyForApi(chat), asstMsg);
    } catch (err) {
      if (err && err.aborted) {
        if (!String(asstMsg.text || "").length) asstMsg.text = t("stopped");
        asstMsg.stopped = true;
      } else {
        asstMsg.error = true;
        asstMsg.errorKey = err.key || "errGeneric";
        asstMsg.errorDetail = err.detail || "";
      }
    } finally {
      state.sending = false;
      state.abort = null;
      saveState();
      renderActiveChat();
      updateSendUI();
      renderChatList();
    }
  }

  function updateSendUI() {
    const hasInput = $("#input").value.trim().length > 0 || state.attachments.length > 0;
    $("#sendBtn").disabled = state.sending || !hasInput;
    $("#stopBtn").hidden = !state.sending;
    $("#sendBtn").hidden = state.sending;
  }

  /* ---------- Dosya ekleme ---------- */

  function clearAttachments() {
    state.attachments = [];
    renderAttachments();
  }

  function renderAttachments() {
    const wrap = $("#attachments");
    wrap.innerHTML = "";
    wrap.hidden = state.attachments.length === 0;
    for (const [i, att] of state.attachments.entries()) {
      const chip = el("span", "attach-chip");
      chip.innerHTML = `${ICONS.file}`;
      chip.appendChild(el("span", "chip-name", att.name));
      const rm = el("button", "chip-remove");
      rm.type = "button";
      rm.innerHTML = ICONS.close;
      rm.title = state.lang === "tr" ? "Kaldır" : "Remove";
      rm.addEventListener("click", () => {
        state.attachments.splice(i, 1);
        renderAttachments();
        updateSendUI();
      });
      chip.appendChild(rm);
      wrap.appendChild(chip);
    }
  }

  function handleFiles(fileList) {
    for (const file of Array.from(fileList)) {
      if (file.size > MAX_FILE_SIZE) {
        showToast(`"${file.name}" ${t("fileTooBig")}`, "error");
        continue;
      }
      if (BLOCKED_EXT.test(file.name)) {
        showToast(`"${file.name}" ${t("fileUnsupported")}`, "error");
        continue;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const text = String(reader.result || "");
        if (text.indexOf("\u0000") !== -1) {
          showToast(`"${file.name}" ${t("fileNotText")}`, "error");
          return;
        }
        if (state.attachments.length >= 4) {
          showToast(state.lang === "tr" ? "En fazla 4 dosya ekleyebilirsin." : "You can attach up to 4 files.", "error");
          return;
        }
        state.attachments.push({ name: file.name, content: text.slice(0, MAX_FILE_SIZE) });
        renderAttachments();
        updateSendUI();
      };
      reader.onerror = () => showToast(`"${file.name}" ${t("fileReadError")}`, "error");
      reader.readAsText(file);
    }
    $("#fileInput").value = "";
  }

  /* ---------- Dil ---------- */

  function applyLanguage() {
    document.documentElement.lang = state.lang;
    $$("[data-i18n]").forEach((node) => { node.textContent = t(node.dataset.i18n); });
    $("#welcomeTitle").innerHTML = t("welcomeTitle");
    $("#input").placeholder = t("placeholder");
    $$(".lang-btn").forEach((b) => b.classList.toggle("active", b.dataset.lang === state.lang));
    if (!$("#authOverlay").hidden) setAuthMode(authMode);
    renderSuggestions();
    renderChatList();
    renderActiveChat();
    updateSendUI();
  }

  function setLanguage(lang) {
    if (state.lang === lang) return;
    state.lang = lang;
    try { localStorage.setItem(LANG_KEY, lang); } catch {}
    applyLanguage();
  }

  function renderSuggestions() {
    const wrap = $("#suggestions");
    wrap.innerHTML = "";
    for (const s of t("suggestions")) {
      const btn = el("button", "suggestion");
      btn.type = "button";
      btn.innerHTML = `${ICONS[s.icon] || ICONS.sparkle}`;
      btn.appendChild(el("span", "", s.title));
      btn.addEventListener("click", () => sendMessage(s.prompt));
      wrap.appendChild(btn);
    }
  }

  /* ---------- Kenar çubuğu (mobil) ---------- */

  function openSidebar() {
    $("#sidebar").classList.add("open");
    $("#sidebarOverlay").classList.add("show");
  }

  function closeSidebar() {
    $("#sidebar").classList.remove("open");
    $("#sidebarOverlay").classList.remove("show");
  }

  /* ---------- Giriş alanı ---------- */

  function autosize() {
    const ta = $("#input");
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 200) + "px";
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch {}
      ta.remove();
    }
  }

  /* ---------- Giriş / Kayıt ---------- */

  let authMode = "login";

  function setAuthMode(mode) {
    authMode = mode;
    $("#loginTab").classList.toggle("active", mode === "login");
    $("#registerTab").classList.toggle("active", mode === "register");
    $("#authSubmit").textContent = t(mode === "login" ? "loginBtn" : "registerBtn");
    $("#authSub").textContent = t(mode === "login" ? "loginSub" : "registerSub");
    showAuthError("");
    $("#authPass").autocomplete = mode === "login" ? "current-password" : "new-password";
  }

  function showAuthError(message) {
    const errEl = $("#authError");
    errEl.hidden = !message;
    errEl.textContent = message || "";
  }

  function showAuth(message) {
    const overlay = $("#authOverlay");
    overlay.hidden = false;
    $("#adminView").hidden = true;
    $("#authView").hidden = false;
    $("#adminResult").hidden = true;
    setAuthMode("login");
    showAuthError(message || "");
    $("#authPass").value = "";
    setTimeout(() => $("#authEmail").focus(), 50);
  }

  function hideAuth() {
    $("#authOverlay").hidden = true;
  }

  function clearAuth() {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(EMAIL_KEY);
    } catch {}
    state.token = "";
    state.email = "";
    updateAuthUI();
  }

  function updateAuthUI() {
    $("#loginMenuBtn").hidden = !!state.token;
    $("#logoutBtn").hidden = !state.token;
  }

  function logout() {
    if (state.sending) return;
    clearAuth();
    showAuth("");
    closeSidebar();
  }

  async function authRequest(action, email, password) {
    let res;
    try {
      res = await fetch("/.netlify/functions/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, email, password }),
      });
    } catch {
      throw { key: "errAuthNetwork" };
    }
    let data = null;
    try { data = await res.json(); } catch {}
    if (res.ok) return data || {};
    if (res.status === 409) throw { key: "errEmailExists" };
    if (res.status === 401) throw { key: action === "admin" ? "adminWrongPass" : "errInvalidCred" };
    if (res.status === 400) {
      if (data && data.error === "weak_password") throw { key: "errWeakPass" };
      if (data && data.error === "invalid_email") throw { key: "errInvalidEmail" };
      throw { key: "errGeneric" };
    }
    if (res.status === 500) throw { key: "errStorage" };
    throw { key: "errGeneric" };
  }

  function submitAuth(e) {
    e.preventDefault();
    const email = $("#authEmail").value.trim();
    const password = $("#authPass").value;
    if (!email || !password) return;
    const btn = $("#authSubmit");
    btn.disabled = true;
    authRequest(authMode, email, password)
      .then((data) => {
        state.token = data.token || "";
        state.email = data.email || email;
        try {
          localStorage.setItem(TOKEN_KEY, state.token);
          localStorage.setItem(EMAIL_KEY, state.email);
        } catch {}
        hideAuth();
        updateAuthUI();
        $("#authEmail").value = "";
        $("#authPass").value = "";
        $("#input").focus();
      })
      .catch((err) => {
        showAuthError(t(err.key || "errGeneric"));
      })
      .finally(() => {
        btn.disabled = false;
      });
  }

  function showAdminView() {
    $("#authView").hidden = true;
    $("#adminView").hidden = false;
    $("#adminResult").hidden = true;
    $("#adminError").hidden = true;
    $("#adminPass").value = "";
    setTimeout(() => $("#adminPass").focus(), 50);
  }

  function submitAdmin(e) {
    e.preventDefault();
    const password = $("#adminPass").value;
    if (!password) return;
    const btn = $("#adminForm").querySelector("button[type=submit]");
    btn.disabled = true;
    authRequest("admin", "", password)
      .then((data) => {
        renderAdminResult(data);
        $("#adminPass").value = "";
      })
      .catch((err) => {
        $("#adminError").hidden = false;
        $("#adminError").textContent = t(err.key || "errGeneric");
        $("#adminResult").hidden = true;
      })
      .finally(() => {
        btn.disabled = false;
      });
  }

  function renderAdminResult(data) {
    $("#adminError").hidden = true;
    const wrap = $("#adminResult");
    wrap.hidden = false;
    wrap.innerHTML = "";
    const users = Array.isArray(data.users) ? data.users : [];
    wrap.appendChild(el("p", "admin-count", `${t("adminCount")} ${users.length}`));
    if (users.length === 0) {
      wrap.appendChild(el("p", "admin-empty", t("adminEmpty")));
      return;
    }
    const list = el("ul", "admin-list");
    for (const u of users) {
      const item = el("li", "admin-item");
      const mail = el("div", "admin-mail", String(u.email || ""));
      const date = el("div", "admin-date", String(u.created_at ? new Date(u.created_at).toLocaleString(state.lang === "tr" ? "tr-TR" : "en-US") : ""));
      item.appendChild(mail);
      item.appendChild(date);
      list.appendChild(item);
    }
    wrap.appendChild(list);
    const dl = el("button", "admin-download", t("adminDownload"));
    dl.type = "button";
    dl.addEventListener("click", () => {
      const txt = typeof data.txt === "string" ? data.txt : "";
      if (!txt) return;
      const blob = new Blob(["\ufeff" + txt], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "neco-kullanicilar.txt";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    });
    wrap.appendChild(dl);
  }

  /* ---------- Olaylar ---------- */

  function bindEvents() {
    $("#newChatBtn").addEventListener("click", () => {
      if (state.sending) return;
      state.activeId = null;
      renderChatList();
      renderActiveChat();
      closeSidebar();
      $("#input").focus();
    });

    $("#clearAllBtn").addEventListener("click", () => {
      if (state.chats.length === 0) return;
      askClearAll();
    });

    $("#menuBtn").addEventListener("click", openSidebar);
    $("#sidebarClose").addEventListener("click", closeSidebar);
    $("#sidebarOverlay").addEventListener("click", closeSidebar);

    $$(".lang-btn").forEach((b) => b.addEventListener("click", () => setLanguage(b.dataset.lang)));

    const input = $("#input");
    input.addEventListener("input", () => { autosize(); updateSendUI(); });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey && !e.isComposing) {
        e.preventDefault();
        sendMessage(input.value);
      }
    });

    $("#composer").addEventListener("submit", (e) => {
      e.preventDefault();
      sendMessage(input.value);
    });

    $("#attachBtn").addEventListener("click", () => $("#fileInput").click());
    $("#fileInput").addEventListener("change", (e) => handleFiles(e.target.files));

    $("#stopBtn").addEventListener("click", () => {
      if (state.abort) state.abort.abort();
    });

    $("#logoutBtn").addEventListener("click", logout);
    $("#loginMenuBtn").addEventListener("click", () => {
      closeSidebar();
      showAuth("");
    });

    $("#loginTab").addEventListener("click", () => setAuthMode("login"));
    $("#registerTab").addEventListener("click", () => setAuthMode("register"));
    $("#authForm").addEventListener("submit", submitAuth);
    $("#adminLink").addEventListener("click", showAdminView);
    $("#adminBack").addEventListener("click", () => {
      $("#adminView").hidden = true;
      $("#authView").hidden = false;
      showAuthError("");
      setTimeout(() => $("#authEmail").focus(), 50);
    });
    $("#adminForm").addEventListener("submit", submitAdmin);

    const previewOverlay = $("#previewOverlay");
    $("#previewClose").addEventListener("click", closeHtmlPreview);
    $("#previewOpen").addEventListener("click", () => {
      if (state.previewUrl) window.open(state.previewUrl, "_blank");
    });
    previewOverlay.addEventListener("click", (e) => {
      if (e.target === previewOverlay) closeHtmlPreview();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !previewOverlay.hidden) closeHtmlPreview();
    });

    messagesEl.addEventListener("click", async (e) => {
      const htmlBtn = e.target.closest(".html-preview-btn, .html-download-btn");
      if (htmlBtn) {
        const block = htmlBtn.closest(".code-block");
        const code = block ? block.querySelector("pre code") : null;
        if (!code) return;
        if (htmlBtn.classList.contains("html-preview-btn")) {
          openHtmlPreview(code.textContent);
        } else {
          const url = URL.createObjectURL(new Blob([code.textContent], { type: "text/html;charset=utf-8" }));
          const a = document.createElement("a");
          a.href = url;
          a.download = "neco-sayfa.html";
          document.body.appendChild(a);
          a.click();
          a.remove();
          setTimeout(() => URL.revokeObjectURL(url), 4000);
        }
        return;
      }
      const btn = e.target.closest(".copy-btn");
      if (!btn) return;
      const block = btn.closest(".code-block");
      const code = block ? block.querySelector("pre code") : null;
      if (!code) return;
      await copyText(code.textContent);
      btn.classList.add("copied");
      btn.innerHTML = ICONS.check + `<span>${t("copied")}</span>`;
      setTimeout(() => {
        btn.classList.remove("copied");
        btn.innerHTML = ICONS.copy + `<span>${t("copy")}</span>`;
      }, 1600);
    });

    window.addEventListener("resize", () => scrollToBottom(true));
  }

  /* ---------- Başlat ---------- */

  function init() {
    loadState();
    bindEvents();
    applyLanguage();
    autosize();
    updateSendUI();
    hideAuth();
    updateAuthUI();
    requestAnimationFrame(() => scrollToBottom(true));
  }

  init();
})();
