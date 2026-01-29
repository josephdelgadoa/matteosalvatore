import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export async function POST(req: Request) {
    try {
        const { message, history, locale } = await req.json();

        if (!process.env.GOOGLE_API_KEY) {
            return NextResponse.json({ text: "API Key not configured." });
        }

        const systemPrompt = `You are a helpful and stylish sales assistant for Matteo Salvatore, a premium menswear brand in Peru. 
    Your tone is elegant, helpful, and concise. 
    You speak in ${locale === 'es' ? 'Spanish' : 'English'}.
    The currency is PEN (S/). 
    We sell:
    - Men's Skinny Stretchy Pants (S/ 120)
    - Premium Pima Cotton Polos (S/ 80) - "The best cotton in the world"
    - Hoodies, Shorts, Sets
    - Peruvian Leather Sneakers (S/ 250)
    
    Shipping is available throughout Peru.
    If asked about order status, ask for the order ID (generic response).
    If asked about returns, we accept returns within 7 days.
    
    Answer the user's latest message based on this context.`;

        // Simple one-shot chat for now to include system prompt easily without complex history management valid for gemini-pro strictly
        // Or we can use startChat if we structure history correctly.
        // For simplicity, we'll just prompt with context + message.

        const prompt = `${systemPrompt}\n\nUser: ${message}`;

        // For better history, we should append previous messages, but keeping it simple for V1.

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ text });
    } catch (error) {
        console.error("Chat error:", error);
        return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
    }
}
