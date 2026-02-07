import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'text' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {

        // Base styles from Design System
        const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-ms-black/20 focus:ring-offset-2";

        // Variants
        // Variants
        const variants = {
            primary: "bg-ms-black text-ms-white uppercase tracking-widest text-xs border border-ms-black hover:bg-ms-stone hover:border-ms-stone transition-all duration-300 shadow-sm hover:shadow-md active:scale-95",
            secondary: "bg-transparent text-ms-black uppercase tracking-widest text-xs border border-ms-black hover:bg-ms-black hover:text-ms-white transition-all duration-300 active:scale-95",
            text: "bg-transparent text-ms-stone hover:text-ms-black border-transparent underline-offset-4 hover:underline transition-colors",
            outline: "bg-transparent border border-ms-fog text-ms-black hover:border-ms-black hover:bg-ms-ivory transition-all duration-300"
        };

        // Sizes
        const sizes = {
            sm: "text-xs px-4 py-2",
            md: "text-sm px-8 py-4",
            lg: "text-base px-10 py-5"
        };

        return (
            <button
                ref={ref}
                className={cn(
                    baseStyles,
                    variants[variant],
                    sizes[size],
                    className
                )}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';
