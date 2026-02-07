import React from 'react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: number;
        label: string;
        isPositive: boolean;
    };
    className?: string;
}

export const StatCard = ({ title, value, icon: Icon, trend, className }: StatCardProps) => {
    return (
        <Card className={cn("flex flex-col gap-4 bg-ms-white", className)}>
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-ms-stone uppercase tracking-wide">{title}</span>
                <div className="bg-ms-ivory p-2 rounded-full">
                    <Icon className="w-5 h-5 text-ms-black" strokeWidth={1.5} />
                </div>
            </div>

            <div>
                <h3 className="text-2xl font-serif font-medium text-ms-black">{value}</h3>
                {trend && (
                    <p className={cn(
                        "text-xs mt-1 flex items-center gap-1",
                        trend.isPositive ? "text-ms-success" : "text-ms-error"
                    )}>
                        <span>{trend.isPositive ? '+' : ''}{trend.value}%</span>
                        <span className="text-ms-stone">{trend.label}</span>
                    </p>
                )}
            </div>
        </Card>
    );
};
