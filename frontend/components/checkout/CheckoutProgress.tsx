'use client';

import React from 'react';
import { Check, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const steps = [
    { name: 'Information', href: '/checkout/information' },
    { name: 'Shipping', href: '/checkout/shipping' },
    { name: 'Payment', href: '/checkout/payment' },
];

export const CheckoutProgress = () => {
    const pathname = usePathname();

    const getCurrentStepIndex = () => {
        if (pathname.includes('/information')) return 0;
        if (pathname.includes('/shipping')) return 1;
        if (pathname.includes('/payment')) return 2;
        return 0;
    };

    const currentStep = getCurrentStepIndex();

    return (
        <nav aria-label="Checkout Progress">
            <ol className="flex items-center space-x-2 text-sm font-medium">
                <li className="flex items-center">
                    <Link href="/cart" className="text-ms-stone hover:text-ms-black transition-colors">
                        Cart
                    </Link>
                    <ChevronRight className="w-4 h-4 text-ms-stone mx-2" />
                </li>

                {steps.map((step, index) => {
                    const isCompleted = index < currentStep;
                    const isCurrent = index === currentStep;

                    return (
                        <li key={step.name} className="flex items-center">
                            <Link
                                href={isCompleted ? step.href : '#'}
                                className={cn(
                                    "flex items-center",
                                    isCompleted ? "text-ms-success" : isCurrent ? "text-ms-black" : "text-ms-stone pointer-events-none"
                                )}
                                aria-current={isCurrent ? 'step' : undefined}
                            >
                                <span>{step.name}</span>
                            </Link>
                            {index < steps.length - 1 && (
                                <ChevronRight className="w-4 h-4 text-ms-stone mx-2" />
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};
