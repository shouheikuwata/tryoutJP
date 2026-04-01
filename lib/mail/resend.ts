import { Resend } from "resend";

function getResend(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[EMAIL] RESEND_API_KEY is not set. Emails will not be sent.");
    // Return a stub that won't crash
    return { emails: { send: async () => ({ data: null, error: null }) } } as unknown as Resend;
  }
  return new Resend(apiKey);
}

interface SendEmailParams {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export async function sendEmail(params: SendEmailParams): Promise<{ success: boolean; error?: string }> {
  try {
    const resend = getResend();
    const from = process.env.EMAIL_FROM || "Beauty Spot <noreply@beautyspot.example>";
    await resend.emails.send({
      from,
      to: params.to,
      subject: params.subject,
      text: params.text,
      html: params.html,
    });
    return { success: true };
  } catch (error) {
    console.error("[EMAIL_SEND_ERROR]", error);
    return { success: false, error: String(error) };
  }
}
