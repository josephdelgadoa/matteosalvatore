import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export async function POST(req: Request) {
    try {
        const { productName, goal } = await req.json();

        if (!process.env.GOOGLE_API_KEY) {
            return NextResponse.json({ text: "API Key not configured." });
        }

        const prompt = `Act as a creative director for Matteo Salvatore (Premium Menswear).
    Generate a complete ad campaign for the product: "${productName}".
    Campaign Goal: ${goal}.
    
    Output Format:
    1.  **Headline**: Catchy and premium.
    2.  **Ad Copy**: Compelling text (English & Spanish).
    3.  **Image Prompt**: A detailed description for an AI image generator (like Midjourney) to create the visual.
    
    Keep it modern, minimalist, and "Silicon Valley" style.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ text });
    } catch (error) {
        console.error("Ad generation error:", error);
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}
