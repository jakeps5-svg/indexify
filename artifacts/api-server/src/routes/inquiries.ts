import { Router, type IRouter } from "express";
import { db, inquiriesTable } from "@workspace/db";
import { SubmitInquiryBody } from "@workspace/api-zod";

const router: IRouter = Router();

const WHATSAPP_NUMBER = "27760597724";

router.post("/inquiries", async (req, res) => {
  const parseResult = SubmitInquiryBody.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ error: "Invalid request data" });
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
