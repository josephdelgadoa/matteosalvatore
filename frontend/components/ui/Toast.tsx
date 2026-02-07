import React, { useEffect } from 'react';
import { create } from 'zustand';
import { cn } from '@/lib/utils';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastStore {
    toasts: Toast[];
    addToast: (message: string, type: ToastType) => void;
    removeToast: (id: string) => void;
}

export const useToast = create<ToastStore>((set) => ({
    toasts: [],
    addToast: (message, type) => {
        const id = Math.random().toString(36).substring(7);
        set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
        setTimeout(() => {
            set((state) => ({
                toasts: state.toasts.filter((t) => t.id !== id),
            }));
        }, 5000);
    },
    removeToast: (id) => set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

export const ToastContainer = () => {
    const { toasts, removeToast } = useToast();

    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={cn(
                        "flex items-center gap-3 min-w-[300px] p-4 bg-ms-white border shadow-lg animate-slide-in-left",
                        toast.type === 'success' && "border-ms-success/20 bg-ms-success/5",
                        toast.type === 'error' && "border-ms-error/20 bg-ms-error/5",
                        toast.type === 'info' && "border-ms-info/20 bg-ms-info/5"
                    )}
                >
                    {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-ms-success" />}
                    {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-ms-error" />}
                    {toast.type === 'info' && <Info className="w-5 h-5 text-ms-info" />}

                    <p className="flex-1 text-sm font-medium text-ms-black">{toast.message}</p>

                    <button
                        onClick={() => removeToast(toast.id)}
                        className="text-ms-stone hover:text-ms-black transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ))}
        </div>
    );
};
