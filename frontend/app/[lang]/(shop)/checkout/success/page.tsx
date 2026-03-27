'use client';

import React, { useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCheckoutDictionary } from '@/providers/CheckoutDictionaryProvider';
import { getLocalizedPath } from '@/lib/routes';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { dict, lang } = useCheckoutDictionary();
  const successDict = dict.success;

  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in text-center">
      <div className="w-16 h-16 bg-ms-success/10 rounded-full flex items-center justify-center mb-6 text-ms-success">
        <CheckCircle className="w-8 h-8" />
      </div>

      <h1 className="ms-heading-2 mb-4">{successDict?.thankYou || 'Thank you for your order!'}</h1>
      <p className="text-ms-stone mb-8 max-w-md mx-auto">
        {successDict?.confirmation || 'Your order has been placed successfully. We have sent a confirmation email to your inbox.'}
      </p>

      {orderId && (
        <div className="bg-ms-ivory border border-ms-fog px-6 py-4 rounded-md mb-8">
          <span className="text-sm text-ms-stone block mb-1">{successDict?.orderRef || 'Order Reference'}</span>
          <span className="font-medium font-serif text-lg text-ms-black">{orderId}</span>
        </div>
      )}

      <div className="flex gap-4">
        <Link href={getLocalizedPath('/', lang as any)}>
          <Button variant="outline">{successDict?.backToHome || 'Back to Home'}</Button>
        </Link>
        <Link href={getLocalizedPath(`/account/orders/${orderId}`, lang as any)}>
          <Button>{successDict?.viewOrder || 'View Order'}</Button>
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
