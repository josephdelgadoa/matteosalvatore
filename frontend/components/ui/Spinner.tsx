import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: 'sm' | 'md' | 'lg';
}

export const Spinner = ({ className, size = 'md', ...props }: SpinnerProps) => {
    const sizes = {
        sm: "h-4 w-4",
        md: "h-8 w-8",
        lg: "h-12 w-12"
    };

    return (
        <div className={cn("flex justify-center items-center", className)} {...props}>
            <Loader2 className={cn("animate-spin text-ms-black", sizes[size])} />
        </div>
    );
};
