'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useToast, ToastContainer } from '@/components/ui/Toast';
import { useCart } from '@/store/useCart';
import { Spinner } from '@/components/ui/Spinner';
import axios from 'axios';
import Script from 'next/script';
import { useCheckoutDictionary } from '@/providers/CheckoutDictionaryProvider';
import { getLocalizedPath } from '@/lib/routes';

declare global {
    interface Window {
        CulqiCheckout: any;
        Culqi: any;
        culqi: any;
    }
}

export default function CheckoutPaymentPage() {
    const router = useRouter();
    const { addToast } = useToast();
    const { items, getCartTotal, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);
    const culqiInstance = useRef<any>(null);

    // State for order ID created before payment
    const [orderId, setOrderId] = useState<string | null>(null);

    const { dict, lang } = useCheckoutDictionary();
    const payDict = dict.payment;

    useEffect(() => {
        // Check if we have shipping info
        const shipping = localStorage.getItem('checkout_info');
        if (!shipping) {
            router.push(getLocalizedPath('/checkout/information', lang as any));
        }
    }, [router, lang]);

    const initCulqi = () => {
        setIsScriptLoaded(true);
    };

    const handlePayment = async () => {
        if (!window.Culqi) {
            addToast(payDict?.paymentNotReady || 'Payment system not ready. Please refresh.', 'error');
            return;
        }
        if (!process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY) {
            console.error('Culqi Public Key is missing!');
            addToast(payDict?.configError || 'Configuration error. Please contact support.', 'error');
            return;
        }
        setLoading(true);

        try {
            // 1. Create Order First
            const shippingInfo = JSON.parse(localStorage.getItem('checkout_info') || '{}');
            const shippingMethod = localStorage.getItem('checkout_shipping') || 'standard';
            const shippingCost = shippingMethod === 'express' ? 25 : 15;
            const total = getCartTotal() + shippingCost;

            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
                items: items.map(item => ({
                    product_id: item.product_id || item.id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    size: item.size,
                    color: item.color
                })),
                shipping_address: {
                    address_line1: shippingInfo.address,
                    city: shippingInfo.city,
                    district: shippingInfo.district,
                    country: 'Peru',
                    phone: shippingInfo.phone
                },
                customer_email: shippingInfo.email,
                total_amount: total,
                customer_id: null
            });

            const newOrder = data.data.order;
            setOrderId(newOrder.id);

            const hasRsaKey = process.env.NEXT_PUBLIC_CULQI_RSA_PUBLIC_KEY && 
                              !process.env.NEXT_PUBLIC_CULQI_RSA_PUBLIC_KEY.startsWith('PASTE');

            // 2. Configure and Open Culqi Checkout v4
            window.Culqi.publicKey = process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY;
            
            window.Culqi.settings({
                title: 'Matteo Salvatore',
                currency: 'PEN',
                amount: Math.round(newOrder.total_amount * 100),
                ...(hasRsaKey && {
                    xculqirsaid: process.env.NEXT_PUBLIC_CULQI_RSA_ID,
                    rsapublickey: process.env.NEXT_PUBLIC_CULQI_RSA_PUBLIC_KEY
                })
            });

            window.Culqi.options({
                lang: 'auto',
                installments: true,
                modal: true, // Use popup/modal version
                style: {
                    logo: 'https://matteosalvatore.pe/images/logo-matteo-salvatore-v-web.png',
                    maincolor: '#000000',
                    buttontext: '#ffffff',
                    maintext: '#000000',
                    desctext: '#000000'
                }
            });
            
            if (window.Culqi.client) {
                window.Culqi.client({
                    email: shippingInfo.email
                });
            }
            
            // Handle Culqi v4 callback
            window.culqi = async () => {
                const tokenObj = window.Culqi.token;
                const errorObj = window.Culqi.error;

                if (tokenObj) {
                    const token = tokenObj.id;
                    const email = tokenObj.email;
                    const authentication_3DS = tokenObj.authentication_3DS;

                    try {
                        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/payments/process`, {
                            token,
                            amount: total,
                            email,
                            currency: 'PEN',
                            orderId: newOrder.id,
                            authentication_3DS: authentication_3DS
                        });

                        addToast(payDict?.paymentSuccess || 'Payment Successful! Redirecting...', 'success');
                        clearCart();
                        localStorage.removeItem('checkout_info');
                        localStorage.removeItem('checkout_shipping');

                        setTimeout(() => {
                            router.push(getLocalizedPath(`/checkout/success?orderId=${newOrder.id}`, lang as any));
                        }, 2000);

                    } catch (err: any) {
                        console.error('Payment processing error:', err);
                        addToast(err.response?.data?.message || payDict?.paymentFailed || 'Payment failed', 'error');
                        setLoading(false);
                        if (window.Culqi.close) window.Culqi.close();
                    }
                } else if (errorObj) {
                    console.error('Culqi error:', errorObj);
                    addToast(errorObj.user_message || 'Payment Error', 'error');
                    setLoading(false);
                    if (window.Culqi.close) window.Culqi.close();
                }
            };

            culqiInstance.current = window.Culqi;
            window.Culqi.open();

        } catch (err: any) {
            console.error(err);
            addToast(payDict?.initError || 'Failed to initialize payment. Please try again.', 'error');
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in space-y-8">
            <Script
                src="https://checkout.culqi.com/js/v4"
                onLoad={initCulqi}
            />
            <ToastContainer />

            <div className="border border-ms-fog rounded-md p-6 bg-ms-ivory/20">
                <h3 className="font-medium mb-4">{payDict?.title || 'Payment Method'}</h3>
                <p className="text-sm text-ms-stone mb-6">
                    {payDict?.secureText || 'All transactions are secure and encrypted.'}
                </p>

                <div className="flex flex-col gap-4">
                    <Button
                        onClick={handlePayment}
                        disabled={!isScriptLoaded || loading}
                        isLoading={loading}
                        className="w-full py-4 text-lg"
                    >
                        {payDict?.payWithCard || 'Pay with Card'}
                    </Button>
                    <p className="text-xs text-center text-ms-silver">
                        {payDict?.poweredBy || 'Powered by Culqi'}
                    </p>
                </div>
            </div>
        </div>
    );
}
