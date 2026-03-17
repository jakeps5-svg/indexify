const BREVO_API_KEY = process.env.BREVO_API_KEY ?? "";
const SENDER_NAME = "Indexify";
const SENDER_EMAIL = "support@indexify.co.za";
const CC_EMAIL = "info@fortunedesign.co.za";

async function sendEmail(opts: {
  to: { email: string; name?: string }[];
  cc?: { email: string }[];
  replyTo?: { email: string; name?: string };
  subject: string;
  html: string;
}) {
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": BREVO_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: { name: SENDER_NAME, email: SENDER_EMAIL },
      to: opts.to,
      cc: opts.cc,
      replyTo: opts.replyTo,
      subject: opts.subject,
      htmlContent: opts.html,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Brevo API error ${res.status}: ${body}`);
  }
}

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

  await sendEmail({
    to: [{ email: opts.to, name: opts.name }],
    cc: [{ email: CC_EMAIL }],
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
            <h1 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#0f172a;">You're in!</h1>
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

  await sendEmail({
    to: [{ email: opts.to, name: opts.name }],
    cc: [{ email: CC_EMAIL }],
    subject,
    html,
  });
}

export async function sendContactEmail(opts: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  reason?: string;
  message: string;
}) {
  const subject = `Contact Form: ${opts.reason ?? "General Enquiry"} — ${opts.name}`;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);max-width:600px;width:100%;">
        <tr>
          <td style="background:linear-gradient(135deg,#0ea5c8,#0284a7);padding:28px 40px;text-align:center;">
            <table cellpadding="0" cellspacing="0" style="margin:0 auto 10px;">
              <tr>
                <td style="padding-right:16px;vertical-align:middle;">
                  <img src="https://indexify.co.za/indexify-logo.png" alt="Indexify" width="110" style="display:block;height:auto;filter:brightness(0) invert(1);" />
                </td>
                <td style="padding-right:16px;vertical-align:middle;color:rgba(255,255,255,0.4);font-size:20px;">·</td>
                <td style="vertical-align:middle;">
                  <img src="https://indexify.co.za/images/fortune-design-logo.png" alt="Fortune Design" width="36" height="36" style="display:block;border-radius:50%;" />
                </td>
              </tr>
            </table>
            <div style="color:rgba(255,255,255,0.8);font-size:12px;">New Contact Form Submission</div>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 40px;">
            <h2 style="margin:0 0 4px;font-size:20px;font-weight:800;color:#0f172a;">${opts.reason ?? "General Enquiry"}</h2>
            <p style="margin:0 0 24px;color:#64748b;font-size:14px;">Submitted via indexify.co.za/contact</p>

            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:10px;padding:20px;margin-bottom:20px;">
              <tr><td style="padding:6px 0;font-size:13px;color:#475569;"><strong style="color:#0f172a;display:inline-block;width:100px;">Name:</strong> ${opts.name}</td></tr>
              <tr><td style="padding:6px 0;font-size:13px;color:#475569;"><strong style="color:#0f172a;display:inline-block;width:100px;">Email:</strong> <a href="mailto:${opts.email}" style="color:#0ea5c8;">${opts.email}</a></td></tr>
              <tr><td style="padding:6px 0;font-size:13px;color:#475569;"><strong style="color:#0f172a;display:inline-block;width:100px;">Phone:</strong> ${opts.phone || "—"}</td></tr>
              <tr><td style="padding:6px 0;font-size:13px;color:#475569;"><strong style="color:#0f172a;display:inline-block;width:100px;">Company:</strong> ${opts.company || "—"}</td></tr>
            </table>

            <div style="background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:16px;margin-bottom:20px;">
              <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;margin-bottom:8px;">Message</div>
              <p style="margin:0;font-size:14px;color:#334155;line-height:1.7;">${opts.message.replace(/\n/g, "<br>")}</p>
            </div>

            <a href="mailto:${opts.email}" style="display:inline-block;padding:12px 24px;background:#0ea5c8;color:#fff;border-radius:10px;font-weight:700;font-size:13px;text-decoration:none;">Reply to ${opts.name}</a>
          </td>
        </tr>
        <tr>
          <td style="background:#f1f5f9;padding:16px 40px;text-align:center;border-top:1px solid #e2e8f0;">
            <p style="margin:0;font-size:11px;color:#94a3b8;">Indexify · indexify.co.za</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  // Internal notification to the team
  await sendEmail({
    to: [{ email: SENDER_EMAIL }],
    cc: [{ email: CC_EMAIL }],
    replyTo: { email: opts.email, name: opts.name },
    subject,
    html,
  });

  // Client confirmation email
  const confirmHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);max-width:600px;width:100%;">

        <tr>
          <td style="background:linear-gradient(135deg,#0ea5c8,#0284a7);padding:28px 40px;text-align:center;">
            <table cellpadding="0" cellspacing="0" style="margin:0 auto 10px;">
              <tr>
                <td style="padding-right:16px;vertical-align:middle;">
                  <img src="https://indexify.co.za/indexify-logo.png" alt="Indexify" width="110" style="display:block;height:auto;filter:brightness(0) invert(1);" />
                </td>
                <td style="padding-right:16px;vertical-align:middle;color:rgba(255,255,255,0.4);font-size:20px;">·</td>
                <td style="vertical-align:middle;">
                  <img src="https://indexify.co.za/images/fortune-design-logo.png" alt="Fortune Design" width="36" height="36" style="display:block;border-radius:50%;" />
                </td>
              </tr>
            </table>
            <div style="color:rgba(255,255,255,0.8);font-size:12px;">indexify.co.za · Powered by Fortune Design</div>
          </td>
        </tr>

        <tr>
          <td style="padding:40px 40px 32px;">
            <h1 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#0f172a;">We received your message!</h1>
            <p style="margin:0 0 24px;color:#64748b;font-size:15px;line-height:1.6;">
              Hi ${opts.name}, thanks for reaching out. We've received your enquiry and will get back to you within <strong>1 business hour</strong>.
            </p>

            <div style="background:#f0f9ff;border:2px solid #bae6fd;border-radius:12px;padding:20px;margin-bottom:28px;">
              <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#0ea5c8;margin-bottom:10px;">Your message summary</div>
              <p style="margin:0 0 8px;font-size:13px;color:#475569;"><strong>Subject:</strong> ${opts.reason ?? "General Enquiry"}</p>
              <p style="margin:0;font-size:13px;color:#475569;line-height:1.6;">${opts.message.replace(/\n/g, "<br>")}</p>
            </div>

            <p style="margin:0 0 16px;color:#64748b;font-size:14px;line-height:1.6;">
              In the meantime, feel free to reach us directly:
            </p>
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding-right:12px;">
                  <a href="https://wa.me/27760597724" style="display:inline-block;padding:10px 20px;background:#25D366;color:#fff;border-radius:10px;font-weight:700;font-size:13px;text-decoration:none;">WhatsApp Us</a>
                </td>
                <td>
                  <a href="mailto:support@indexify.co.za" style="display:inline-block;padding:10px 20px;background:#0ea5c8;color:#fff;border-radius:10px;font-weight:700;font-size:13px;text-decoration:none;">Email Us</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td style="background:#f1f5f9;padding:20px 40px;text-align:center;border-top:1px solid #e2e8f0;">
            <p style="margin:0;font-size:12px;color:#94a3b8;">Indexify (Pty) Ltd &middot; indexify.co.za</p>
            <p style="margin:4px 0 0;font-size:12px;color:#94a3b8;">Powered by Fortune Design &middot; fortunedesign.co.za</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  await sendEmail({
    to: [{ email: opts.email, name: opts.name }],
    cc: [{ email: CC_EMAIL }],
    subject: `We received your message — Indexify`,
    html: confirmHtml,
  });
}

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

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.07);max-width:560px;width:100%;">
        <tr>
          <td style="background:#0f172a;padding:24px 32px;">
            <div style="font-size:13px;font-weight:700;color:#0ea5c8;text-transform:uppercase;letter-spacing:2px;">New Payment Received</div>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td style="padding:6px 0;font-size:13px;color:#475569;border-bottom:1px solid #f1f5f9;"><strong style="color:#0f172a;display:inline-block;width:110px;">Service:</strong> ${opts.service}</td></tr>
              <tr><td style="padding:6px 0;font-size:13px;color:#475569;border-bottom:1px solid #f1f5f9;"><strong style="color:#0f172a;display:inline-block;width:110px;">Amount:</strong> ${opts.amountPaid}</td></tr>
              <tr><td style="padding:6px 0;font-size:13px;color:#475569;border-bottom:1px solid #f1f5f9;"><strong style="color:#0f172a;display:inline-block;width:110px;">Name:</strong> ${opts.name}</td></tr>
              <tr><td style="padding:6px 0;font-size:13px;color:#475569;border-bottom:1px solid #f1f5f9;"><strong style="color:#0f172a;display:inline-block;width:110px;">Email:</strong> ${opts.email}</td></tr>
              <tr><td style="padding:6px 0;font-size:13px;color:#475569;border-bottom:1px solid #f1f5f9;"><strong style="color:#0f172a;display:inline-block;width:110px;">Phone:</strong> ${opts.phone ?? "—"}</td></tr>
              <tr><td style="padding:6px 0;font-size:13px;color:#475569;border-bottom:1px solid #f1f5f9;"><strong style="color:#0f172a;display:inline-block;width:110px;">Company:</strong> ${opts.company ?? "—"}</td></tr>
              <tr><td style="padding:6px 0;font-size:13px;color:#475569;border-bottom:1px solid #f1f5f9;"><strong style="color:#0f172a;display:inline-block;width:110px;">Domain:</strong> ${opts.domain ?? "—"}</td></tr>
              ${opts.token ? `<tr><td style="padding:6px 0;font-size:13px;color:#475569;"><strong style="color:#0f172a;display:inline-block;width:110px;">Token:</strong> <span style="font-family:monospace;font-weight:700;">${opts.token}</span></td></tr>` : ""}
            </table>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  await sendEmail({
    to: [{ email: SENDER_EMAIL }],
    cc: [{ email: CC_EMAIL }],
    subject,
    html,
  });
}
