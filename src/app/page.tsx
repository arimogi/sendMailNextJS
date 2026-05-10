import { EmailForm } from "@/components/EmailForm";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-4 py-16 dark:bg-black">
      <main className="flex w-full max-w-2xl flex-col items-stretch gap-8 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-10">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Kirim email
          </h1>
          <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Pengaturan SMTP diambil dari file lingkungan (misalnya{" "}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
              .env.local
            </code>
            ). Pastikan variabel{" "}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
              SMTP_HOST
            </code>
            ,{" "}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
              SMTP_USER
            </code>
            ,{" "}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
              SMTP_PASSWORD
            </code>{" "}
            (atau{" "}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
              SMTP_PASS
            </code>
            ), dan pengirim{" "}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
              SMTP_FROM
            </code>{" "}
            atau{" "}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
              EMAIL_FROM
            </code>{" "}
            sudah benar. Untuk Gmail port 587 jangan set{" "}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
              SMTP_SECURE=true
            </code>
            .
          </p>
        </div>
        <EmailForm />
      </main>
    </div>
  );
}
