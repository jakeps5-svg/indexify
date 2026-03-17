import { Router } from "express";
import { sendContactEmail } from "../lib/email.js";

const router = Router();

router.post("/contact", async (req, res) => {
  try {
    const { name, email, phone, company, reason, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email and message are required." });
    }

    await sendContactEmail({ name, email, phone, company, reason, message });

    return res.json({ ok: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return res.status(500).json({ error: "Failed to send message." });
  }
});

export default router;
