import "server-only";
import { Resend } from "resend";

const NOTIFY_EMAIL = "groverlakshya.25.lg@gmail.com";

interface NotifyReplyParams {
  employeeName: string;
  employeeId: string;
  companyName: string;
  message: string;
  adminUrl: string;
}

/**
 * Emails groverlakshya.25.lg@gmail.com whenever an employee replies in
 * their thread. Requires RESEND_API_KEY and RESEND_FROM_EMAIL to be set —
 * if they're missing, this logs instead of throwing, so local development
 * without email configured still works.
 */
export async function notifyNewReply({
  employeeName,
  employeeId,
  companyName,
  message,
  adminUrl,
}: NotifyReplyParams): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !fromEmail) {
    console.warn(
      "[email] RESEND_API_KEY or RESEND_FROM_EMAIL not set — skipping email notification for reply from",
      employeeName
    );
    return;
  }

  const resend = new Resend(apiKey);

  try {
    await resend.emails.send({
      from: fromEmail,
      to: NOTIFY_EMAIL,
      subject: `New reply from ${employeeName} (${companyName})`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <p style="color:#9C8A4E; text-transform:uppercase; letter-spacing:2px; font-size:12px;">New message</p>
          <h2 style="margin: 4px 0 16px;">${escapeHtml(employeeName)}</h2>
          <p style="color:#666; font-size:13px; margin-bottom: 20px;">
            Employee ID: ${escapeHtml(employeeId)} &middot; ${escapeHtml(companyName)}
          </p>
          <blockquote style="border-left: 3px solid #C9A227; padding-left: 16px; margin: 0 0 24px; font-style: italic; color: #222;">
            ${escapeHtml(message)}
          </blockquote>
          <a href="${adminUrl}" style="display:inline-block; background:#211C2E; color:#fff; padding:10px 20px; border-radius: 999px; text-decoration:none; font-size:14px;">
            Reply in Keepsake
          </a>
        </div>
      `,
    });
  } catch (error) {
    console.error("[email] Failed to send reply notification:", error);
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
