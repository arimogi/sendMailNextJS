"use client";

import { useState } from "react";

export function EmailForm() {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [text, setText] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage(null);

    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, subject, text }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Permintaan gagal.");
        return;
      }

      setStatus("success");
      setMessage("Email berhasil dikirim.");
      setTo("");
      setSubject("");
      setText("");
    } catch {
      setStatus("error");
      setMessage("Tidak dapat menghubungi server.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-lg flex-col gap-5"
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="to" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Kepada
        </label>
        <input
          id="to"
          name="to"
          type="email"
          required
          autoComplete="email"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="penerima@contoh.com"
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-900 outline-none ring-zinc-950/10 placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="subject"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Subjek
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          required
          maxLength={200}
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Judul email"
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-900 outline-none ring-zinc-950/10 placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="text"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Pesan
        </label>
        <textarea
          id="text"
          name="text"
          required
          rows={8}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Isi pesan (teks biasa)"
          className="resize-y rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-900 outline-none ring-zinc-950/10 placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500"
        />
      </div>

      {message ? (
        <p
          role="status"
          className={
            status === "success"
              ? "text-sm text-emerald-700 dark:text-emerald-400"
              : "text-sm text-red-600 dark:text-red-400"
          }
        >
          {message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex h-11 items-center justify-center rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {status === "loading" ? "Mengirim…" : "Kirim email"}
      </button>
    </form>
  );
}
