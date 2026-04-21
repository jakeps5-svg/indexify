import { Router, type IRouter } from "express";
import { db, inquiriesTable } from "@workspace/db";
import { SubmitInquiryBody } from "@workspace/api-zod";
import { verifyRecaptcha } from "../lib/recaptcha.js";

const router: IRouter = Router();

const WHATSAPP_NUMBER = "27602988295";

router.post("/inquiries", async (req, res) => {
  const { recaptchaToken, ...rest } = req.body;

  const parseResult = SubmitInquiryBody.safeParse(rest);
  if (!parseResult.success) {
    res.status(400).json({ error: "Invalid request data" });
    return;
  }

  const captcha = await verifyRecaptcha(recaptchaToken, "whatsapp");
  if (!captcha.ok) {
    res.status(400).json({ error: "Security check failed. Please try again." });
    return;
  }

  const { name, email, phone, service, message } = parseResult.data;

  const [inquiry] = await db
    .insert(inquiriesTable)
    .values({ name, email, phone: phone ?? null, service, message })
    .returning();

  const serviceLabel =
    service === "seo"
      ? "SEO"
      : service === "google-ads"
        ? "Google Ads"
        : "SEO & Google Ads";

  const whatsappMessage = encodeURIComponent(
    `Hi Fortune Design! I'm interested in your ${serviceLabel} services.\n\nName: ${name}\nEmail: ${email}${phone ? `\nPhone: ${phone}` : ""}\n\nMessage: ${message}`
  );

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;

  res.status(201).json({
    id: inquiry.id,
    message: "Inquiry submitted successfully",
    whatsappUrl,
  });
});

export default router;
