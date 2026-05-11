import { NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '')

// Jika pakai regional EU subuser, uncomment ini:
// sgMail.setDataResidency('eu');

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { to, subject, text, html } = body

    if (!to || !subject || (!text && !html)) {
      return NextResponse.json(
        { error: 'Field to, subject, dan text/html wajib diisi' },
        { status: 400 }
      )
    }

    const msg = {
      to,
      from: process.env.SENDGRID_FROM_EMAIL || 'admin@datalink-analysis.com',
      subject,
      text: text || '',
      html: html || '',
    }

    await sgMail.send(msg)

    return NextResponse.json({ message: 'Email sent' }, { status: 200 })
  } catch (error: any) {
    console.error('SendGrid error:', error?.response?.body || error)
    return NextResponse.json(
      { error: 'Gagal mengirim email', detail: error?.message || 'Unknown error' },
      { status: 500 }
    )
  }
}
