import nodemailer from "nodemailer";

export type MailEnvConfig = {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
};

/** Sandi App Password Gmail sering memuat spasi; tanpa tanda kutip .env bisa terpotong — normalisasi aman untuk SMTP. */
function normalizeSmtpPassword(raw: string): string {
  return raw.replace(/\s+/g, "");
}

export function getMailEnv(): MailEnvConfig {
  const host = process.env.SMTP_HOST?.trim();
  const portRaw = process.env.SMTP_PORT?.trim();
  const user = process.env.SMTP_USER?.trim();
  const passRaw =
    process.env.SMTP_PASSWORD ?? process.env.SMTP_PASS ?? "";
  const pass = normalizeSmtpPassword(passRaw.trim());
  // SMTP_FROM diprioritaskan agar selaras dengan blok SMTP_USER / Gmail "Send mail as"
  const from =
    process.env.SMTP_FROM?.trim() ??
    process.env.EMAIL_FROM?.trim() ??
    user;

  if (!host || !user || !pass || !from) {
    throw new Error(
      "Variabel SMTP_HOST, SMTP_USER, SMTP_PASSWORD (atau SMTP_PASS), dan SMTP_FROM (atau EMAIL_FROM) wajib diisi di .env",
    );
  }

  const port = portRaw ? Number.parseInt(portRaw, 10) : 587;
  if (Number.isNaN(port)) {
    throw new Error("SMTP_PORT harus berupa angka");
  }

  return { host, port, user, pass, from };
}

/** Default true (aman). Set false hanya jika TLS diputus oleh proxy/sertifikat internal — kurangi risiko MITM. */
function tlsRejectUnauthorizedFromEnv(): boolean {
  const raw = process.env.SMTP_TLS_REJECT_UNAUTHORIZED?.trim().toLowerCase();
  if (raw === "false" || raw === "0" || raw === "no") return false;
  return true;
}

/** Keluarga alamat untuk koneksi TCP ke SMTP (mencegah ECONNREFUSED ke IPv6 saat rute IPv6 putus). */
function getSmtpSocketFamily(): 4 | 6 | undefined {
  const raw = process.env.SMTP_IP_FAMILY?.trim().toLowerCase();
  if (raw === "6" || raw === "ipv6") return 6;
  if (raw === "4" || raw === "ipv4") return 4;
  if (raw === "auto" || raw === "0" || raw === "") return undefined;
  // Default: IPv4 — banyak host SMTP/DNS mengembalikan AAAA yang ditolak dari jaringan klien.
  return 4;
}

export function createTransportFromEnv() {
  const { host, port, user, pass } = getMailEnv();

  // 465 = SMTPS (TLS langsung). 587 = STARTTLS — harus secure: false + requireTLS.
  // SMTP_SECURE=true pada port 587 menyebabkan koneksi salah; jangan gabungkan keduanya.
  const secure = port === 465;
  const requireTLS = port === 587;

  const family = getSmtpSocketFamily();
  const rejectUnauthorized = tlsRejectUnauthorizedFromEnv();

  return nodemailer.createTransport({
    host,
    port,
    secure,
    ...(requireTLS ? { requireTLS: true } : {}),
    auth: { user, pass },
    ...(family !== undefined ? { family } : {}),
    ...(!rejectUnauthorized
      ? {
          tls: {
            rejectUnauthorized: false,
          },
        }
      : {}),
  });
}
