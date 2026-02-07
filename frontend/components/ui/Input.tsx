import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, error, ...props }, ref) => {
        return (
            <div className="w-full space-y-2">
                {label && (
                    <label className="text-sm font-medium uppercase tracking-wide text-ms-stone block">
                        {label}
                    </label>
                )}
                <input
                    type={type}
                    className={cn(
                        "w-full px-4 py-4 bg-ms-white border border-ms-fog text-base transition-all duration-300",
                        "focus:outline-none focus:border-ms-black focus:ring-1 focus:ring-ms-black/5 focus:shadow-sm",
                        "placeholder:text-ms-silver disabled:cursor-not-allowed disabled:opacity-50",
                        "hover:border-ms-stone/50",
                        error && "border-ms-error focus:border-ms-error focus:ring-ms-error/10",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {error && (
                    <p className="text-sm text-ms-error animate-fade-in">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
