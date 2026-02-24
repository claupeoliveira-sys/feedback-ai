export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {

    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Pergunta é obrigatória" });
    }

    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.MISTRAL_API_KEY}`
      },
      body: JSON.stringify({
        model: "mistral-small-latest",
        messages: [
          {
            role: "system",
            content: "Você é um especialista em feedback corporativo."
          },
          {
            role: "user",
            content: question
          }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    return res.status(200).json({
      answer: data.choices[0].message.content
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
}
