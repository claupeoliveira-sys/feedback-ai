export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {

    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Pergunta é obrigatória" });
    }

    if (!process.env.MISTRAL_API_KEY) {
      return res.status(500).json({ error: "MISTRAL_API_KEY não configurada" });
    }

    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.MISTRAL_API_KEY}`
      },
      body: JSON.stringify({
        model: "open-mixtral-8x7b",
        messages: [
          {
            role: "system",
            content: "Você é um especialista em feedback corporativo."
          },
          {
            role: "user",
            content: question
          }
        ]
      })
    });

    const data = await response.json();

    // 👇 DEBUG seguro
    if (!response.ok) {
      return res.status(response.status).json({
        error: "Erro na API Mistral",
        details: data
      });
    }

    if (!data.choices || !data.choices.length) {
      return res.status(500).json({
        error: "Resposta inesperada da Mistral",
        raw: data
      });
    }

    return res.status(200).json({
      answer: data.choices[0].message.content
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
