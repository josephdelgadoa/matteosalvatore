"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";

interface Message {
    role: "user" | "model";
    content: string;
}

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: "model", content: "Hi! How can I help you find the perfect style today?" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const locale = useLocale();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage: Message = { role: "user", content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: input,
                    history: messages.map(m => ({
                        role: m.role,
                        parts: [{ text: m.content }]
                    })),
                    locale
                }),
            });

            if (!response.ok) throw new Error("Failed to fetch");

            const data = await response.json();
            setMessages(prev => [...prev, { role: "model", content: data.text }]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: "model", content: "Sorry, I'm having trouble connecting right now." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: "fixed",
                    bottom: "20px",
                    right: "20px",
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    backgroundColor: "var(--color-black)",
                    color: "var(--color-white)",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    cursor: "pointer",
                    zIndex: 1000,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "24px"
                }}
            >
                {isOpen ? "✕" : "💬"}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div style={{
                    position: "fixed",
                    bottom: "90px",
                    right: "20px",
                    width: "350px",
                    height: "500px",
                    maxHeight: "80vh",
                    backgroundColor: "white",
                    borderRadius: "var(--border-radius-md)",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                    display: "flex",
                    flexDirection: "column",
                    zIndex: 1000,
                    overflow: "hidden",
                    border: "1px solid #eee"
                }}>
                    {/* Header */}
                    <div style={{
                        padding: "var(--spacing-md)",
                        backgroundColor: "var(--color-black)",
                        color: "white",
                        fontWeight: "bold"
                    }}>
                        Matteo Salvatore Assistant
                    </div>

                    {/* Messages */}
                    <div style={{
                        flex: 1,
                        padding: "var(--spacing-md)",
                        overflowY: "auto",
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--spacing-sm)"
                    }}>
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                style={{
                                    alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                                    backgroundColor: msg.role === "user" ? "#f0f0f0" : "var(--color-black)",
                                    color: msg.role === "user" ? "black" : "white",
                                    padding: "8px 12px",
                                    borderRadius: "12px",
                                    maxWidth: "80%",
                                    fontSize: "0.9rem"
                                }}
                            >
                                {msg.content}
                            </div>
                        ))}
                        {loading && <div style={{ alignSelf: "flex-start", color: "#888", fontSize: "0.8rem" }}>Thinking...</div>}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div style={{
                        padding: "var(--spacing-sm)",
                        borderTop: "1px solid #eee",
                        display: "flex",
                        gap: "8px"
                    }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && !loading && sendMessage()}
                            placeholder="Ask about products..."
                            style={{
                                flex: 1,
                                padding: "8px",
                                borderRadius: "4px",
                                border: "1px solid #ddd"
                            }}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={loading}
                            style={{
                                backgroundColor: "var(--color-black)",
                                color: "white",
                                border: "none",
                                padding: "0 12px",
                                borderRadius: "4px",
                                cursor: loading ? "not-allowed" : "pointer"
                            }}
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
