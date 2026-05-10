import { NextResponse } from "next/server";
import { createTransportFromEnv, getMailEnv } from "@/lib/mail";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Body = {
  to?: string;
  subject?: string;
  text?: string;
};

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json(
      { error: "Body JSON tidak valid." },
      { status: 400 },
    );
  }

  const to = body.to?.trim();
  const subject = body.subject?.trim();
  const text = body.text?.trim();

  if (!to || !subject || !text) {
    return NextResponse.json(
      { error: "Field ke, subjek, dan pesan wajib diisi." },
      { status: 400 },
    );
  }

  if (!emailRegex.test(to)) {
    return NextResponse.json(
      { error: "Alamat email penerima tidak valid." },
      { status: 400 },
    );
  }

  if (subject.length > 200) {
    return NextResponse.json(
      { error: "Subjek terlalu panjang (maks. 200 karakter)." },
      { status: 400 },
    );
  }

  try {
    const { from } = getMailEnv();
    const transporter = createTransportFromEnv();
    await transporter.sendMail({
      from,
      to,
      subject,
      text,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/send]", err);
    const message =
      err instanceof Error ? err.message : "Gagal mengirim email.";
    const isConfig = message.includes("Variabel SMTP") || message.includes("SMTP_PORT");
    return NextResponse.json(
      { error: isConfig ? message : "Gagal mengirim email. Periksa log server." },
      { status: isConfig ? 503 : 500 },
    );
  }
}
