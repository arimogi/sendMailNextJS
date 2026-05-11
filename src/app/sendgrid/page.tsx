"use client";

import { useState } from "react";

type SendResponse = {
  message?: string;
  error?: string;
  detail?: string;
};

export default function SendEmailPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleSend = async () => {
    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: "arimogi@gmail.com",
          subject: "Sending with SendGrid is Fun",
          text: "and easy to do anywhere, even with Next.js",
          html: "<strong>and easy to do anywhere, even with Next.js</strong>",
        }),
      });

      // Respons bisa berupa HTML (mis. halaman 404) — parse defensif agar pesan errornya berguna.
      const raw = await res.text();
      const contentType = res.headers.get("content-type") ?? "";
      let data: SendResponse | null = null;
      if (contentType.includes("application/json")) {
        try {
          data = JSON.parse(raw) as SendResponse;
        } catch {
          data = null;
        }
      }

      if (!res.ok) {
        const detail =
          data?.error ??
          data?.detail ??
          (raw ? raw.slice(0, 200) : res.statusText);
        throw new Error(`HTTP ${res.status} - ${detail}`);
      }

      setResult(data?.message ?? "Berhasil");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setResult(`Error: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: 24 }}>
      <h1>Send Email via SendGrid</h1>
      <button onClick={handleSend} disabled={loading}>
        {loading ? "Sending..." : "Send Email"}
      </button>
      {result && <p style={{ marginTop: 12 }}>{result}</p>}
    </main>
  );
}
