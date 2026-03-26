const BREVO_API_KEY = process.env.BREVO_API_KEY ?? "";
const SENDER_NAME = "Indexify";
const SENDER_EMAIL = "support@indexify.co.za";
const CC_EMAILS = [{ email: "support@indexify.co.za" }, { email: "info@fortunedesign.co.za" }];

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
              Questions? Reply to this email or WhatsApp us at <a href="https://wa.me/27602988295" style="color:#0ea5c8;">+27 60 298 8295</a>
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
    cc: CC_EMAILS,
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
              Questions? WhatsApp us at <a href="https://wa.me/27602988295" style="color:#0ea5c8;">+27 60 298 8295</a>
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
    cc: CC_EMAILS,
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
    cc: CC_EMAILS,
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
                  <a href="https://wa.me/27602988295" style="display:inline-block;padding:10px 20px;background:#25D366;color:#fff;border-radius:10px;font-weight:700;font-size:13px;text-decoration:none;">WhatsApp Us</a>
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
    cc: CC_EMAILS,
    subject: `We received your message — Indexify`,
    html: confirmHtml,
  });
}

export async function sendMeetingRequestEmail(opts: {
  name: string;
  email: string;
  phone: string;
  website?: string;
  date: string;
  time: string;
  platform: "teams" | "meet";
  needs?: string;
}) {
  const platformLabel = opts.platform === "teams" ? "Microsoft Teams" : "Google Meet";
  const platformColor = opts.platform === "teams" ? "#6264A7" : "#1a73e8";

  const agencyHtml = `
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
            <div style="color:rgba(255,255,255,0.8);font-size:12px;">📅 New Meeting Request</div>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 40px;">
            <h2 style="margin:0 0 4px;font-size:20px;font-weight:800;color:#0f172a;">Meeting Request from ${opts.name}</h2>
            <p style="margin:0 0 24px;color:#64748b;font-size:14px;">Submitted via indexify.co.za</p>

            <div style="background:#f0f9ff;border:2px solid ${platformColor};border-radius:12px;padding:16px 20px;margin-bottom:20px;">
              <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:${platformColor};margin-bottom:6px;">Platform Requested</div>
              <div style="font-size:16px;font-weight:800;color:#0f172a;">${platformLabel}</div>
            </div>

            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:10px;padding:20px;margin-bottom:20px;">
              <tr><td style="padding:6px 0;font-size:13px;color:#475569;border-bottom:1px solid #e2e8f0;"><strong style="color:#0f172a;display:inline-block;width:110px;">Name:</strong> ${opts.name}</td></tr>
              <tr><td style="padding:6px 0;font-size:13px;color:#475569;border-bottom:1px solid #e2e8f0;"><strong style="color:#0f172a;display:inline-block;width:110px;">Email:</strong> <a href="mailto:${opts.email}" style="color:#0ea5c8;">${opts.email}</a></td></tr>
              <tr><td style="padding:6px 0;font-size:13px;color:#475569;border-bottom:1px solid #e2e8f0;"><strong style="color:#0f172a;display:inline-block;width:110px;">Phone:</strong> ${opts.phone}</td></tr>
              <tr><td style="padding:6px 0;font-size:13px;color:#475569;border-bottom:1px solid #e2e8f0;"><strong style="color:#0f172a;display:inline-block;width:110px;">Website:</strong> ${opts.website ? `<a href="${opts.website}" style="color:#0ea5c8;">${opts.website}</a>` : "—"}</td></tr>
              <tr><td style="padding:6px 0;font-size:13px;color:#475569;border-bottom:1px solid #e2e8f0;"><strong style="color:#0f172a;display:inline-block;width:110px;">Preferred Date:</strong> ${opts.date}</td></tr>
              <tr><td style="padding:6px 0;font-size:13px;color:#475569;"><strong style="color:#0f172a;display:inline-block;width:110px;">Preferred Time:</strong> ${opts.time}</td></tr>
            </table>

            ${opts.needs ? `
            <div style="background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:16px;margin-bottom:20px;">
              <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;margin-bottom:8px;">Their Needs</div>
              <p style="margin:0;font-size:14px;color:#334155;line-height:1.7;">${opts.needs.replace(/\n/g, "<br>")}</p>
            </div>` : ""}

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

  await sendEmail({
    to: [{ email: SENDER_EMAIL }],
    cc: CC_EMAILS,
    replyTo: { email: opts.email, name: opts.name },
    subject: `Meeting Request: ${opts.name} — ${opts.date} at ${opts.time} (${platformLabel})`,
    html: agencyHtml,
  });

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
            <h1 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#0f172a;">Your meeting request is confirmed!</h1>
            <p style="margin:0 0 24px;color:#64748b;font-size:15px;line-height:1.6;">
              Hi ${opts.name}, we've received your meeting request for <strong>${opts.date} at ${opts.time}</strong>. Our team will review your request and send you a <strong>${platformLabel} link</strong> to <strong>${opts.email}</strong> shortly.
            </p>

            <div style="background:#f0f9ff;border:2px solid #bae6fd;border-radius:12px;padding:20px;margin-bottom:28px;">
              <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#0ea5c8;margin-bottom:12px;">Your Meeting Summary</div>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="padding:5px 0;font-size:13px;color:#475569;"><strong style="color:#0f172a;display:inline-block;width:110px;">Platform:</strong> ${platformLabel}</td></tr>
                <tr><td style="padding:5px 0;font-size:13px;color:#475569;"><strong style="color:#0f172a;display:inline-block;width:110px;">Date:</strong> ${opts.date}</td></tr>
                <tr><td style="padding:5px 0;font-size:13px;color:#475569;"><strong style="color:#0f172a;display:inline-block;width:110px;">Time:</strong> ${opts.time} (SAST)</td></tr>
                ${opts.website ? `<tr><td style="padding:5px 0;font-size:13px;color:#475569;"><strong style="color:#0f172a;display:inline-block;width:110px;">Website:</strong> ${opts.website}</td></tr>` : ""}
              </table>
            </div>

            <div style="background:#f0fdf4;border:2px solid #bbf7d0;border-radius:12px;padding:20px;margin-bottom:28px;">
              <div style="font-size:13px;font-weight:700;color:#166534;margin-bottom:10px;">What happens next:</div>
              <ul style="margin:0;padding-left:20px;color:#166534;font-size:13px;line-height:2;">
                <li>We'll confirm your slot within <strong>1 business hour</strong></li>
                <li>A <strong>${platformLabel} meeting link</strong> will be sent to this email</li>
                <li>Add it to your calendar and we'll chat at the scheduled time</li>
              </ul>
            </div>

            <p style="margin:0 0 16px;color:#64748b;font-size:14px;line-height:1.6;">
              Need to reschedule or have an urgent query? Reach us directly:
            </p>
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding-right:12px;">
                  <a href="https://wa.me/27602988295" style="display:inline-block;padding:10px 20px;background:#25D366;color:#fff;border-radius:10px;font-weight:700;font-size:13px;text-decoration:none;">WhatsApp Us</a>
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
    cc: CC_EMAILS,
    subject: `Meeting Request Confirmed — ${platformLabel} on ${opts.date} at ${opts.time}`,
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
    cc: CC_EMAILS,
    subject,
    html,
  });
}

export async function sendInvoiceEmail(opts: {
  to: string; name: string; invoiceNumber: string;
  description: string; amountRands: string; dueDate: string;
}) {
  const subject = `Invoice ${opts.invoiceNumber} from Indexify — R${opts.amountRands}`;
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.07);">
        <tr><td style="background:linear-gradient(135deg,#0ea5c8,#7c4dff);padding:32px 40px;text-align:center;">
          <div style="font-size:28px;font-weight:900;color:#fff;letter-spacing:-1px;">indexify.</div>
          <div style="color:rgba(255,255,255,0.7);font-size:13px;margin-top:4px;">Powered by Fortune Design</div>
        </td></tr>
        <tr><td style="padding:40px;">
          <p style="color:#64748b;font-size:15px;">Hi ${opts.name},</p>
          <p style="color:#1e293b;font-size:15px;">Please find your invoice details below.</p>
          <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:12px;padding:24px;margin:24px 0;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td style="color:#64748b;font-size:13px;padding:6px 0;">Invoice Number</td><td style="text-align:right;font-weight:700;color:#1e293b;">${opts.invoiceNumber}</td></tr>
              <tr><td style="color:#64748b;font-size:13px;padding:6px 0;border-top:1px solid #e0f2fe;">Description</td><td style="text-align:right;font-weight:600;color:#1e293b;">${opts.description}</td></tr>
              <tr><td style="color:#64748b;font-size:13px;padding:6px 0;border-top:1px solid #e0f2fe;">Amount Due</td><td style="text-align:right;font-weight:900;color:#0ea5c8;font-size:20px;">R${opts.amountRands}</td></tr>
              <tr><td style="color:#64748b;font-size:13px;padding:6px 0;border-top:1px solid #e0f2fe;">Due Date</td><td style="text-align:right;font-weight:700;color:#dc2626;">${opts.dueDate}</td></tr>
            </table>
          </div>
          <p style="color:#1e293b;font-size:14px;font-weight:700;margin-bottom:8px;">Banking Details — EFT Payment</p>
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin-bottom:20px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td style="color:#64748b;font-size:13px;padding:5px 0;">Bank</td><td style="text-align:right;font-weight:700;color:#1e293b;font-size:13px;">First National Bank (FNB)</td></tr>
              <tr><td style="color:#64748b;font-size:13px;padding:5px 0;border-top:1px solid #e2e8f0;">Account Holder</td><td style="text-align:right;font-weight:700;color:#1e293b;font-size:13px;">Indexify</td></tr>
              <tr><td style="color:#64748b;font-size:13px;padding:5px 0;border-top:1px solid #e2e8f0;">Account Number</td><td style="text-align:right;font-weight:900;color:#0ea5c8;font-size:14px;">63139187181</td></tr>
              <tr><td style="color:#64748b;font-size:13px;padding:5px 0;border-top:1px solid #e2e8f0;">Branch Code</td><td style="text-align:right;font-weight:700;color:#1e293b;font-size:13px;">254005</td></tr>
              <tr><td style="color:#64748b;font-size:13px;padding:5px 0;border-top:1px solid #e2e8f0;">Account Type</td><td style="text-align:right;font-weight:700;color:#1e293b;font-size:13px;">Cheque</td></tr>
              <tr><td style="color:#64748b;font-size:13px;padding:5px 0;border-top:1px solid #e2e8f0;">Reference</td><td style="text-align:right;font-weight:700;color:#1e293b;font-size:13px;">${opts.invoiceNumber}</td></tr>
            </table>
          </div>
          <p style="color:#64748b;font-size:13px;">Please use your invoice number <strong>${opts.invoiceNumber}</strong> as the payment reference. For queries contact us via WhatsApp at <a href="https://wa.me/27602988295" style="color:#0ea5c8;">+27 60 298 8295</a>.</p>
          <p style="color:#64748b;font-size:13px;margin-top:32px;">Regards,<br/><strong style="color:#1e293b;">The Indexify Team</strong><br/>Powered by Fortune Design · fortunedesign.co.za</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
  await sendEmail({
    to: [{ email: opts.to, name: opts.name }],
    cc: CC_EMAILS,
    subject,
    html,
  });
}

export async function sendMeetingRequestFromPortal(opts: {
  name: string; email: string; phone: string;
  preferredDate: string; preferredTime: string;
  meetingType: string; notes: string;
}) {
  const subject = `New Meeting Request from Portal — ${opts.name}`;
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.07);">
        <tr><td style="background:linear-gradient(135deg,#0ea5c8,#7c4dff);padding:28px 40px;">
          <div style="font-size:24px;font-weight:900;color:#fff;">indexify. — Meeting Request</div>
          <div style="color:rgba(255,255,255,0.7);font-size:12px;margin-top:2px;">From the Client Portal</div>
        </td></tr>
        <tr><td style="padding:32px 40px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="padding:8px 0;border-bottom:1px solid #f1f5f9;color:#64748b;font-size:13px;">Client Name</td><td style="padding:8px 0;border-bottom:1px solid #f1f5f9;font-weight:700;">${opts.name}</td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid #f1f5f9;color:#64748b;font-size:13px;">Email</td><td style="padding:8px 0;border-bottom:1px solid #f1f5f9;">${opts.email}</td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid #f1f5f9;color:#64748b;font-size:13px;">Phone</td><td style="padding:8px 0;border-bottom:1px solid #f1f5f9;">${opts.phone || "—"}</td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid #f1f5f9;color:#64748b;font-size:13px;">Date</td><td style="padding:8px 0;border-bottom:1px solid #f1f5f9;font-weight:700;">${opts.preferredDate}</td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid #f1f5f9;color:#64748b;font-size:13px;">Time</td><td style="padding:8px 0;border-bottom:1px solid #f1f5f9;">${opts.preferredTime}</td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid #f1f5f9;color:#64748b;font-size:13px;">Platform</td><td style="padding:8px 0;border-bottom:1px solid #f1f5f9;text-transform:capitalize;">${opts.meetingType.replace("-", " ")}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b;font-size:13px;">Notes</td><td style="padding:8px 0;">${opts.notes || "—"}</td></tr>
          </table>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
  await sendEmail({
    to: CC_EMAILS,
    replyTo: { email: opts.email, name: opts.name },
    subject,
    html,
  });
}

export async function sendPasswordResetEmail(opts: { name: string; email: string; resetLink: string }) {
  const subject = "Reset your Indexify portal password";
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 20px;">
    <tr><td align="center">
      <table width="580" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.07);">
        <tr><td style="background:linear-gradient(135deg,#0ea5c8,#7c4dff);padding:32px 40px;text-align:center;">
          <div style="font-size:28px;font-weight:900;color:#fff;letter-spacing:-1px;">indexify.</div>
          <div style="color:rgba(255,255,255,0.7);font-size:13px;margin-top:4px;">Client Portal</div>
        </td></tr>
        <tr><td style="padding:40px;">
          <p style="color:#64748b;font-size:15px;margin:0 0 12px;">Hi ${opts.name},</p>
          <p style="color:#1e293b;font-size:15px;margin:0 0 24px;">We received a request to reset your Indexify portal password. Click the button below to set a new password. This link expires in <strong>1 hour</strong>.</p>
          <div style="text-align:center;margin:32px 0;">
            <a href="${opts.resetLink}" style="display:inline-block;padding:14px 36px;background:linear-gradient(135deg,#0ea5c8,#7c4dff);color:#fff;border-radius:12px;font-weight:700;font-size:15px;text-decoration:none;letter-spacing:0.2px;">Reset My Password</a>
          </div>
          <p style="color:#94a3b8;font-size:12px;margin:0 0 8px;">Or copy and paste this link into your browser:</p>
          <p style="color:#0ea5c8;font-size:11px;word-break:break-all;margin:0 0 24px;"><a href="${opts.resetLink}" style="color:#0ea5c8;">${opts.resetLink}</a></p>
          <p style="color:#94a3b8;font-size:13px;margin:0;">If you didn't request a password reset, you can safely ignore this email — your password won't change.</p>
          <p style="color:#64748b;font-size:13px;margin-top:32px;">Regards,<br/><strong style="color:#1e293b;">The Indexify Team</strong><br/>Powered by Fortune Design · fortunedesign.co.za</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
  await sendEmail({ to: [{ email: opts.email, name: opts.name }], subject, html });
}

export async function sendWelcomeEmail(opts: { name: string; email: string }) {
  const subject = "Welcome to Indexify — your portal is ready!";
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 20px;">
    <tr><td align="center">
      <table width="580" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.07);">
        <tr><td style="background:linear-gradient(135deg,#0ea5c8,#7c4dff);padding:32px 40px;text-align:center;">
          <div style="font-size:28px;font-weight:900;color:#fff;letter-spacing:-1px;">indexify.</div>
          <div style="color:rgba(255,255,255,0.7);font-size:13px;margin-top:4px;">Welcome aboard!</div>
        </td></tr>
        <tr><td style="padding:40px;">
          <p style="color:#64748b;font-size:15px;margin:0 0 12px;">Hi ${opts.name},</p>
          <p style="color:#1e293b;font-size:15px;margin:0 0 24px;">Your Indexify client portal account has been created. You can now log in to track your services, view invoices, book meetings, and chat with your account manager.</p>
          <div style="text-align:center;margin:32px 0;">
            <a href="https://indexify.co.za/login" style="display:inline-block;padding:14px 36px;background:linear-gradient(135deg,#0ea5c8,#7c4dff);color:#fff;border-radius:12px;font-weight:700;font-size:15px;text-decoration:none;">Go to My Portal</a>
          </div>
          <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:12px;padding:20px;margin-bottom:24px;">
            <p style="color:#0369a1;font-size:13px;font-weight:700;margin:0 0 6px;">Your login details</p>
            <p style="color:#1e293b;font-size:13px;margin:0;">Email: <strong>${opts.email}</strong></p>
            <p style="color:#64748b;font-size:12px;margin:6px 0 0;">Use the password you set during checkout.</p>
          </div>
          <p style="color:#64748b;font-size:13px;margin-top:32px;">Regards,<br/><strong style="color:#1e293b;">The Indexify Team</strong><br/>Powered by Fortune Design · fortunedesign.co.za</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
  await sendEmail({
    to: [{ email: opts.email, name: opts.name }],
    cc: CC_EMAILS,
    subject,
    html,
  });
}

export async function sendChatNotificationToAdmin(opts: {
  clientName: string;
  clientEmail: string;
  userId: number;
  messagePreview: string;
}) {
  const dashboardLink = `https://indexify.co.za/admin?tab=chat&clientId=${opts.userId}`;
  const subject = `💬 New message from ${opts.clientName} — Indexify Portal`;
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
            <div style="font-size:13px;font-weight:700;color:#0ea5c8;text-transform:uppercase;letter-spacing:2px;">New Client Message</div>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 32px;">
            <p style="margin:0 0 16px;font-size:15px;color:#0f172a;">You have a new message from <strong>${opts.clientName}</strong> (${opts.clientEmail}) in the Indexify portal:</p>
            <div style="background:#f1f5f9;border-left:4px solid #0ea5c8;border-radius:6px;padding:14px 18px;font-size:14px;color:#334155;font-style:italic;">"${opts.messagePreview}"</div>
            <div style="margin-top:28px;text-align:center;">
              <a href="${dashboardLink}" style="display:inline-block;background:#0ea5c8;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;padding:13px 30px;border-radius:8px;">View Chat in Dashboard →</a>
            </div>
          </td>
        </tr>
        <tr>
          <td style="background:#f8fafc;padding:16px 32px;border-top:1px solid #e2e8f0;">
            <p style="margin:0;font-size:12px;color:#94a3b8;text-align:center;">Indexify · support@indexify.co.za · indexify.co.za</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  await sendEmail({
    to: [{ email: SENDER_EMAIL }],
    cc: CC_EMAILS,
    subject,
    html,
  });
}

export async function sendChatNotificationToClient(opts: {
  clientName: string;
  clientEmail: string;
  messagePreview: string;
}) {
  const portalLink = `https://indexify.co.za/portal?tab=chat`;
  const subject = `💬 New reply from your Indexify team`;
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
            <div style="font-size:13px;font-weight:700;color:#0ea5c8;text-transform:uppercase;letter-spacing:2px;">Message from Indexify</div>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 32px;">
            <p style="margin:0 0 16px;font-size:15px;color:#0f172a;">Hi <strong>${opts.clientName}</strong>, your Indexify team has replied to your chat:</p>
            <div style="background:#f1f5f9;border-left:4px solid #7c4dff;border-radius:6px;padding:14px 18px;font-size:14px;color:#334155;font-style:italic;">"${opts.messagePreview}"</div>
            <div style="margin-top:28px;text-align:center;">
              <a href="${portalLink}" style="display:inline-block;background:#7c4dff;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;padding:13px 30px;border-radius:8px;">Go to Your Portal →</a>
            </div>
          </td>
        </tr>
        <tr>
          <td style="background:#f8fafc;padding:16px 32px;border-top:1px solid #e2e8f0;">
            <p style="margin:0;font-size:12px;color:#94a3b8;text-align:center;">Indexify · support@indexify.co.za · indexify.co.za</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  await sendEmail({
    to: [{ email: opts.clientEmail, name: opts.clientName }],
    subject,
    html,
  });
}
