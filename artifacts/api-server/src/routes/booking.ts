import { Router } from "express";
import { sendMeetingRequestEmail } from "../lib/email.js";

const router = Router();

router.post("/book-meeting", async (req, res) => {
  try {
    const { name, email, phone, website, date, time, platform, needs } = req.body;

    if (!name || !email || !phone || !date || !time || !platform) {
      return res.status(400).json({ error: "Name, email, phone, date, time and platform are required." });
    }

    if (platform !== "teams" && platform !== "meet") {
      return res.status(400).json({ error: "Platform must be 'teams' or 'meet'." });
    }

    await sendMeetingRequestEmail({ name, email, phone, website, date, time, platform, needs });

    return res.json({ ok: true });
  } catch (err) {
    console.error("Booking form error:", err);
    return res.status(500).json({ error: "Failed to submit meeting request." });
  }
});

export default router;
