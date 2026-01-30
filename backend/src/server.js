import express from "express";

const app = express();
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: message }],
      }),
    });

    const text = await r.text(); // ← ВАЖНО
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error("OpenAI вернул не JSON: " + text);
    }

    if (!r.ok) {
      console.error("OpenAI error:", data);
      return res.status(500).json({
        error: data?.error?.message || "OpenAI error",
      });
    }

    res.json({
      answer: data.choices[0].message.content,
    });
  } catch (e) {
    console.error("Backend error:", e);
    res.status(500).json({ error: e.message });
  }
});


app.listen(3001, () => {
  console.log("OpenAI backend OK :3001");
});
