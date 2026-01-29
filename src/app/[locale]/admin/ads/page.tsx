"use client";

import { useState } from "react";

export default function AdsGeneratorPage() {
    const [productName, setProductName] = useState("");
    const [goal, setGoal] = useState("Instagram Launch");
    const [generatedContent, setGeneratedContent] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const generateAd = async () => {
        setLoading(true);
        setGeneratedContent(null);
        try {
            const response = await fetch("/api/ads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productName, goal })
            });
            const data = await response.json();
            setGeneratedContent(data);
        } catch (e) {
            console.error(e);
            alert("Failed to generate ad");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="container section">
            <h1 style={{ marginBottom: "var(--spacing-lg)" }}>AI Ad Generator (Internal)</h1>

            <div style={{ display: "grid", gap: "var(--spacing-md)", maxWidth: "600px" }}>
                <div>
                    <label style={{ display: "block", marginBottom: "var(--spacing-sm)" }}>Product Name / Description</label>
                    <input
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        style={{ width: "100%", padding: "10px", border: "1px solid #ccc" }}
                        placeholder="e.g. Men's Skinny Stretchy Pants"
                    />
                </div>

                <div>
                    <label style={{ display: "block", marginBottom: "var(--spacing-sm)" }}>Campaign Goal</label>
                    <select
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        style={{ width: "100%", padding: "10px", border: "1px solid #ccc" }}
                    >
                        <option>Instagram Launch</option>
                        <option>Google Ads Sales</option>
                        <option>Email Newsletter</option>
                        <option>TikTok Viral Script</option>
                    </select>
                </div>

                <button
                    onClick={generateAd}
                    disabled={loading}
                    style={{
                        backgroundColor: "var(--color-black)",
                        color: "white",
                        padding: "1rem",
                        cursor: loading ? "not-allowed" : "pointer",
                        marginTop: "var(--spacing-md)"
                    }}
                >
                    {loading ? "Generating..." : "Generate Campaign Assets"}
                </button>
            </div>

            {generatedContent && (
                <div style={{ marginTop: "var(--spacing-2xl)", padding: "20px", border: "1px solid #eee", backgroundColor: "#f9f9f9" }}>
                    <h2>Generated Assets</h2>
                    <div style={{ whiteSpace: "pre-wrap", marginTop: "1rem", fontFamily: "monospace", fontSize: "0.9rem" }}>
                        {generatedContent.text}
                    </div>
                </div>
            )}
        </main>
    );
}
