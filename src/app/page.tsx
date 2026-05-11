import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-4 py-16 dark:bg-black">
      <main className="flex w-full max-w-xl flex-col items-stretch gap-6 rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-10">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Pengirim email SMTP
          </h1>
          <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Aplikasi sederhana untuk mengirim email melalui SMTP yang
            dikonfigurasi dari berkas{" "}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
              .env
            </code>
            . Buka halaman kirim untuk mulai mengirim pesan.
          </p>
        </div>
        <Link
          href="/kirim"
          className="inline-flex h-11 items-center justify-center rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Buka halaman kirim email
        </Link>
      </main>
    </div>
  );
}
