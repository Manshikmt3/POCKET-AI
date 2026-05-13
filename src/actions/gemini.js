"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function chatWithAi(messages) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Convert messages to Gemini format
    const chat = model.startChat({
      history: messages.slice(0, -1).map(m => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.text }],
      })),
    });

    const lastMessage = messages[messages.length - 1].text;
    const result = await chat.sendMessage(lastMessage);
    const response = await result.response;
    
    return { success: true, data: response.text() };
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return { success: false, error: error.message };
  }
}

export async function generateFinancialInsights(transactions) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `
      Analyze these financial transactions and provide 3-4 concise, actionable insights or tips for the user.
      Each transaction has an amount and a currency (ISO code). Be mindful of different currencies when providing insights.
      Transactions: ${JSON.stringify(transactions)}
      
      Return the insights as a JSON array of strings.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    
    return { success: true, data: JSON.parse(cleanedText) };
  } catch (error) {
    console.error("Gemini Insights Error:", error);
    return { success: false, error: error.message };
  }
}

export async function scanReceipt(base64Image) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    // Ensure we remove the data URL prefix if it exists
    const base64Data = base64Image.includes(",") 
      ? base64Image.split(",")[1] 
      : base64Image;

    const prompt = `
      Analyze this receipt image and extract the following information in JSON format:
      - Total amount (just the number)
      - Currency (ISO 4217 code e.g. USD, INR, EUR — detect from receipt symbol or country context)
      - Date (in ISO format)
      - Description or items purchased (brief summary)
      - Merchant/store name
      - Suggested category (one of: housing,transportation,groceries,utilities,entertainment,food,shopping,healthcare,education,personal,travel,insurance,gifts,bills,other-expense )
      
      Only respond with valid JSON in this exact format:
      {
        "amount": number,
        "currency": "string",
        "date": "ISO date string",
        "description": "string",
        "merchantName": "string",
        "category": "string"
      }

      If its not a receipt, return an empty object
    `;

    const result = await model.generateContent([
      {
        inlineData: {
          data: base64Data,
          mimeType: "image/jpeg", // We assume jpeg or similar, Gemini is flexible
        },
      },
      prompt,
    ]);

    const response = await result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

    try {
      const data = JSON.parse(cleanedText);
      return {
        success: true,
        data: {
          amount: parseFloat(data.amount),
          currency: data.currency || "INR",
          date: new Date(data.date),
          description: data.description,
          category: data.category,
          merchantName: data.merchantName,
        }
      };
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      return { success: false, error: "Invalid response format from Gemini" };
    }
  } catch (error) {
    console.error("Error scanning receipt:", error);
    return { success: false, error: "Failed to scan receipt" };
  }
}
