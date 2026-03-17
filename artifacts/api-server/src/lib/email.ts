import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_SENDER_EMAIL ?? "support@indexify.co.za",
    pass: process.env.BREVO_SMTP_KEY,
  },
});

const SENDER_NAME = process.env.BREVO_SENDER_NAME ?? "Indexify";
const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL ?? "support@indexify.co.za";
const CC_EMAIL = "info@fortunedesign.co.za";

export async function sendProposalUnlockEmail(opts: {
  to: string;
  name: string;
  domain: string;
  token: string;
  amountPaid: string;
}) {
  const subject = `Your Indexify Proposal Unlock Token`;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#0ea5c8,#0284a7);padding:36px 40px;text-align:center;">
            <div style="font-size:26px;font-weight:900;letter-spacing:-0.5px;background:linear-gradient(90deg,#e040fb,#7c4dff,#00b8d9);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">indexify.</div>
            <div style="color:rgba(255,255,255,0.8);font-size:13px;margin-top:4px;">indexify.co.za</div>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px 40px 32px;">
            <h1 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#0f172a;">Payment confirmed!</h1>
            <p style="margin:0 0 24px;color:#64748b;font-size:15px;line-height:1.6;">
              Hi ${opts.name}, thank you for your payment of <strong>${opts.amountPaid}</strong>. Your full Google Ads proposal for <strong>${opts.domain}</strong> is ready to unlock.
            </p>

            <!-- Token box -->
            <div style="background:#f0f9ff;border:2px solid #bae6fd;border-radius:12px;padding:24px;text-align:center;margin-bottom:28px;">
              <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#0ea5c8;margin-bottom:8px;">Your Unlock Token</div>
              <div style="font-size:32px;font-weight:900;letter-spacing:6px;color:#0f172a;font-family:'Courier New',monospace;">${opts.token}</div>
              <div style="font-size:12px;color:#94a3b8;margin-top:8px;">Copy this token — you'll need it to unlock your proposal</div>
            </div>

            <!-- How to use -->
            <div style="background:#f8fafc;border-radius:10px;padding:20px;margin-bottom:28px;">
              <div style="font-size:13px;font-weight:700;color:#0f172a;margin-bottom:12px;">How to use your token:</div>
              <ol style="margin:0;padding-left:20px;color:#475569;font-size:13px;line-height:1.8;">
                <li>Visit <a href="https://indexify.co.za/ads-audit" style="color:#0ea5c8;">indexify.co.za/ads-audit</a></li>
                <li>Generate your Google Ads proposal</li>
                <li>Click <strong>"Enter Code"</strong> in the unlock section</li>
                <li>Paste your token: <strong style="font-family:monospace;">${opts.token}</strong></li>
                <li>Your full proposal will unlock immediately</li>
              </ol>
            </div>

            <p style="margin:0;color:#94a3b8;font-size:13px;line-height:1.6;">
              Questions? Reply to this email or WhatsApp us at <a href="https://wa.me/27760597724" style="color:#0ea5c8;">+27 76 059 7724</a>
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f1f5f9;padding:20px 40px;text-align:center;border-top:1px solid #e2e8f0;">
            <p style="margin:0;font-size:12px;color:#94a3b8;">Indexify (Pty) Ltd &middot; indexify.co.za</p>
            <p style="margin:4px 0 0;font-size:12px;color:#94a3b8;">Payment processed securely by Yoco</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  await transporter.sendMail({
    from: `"${SENDER_NAME}" <${SENDER_EMAIL}>`,
    to: `"${opts.name}" <${opts.to}>`,
    cc: CC_EMAIL,
    subject,
    html,
  });
}

export async function sendServicePurchaseEmail(opts: {
  to: string;
  name: string;
  service: string;
  amountPaid: string;
  phone?: string;
  company?: string;
}) {
  const subject = `Welcome to Indexify — ${opts.service}`;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);max-width:600px;width:100%;">

        <tr>
          <td style="background:linear-gradient(135deg,#0ea5c8,#0284a7);padding:36px 40px;text-align:center;">
            <div style="font-size:26px;font-weight:900;letter-spacing:-0.5px;background:linear-gradient(90deg,#e040fb,#7c4dff,#00b8d9);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">indexify.</div>
            <div style="color:rgba(255,255,255,0.8);font-size:13px;margin-top:4px;">indexify.co.za</div>
          </td>
        </tr>

        <tr>
          <td style="padding:40px 40px 32px;">
            <h1 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#0f172a;">You're in! 🎉</h1>
            <p style="margin:0 0 24px;color:#64748b;font-size:15px;line-height:1.6;">
              Hi ${opts.name}, your payment of <strong>${opts.amountPaid}</strong> for the <strong>${opts.service}</strong> package has been confirmed. Welcome to Indexify!
            </p>

            <div style="background:#f0fdf4;border:2px solid #bbf7d0;border-radius:12px;padding:20px;margin-bottom:28px;">
              <div style="font-size:13px;font-weight:700;color:#166534;margin-bottom:12px;">What happens next:</div>
              <ul style="margin:0;padding-left:20px;color:#166534;font-size:13px;line-height:2;">
                <li>Our team will contact you within <strong>1 business day</strong></li>
                <li>We'll schedule your onboarding strategy call</li>
                <li>Campaign setup begins immediately after onboarding</li>
              </ul>
            </div>

            <p style="margin:0;color:#94a3b8;font-size:13px;">
              Questions? WhatsApp us at <a href="https://wa.me/27760597724" style="color:#0ea5c8;">+27 76 059 7724</a>
            </p>
          </td>
        </tr>

        <tr>
          <td style="background:#f1f5f9;padding:20px 40px;text-align:center;border-top:1px solid #e2e8f0;">
            <p style="margin:0;font-size:12px;color:#94a3b8;">Indexify (Pty) Ltd &middot; indexify.co.za</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  await transporter.sendMail({
    from: `"${SENDER_NAME}" <${SENDER_EMAIL}>`,
    to: `"${opts.name}" <${opts.to}>`,
    cc: CC_EMAIL,
    subject,
    html,
  });
}

// Internal notification to Indexify
export async function sendInternalNotification(opts: {
  service: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  domain?: string;
  amountPaid: string;
  token?: string;
}) {
  const subject = `New Payment: ${opts.service} — ${opts.name}`;
  const text = `
New payment received!

Service: ${opts.service}
Amount: ${opts.amountPaid}
Name: ${opts.name}
Email: ${opts.email}
Phone: ${opts.phone ?? "—"}
Company: ${opts.company ?? "—"}
Domain: ${opts.domain ?? "—"}
Token: ${opts.token ?? "—"}
  `.trim();

  await transporter.sendMail({
    from: `"${SENDER_NAME}" <${SENDER_EMAIL}>`,
    to: [SENDER_EMAIL, CC_EMAIL],
    subject,
    text,
  });
}
