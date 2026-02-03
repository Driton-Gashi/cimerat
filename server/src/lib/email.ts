import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT) || 587;
const SMTP_SECURE = process.env.SMTP_SECURE === 'true';
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const MAIL_FROM = process.env.MAIL_FROM || SMTP_USER || 'noreply@cimerat.app';

/** From address for sending: use display name "Cimerat" if MAIL_FROM is a plain email */
function getFromAddress(): string {
   if (!MAIL_FROM) return 'Cimerat <noreply@cimerat.app>';
   if (/^[^<]+<[^>]+>$/.test(MAIL_FROM.trim())) return MAIL_FROM.trim();
   return `Cimerat <${MAIL_FROM}>`;
}

export function isEmailConfigured(): boolean {
   return !!(SMTP_HOST && SMTP_USER && SMTP_PASS);
}

function buildInviteEmailContent(
   inviteLink: string,
   apartmentName?: string,
   inviterName?: string,
): { subject: string; text: string; html: string } {
   const appName = 'Cimerat';
   const byLine = inviterName ? ` ${inviterName} invited you to join` : " You're invited to join";
   const apartmentLine = apartmentName ? ` the apartment "${apartmentName}"` : ' an apartment';
   const subject = apartmentName
      ? `You're invited to join ${apartmentName} on ${appName}`
      : `You're invited to join an apartment on ${appName}`;

   const text =
      `Hi,\n\n${byLine}${apartmentLine} on ${appName}.\n\n` +
      `Use this link to accept (valid 7 days):\n${inviteLink}\n\n` +
      `If you don't have an account yet, you can create one using this email address when you open the link.\n\n` +
      `— ${appName}`;

   const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin:0; padding:0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f6fa;">
  <div style="max-width: 520px; margin: 0 auto; padding: 32px 24px;">
    <div style="background: #fff; border-radius: 12px; padding: 32px; box-shadow: 0 2px 12px rgba(0,0,0,0.06);">
      <h1 style="margin: 0 0 8px; font-size: 1.25rem; color: #202224;">You're invited</h1>
      <p style="margin: 0 0 24px; color: #606060; font-size: 1rem; line-height: 1.5;">
        ${inviterName ? `<strong>${escapeHtml(inviterName)}</strong> invited you to join` : 'You\'re invited to join'}
        ${apartmentName ? ` the apartment <strong>${escapeHtml(apartmentName)}</strong>` : ' an apartment'} on Cimerat.
      </p>
      <p style="margin: 0 0 24px; color: #606060; font-size: 0.9375rem;">
        Click the button below to accept. This link is valid for 7 days.
      </p>
      <p style="margin: 0 0 24px;">
        <a href="${escapeHtml(inviteLink)}" style="display: inline-block; padding: 12px 24px; background: #4880ff; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 1rem;">Accept invite</a>
      </p>
      <p style="margin: 0; color: #909090; font-size: 0.8125rem;">
        If you don't have an account, you can create one when you open the link.
      </p>
      <p style="margin: 24px 0 0; color: #909090; font-size: 0.8125rem;">
        — Cimerat
      </p>
    </div>
  </div>
</body>
</html>`.trim();

   return { subject, text, html };
}

function escapeHtml(s: string): string {
   return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
}

export async function sendInviteEmail(
   to: string,
   inviteLink: string,
   apartmentName?: string,
   inviterName?: string,
): Promise<{ success: boolean; error?: string }> {
   if (!isEmailConfigured()) {
      return { success: false, error: 'Email is not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS in .env.' };
   }
   try {
      const transporter = nodemailer.createTransport({
         host: SMTP_HOST,
         port: SMTP_PORT,
         secure: SMTP_SECURE,
         auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
         },
      });
      const { subject, text, html } = buildInviteEmailContent(inviteLink, apartmentName, inviterName);
      await transporter.sendMail({
         from: getFromAddress(),
         to,
         subject,
         text,
         html,
      });
      return { success: true };
   } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send email.';
      console.error('Send invite email error:', err);
      return { success: false, error: message };
   }
}
