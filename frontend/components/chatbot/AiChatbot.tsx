'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, ShoppingCart, UserPlus, CreditCard, Loader2 } from 'lucide-react';
import { Locale } from '@/i18n-config';
import { chatbotApi, ChatMessage } from '@/lib/api/chatbot';
import { useCart } from '@/store/useCart';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { getLocalizedPath } from '@/lib/routes';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface AiChatbotProps {
    lang: Locale;
    dict: any;
}

export const AiChatbot = ({ lang, dict }: AiChatbotProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [history, setHistory] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState<any>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const { items } = useCart();
    const supabase = createClientComponentClient();
    const router = useRouter();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        checkUser();
    }, [supabase]);

    const chatbotDict = dict.chatbot;

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history]);

    const handleSend = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!message.trim() || isLoading) return;

        const userMessage = message.trim();
        setMessage('');

        // Add user message to history
        const newHistory: ChatMessage[] = [...history, { role: 'user', content: userMessage }];
        setHistory(newHistory);
        setIsLoading(true);

        try {
            const context = {
                cart: items,
                isAuthenticated: !!user,
                currentPage: window.location.pathname
            };

            const response = await chatbotApi.sendMessage(userMessage, history, lang, context);

            setHistory([...newHistory, { role: 'bot', content: response.data.response }]);
        } catch (error) {
            console.error('Chatbot error:', error);
            setHistory([...newHistory, { role: 'bot', content: lang === 'es' ? 'Lo siento, tuve un problema. Por favor intenta de nuevo.' : 'Sorry, I encountered an issue. Please try again.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAction = (type: 'cart' | 'register' | 'pay') => {
        let path = '';
        switch (type) {
            case 'cart': path = '/cart'; break;
            case 'register': path = '/register'; break;
            case 'pay': path = '/checkout'; break;
        }
        router.push(getLocalizedPath(path, lang));
        if (window.innerWidth < 768) setIsOpen(false); // Close on mobile after click
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="mb-4 w-[350px] md:w-[400px] h-[500px] bg-ms-white/95 backdrop-blur-md border border-ms-fog shadow-2xl rounded-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-ms-black p-4 flex items-center justify-between text-ms-pearl">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-ms-gold/20 flex items-center justify-center border border-ms-gold/30">
                                    <span className="text-ms-gold font-serif text-xs">MS</span>
                                </div>
                                <div>
                                    <h3 className="font-serif text-sm font-medium leading-none">Matteo Salvatore</h3>
                                    <span className="text-[10px] text-ms-stone brightness-150">Concierge AI</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-ms-white/10 rounded-full transition-colors"
                                title={chatbotDict.close}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Chat Area */}
                        <div
                            ref={scrollRef}
                            className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-ms-fog"
                        >
                            {/* Welcome Message */}
                            <div className="flex justify-start">
                                <div className="max-w-[85%] bg-ms-pearl/50 p-3 rounded-2xl rounded-tl-none text-ms-black text-sm border border-ms-fog/30">
                                    {chatbotDict.welcome}
                                </div>
                            </div>

                            {history.map((msg, i) => (
                                <div key={i} className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
                                    <div className={cn(
                                        "max-w-[85%] p-3 rounded-2xl text-sm",
                                        msg.role === 'user'
                                            ? "bg-ms-black text-ms-pearl rounded-tr-none"
                                            : "bg-ms-pearl/50 text-ms-black rounded-tl-none border border-ms-fog/30"
                                    )}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-ms-pearl/50 p-3 rounded-2xl rounded-tl-none border border-ms-fog/30">
                                        <Loader2 className="w-4 h-4 animate-spin text-ms-gold" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Quick Actions */}
                        <div className="px-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
                            <button
                                onClick={() => handleAction('cart')}
                                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-ms-pearl border border-ms-fog rounded-full text-[11px] font-medium text-ms-black hover:bg-ms-fog transition-colors"
                            >
                                <ShoppingCart className="w-3 h-3" />
                                {chatbotDict.actionCart}
                            </button>
                            <button
                                onClick={() => handleAction('register')}
                                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-ms-pearl border border-ms-fog rounded-full text-[11px] font-medium text-ms-black hover:bg-ms-fog transition-colors"
                            >
                                <UserPlus className="w-3 h-3" />
                                {chatbotDict.actionRegister}
                            </button>
                            <button
                                onClick={() => handleAction('pay')}
                                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-ms-gold/10 border border-ms-gold/20 rounded-full text-[11px] font-bold text-ms-gold hover:bg-ms-gold/20 transition-colors"
                            >
                                <CreditCard className="w-3 h-3" />
                                {chatbotDict.actionPay}
                            </button>
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSend} className="p-4 border-t border-ms-fog bg-ms-white">
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder={chatbotDict.placeholder}
                                    className="w-full bg-ms-pearl/50 border border-ms-fog rounded-full py-2.5 pl-4 pr-12 text-sm focus:outline-none focus:border-ms-black transition-colors"
                                    disabled={isLoading}
                                />
                                <button
                                    type="submit"
                                    disabled={!message.trim() || isLoading}
                                    className="absolute right-1.5 p-2 bg-ms-black text-ms-pearl rounded-full disabled:opacity-30 disabled:hover:bg-ms-black hover:bg-ms-brand-primary transition-all shadow-md group"
                                >
                                    <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300",
                    isOpen ? "bg-ms-pearl text-ms-black border border-ms-fog" : "bg-ms-black text-ms-pearl"
                )}
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
                {!isOpen && items.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-ms-gold text-ms-black text-[10px] font-bold flex items-center justify-center rounded-full animate-bounce">
                        {items.length}
                    </span>
                )}
            </motion.button>
        </div>
    );
};
