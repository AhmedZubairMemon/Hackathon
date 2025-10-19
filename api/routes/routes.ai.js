import express from "express";

const router = express.Router();

router.post("/analyze", async (req, res) => {
  try {
    const { fileUrl } = req.body;

    const geminiRes = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Summarize this medical report (URL: ${fileUrl}) in:
1️⃣ English
2️⃣ Roman Urdu`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await geminiRes.json();

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "No summary found";
    const [englishSummary, romanUrduSummary] = text.split(/Roman Urdu:/i);

    res.json({
      aiInsight: {
        englishSummary: englishSummary?.replace("English:", "").trim(),
        romanUrduSummary: romanUrduSummary?.trim() || "Not available",
      },
    });
  } catch (error) {
    console.error("Gemini error:", error);
    res.status(500).json({ error: "AI summary failed" });
  }
});

export default router;