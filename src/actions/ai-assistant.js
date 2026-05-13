"use server";

export async function getAiResponse(messages) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not set in environment variables");
  }

  const systemPrompt = {
    role: "system",
    content: `You are "Pocket AI Assistant", a professional and friendly financial advisor. 
    Your goal is to help users manage their finances, track spending, and provide smart financial insights. 
    Keep your responses concise, helpful, and encouraging. 
    Use a professional yet accessible tone. 
    If a user asks about their specific data, remind them that you can help them analyze the trends they see in their dashboard.`,
  };

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [systemPrompt, ...messages],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to get AI response");
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Groq API Error:", error);
    throw new Error(
      "I'm sorry, I'm having trouble connecting right now. Please try again later."
    );
  }
}
