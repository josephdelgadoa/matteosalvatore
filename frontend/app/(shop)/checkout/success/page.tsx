'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in text-center">
      <div className="w-16 h-16 bg-ms-success/10 rounded-full flex items-center justify-center mb-6 text-ms-success">
        <CheckCircle className="w-8 h-8" />
      </div>
      
      <h1 className="ms-heading-2 mb-4">Thank you for your order!</h1>
      <p className="text-ms-stone mb-8 max-w-md mx-auto">
        Your order has been placed successfully. We have sent a confirmation email to your inbox.
      </p>

      {orderId && (
        <div className="bg-ms-ivory border border-ms-fog px-6 py-4 rounded-md mb-8">
            <span className="text-sm text-ms-stone block mb-1">Order Reference</span>
            <span className="font-medium font-serif text-lg text-ms-black">{orderId}</span>
        </div>
      )}

      <div className="flex gap-4">
        <Link href="/">
            <Button variant="outline">Back to Home</Button>
        </Link>
        <Link href="/account/orders">
            <Button>View Order</Button>
        </Link>
      </div>
    </div>
  );
}
