"use client";

import { useEffect, useState } from "react";

export default function ExportPage() {
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    s.async = true;
    s.onload = () => setReady(true);
    document.body.appendChild(s);
  }, []);

  useEffect(() => {
    if (!ready) return;

    // @ts-ignore
    if (!window.turnstile) return;

    // @ts-ignore
    window.turnstile.render("#cf-turnstile", {
      sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
      callback: (t: string) => setToken(t),
      "expired-callback": () => setToken(null),
      "error-callback": () => setToken(null),
    });
  }, [ready]);

  async function requestExport() {
    setMsg("Verifying…");
    const res = await fetch("/api/verify-turnstile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    const data = await res.json();
    if (!data.success) {
      setMsg("Verification failed. Please try again.");
      return;
    }

    setMsg("Verified ✅ (next: run export)");
  }

  return (
    <main style={{ padding: 24, fontFamily: "system-ui", maxWidth: 760 }}>
      <h1>Export</h1>
      <p>Human verification is required before export actions.</p>

      <div id="cf-turnstile" />

      <button
        onClick={requestExport}
        disabled={!token}
        style={{ marginTop: 12, padding: "10px 14px" }}
      >
        Request export
      </button>

      {msg && <p style={{ marginTop: 12 }}>{msg}</p>}
    </main>
  );
}
