module.exports = async function contactHandler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return res.status(503).json({ code: "not_configured" });
  }

  const body = req.body && typeof req.body === "object" ? req.body : {};
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const website = typeof body.website === "string" ? body.website.trim() : "";

  if (website) {
    return res.status(400).json({ code: "invalid_submission" });
  }
  if (
    name.length < 2 || name.length > 100 ||
    phone.length < 7 || phone.length > 40 ||
    !/^[+\d\s().-]+$/.test(phone) ||
    message.length < 5 || message.length > 2000
  ) {
    return res.status(400).json({ code: "invalid_fields" });
  }

  try {
    const telegramResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: `New portfolio contact\nName: ${name}\nPhone: ${phone}\nMessage:\n${message}`
      })
    });

    if (!telegramResponse.ok) {
      const telegramError = await telegramResponse.json().catch(() => null);
      console.error(
        "Telegram rejected the contact message",
        telegramResponse.status,
        telegramError?.description || "No error description"
      );
      return res.status(502).json({ code: "telegram_rejected" });
    }

    return res.status(200).json({ sent: true });
  } catch (error) {
    console.error("Telegram contact delivery failed", error);
    return res.status(502).json({ code: "telegram_delivery_failed" });
  }
};
