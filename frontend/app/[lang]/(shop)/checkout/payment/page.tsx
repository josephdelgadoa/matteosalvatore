'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useToast, ToastContainer } from '@/components/ui/Toast';
import { useCart } from '@/store/useCart';
import { Spinner } from '@/components/ui/Spinner';
import axios from 'axios';
import Script from 'next/script';

declare global {
    interface Window {
        Culqi: any;
        culqi: () => void;
    }
}

export default function CheckoutPaymentPage() {
    const router = useRouter();
    const { addToast } = useToast();
    const { items, getCartTotal, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [canPay, setCanPay] = useState(false);

    // State for order ID created before payment
    const [orderId, setOrderId] = useState<string | null>(null);

    useEffect(() => {
        // Check if we have shipping info
        const shipping = localStorage.getItem('checkout_info');
        if (!shipping) {
            router.push('/checkout/information');
        }
    }, [router]);

    const handlePayment = async () => {
        if (!window.Culqi) return;
        setLoading(true);

        // 1. Create Order First
        try {
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

            // 2. Configure Culqi
            window.Culqi.settings({
                title: 'Matteo Salvatore',
                currency: 'PEN',
                description: `Order #${newOrder.order_number}`,
                amount: Math.round(newOrder.total_amount * 100),
                order: newOrder.order_number
            });

            // 3. Open Culqi
            window.Culqi.open();

        } catch (err: any) {
            console.error(err);
            addToast('Failed to create order. Please try again.', 'error');
            setLoading(false);
        }
    };

    useEffect(() => {
        // Define the global callback for Culqi
        window.culqi = async () => {
            if (window.Culqi.token) {
                const token = window.Culqi.token.id;
                const email = window.Culqi.token.email;

                try {
                    if (!orderId) throw new Error('Order ID missing');

                    const shippingMethod = localStorage.getItem('checkout_shipping') || 'standard';
                    const amount = getCartTotal() + (shippingMethod === 'express' ? 25 : 15);

                    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/payments/process`, {
                        token,
                        amount,
                        email,
                        currency: 'PEN',
                        orderId: orderId,
                        deviceId: localStorage.getItem('culqi_device_id')
                    });

                    addToast('Payment Successful! Redirecting...', 'success');
                    clearCart();
                    localStorage.removeItem('checkout_info');
                    localStorage.removeItem('checkout_shipping');
                    localStorage.removeItem('culqi_device_id');

                    setTimeout(() => {
                        router.push(`/checkout/success?orderId=${orderId}`);
                    }, 2000);

                } catch (err: any) {
                    console.error(err);
                    addToast(err.response?.data?.message || 'Payment failed', 'error');
                } finally {
                    setLoading(false);
                    window.Culqi.close();
                }
            } else {
                console.log(window.Culqi.error);
                addToast(window.Culqi.error?.user_message || 'Payment Error', 'error');
                setLoading(false);
            }
        };
    }, [addToast, getCartTotal, clearCart, router, orderId, items]);

    const initCulqi = () => {
        if (window.Culqi) {
            window.Culqi.publicKey = process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY;

            const deviceId = window.Culqi.getDevice();
            if (deviceId) {
                localStorage.setItem('culqi_device_id', deviceId);
            }

            window.Culqi.options({
                style: {
                    logo: 'https://matteosalvatore.pe/images/logo.svg',
                    maincolor: '#000000',
                    buttontext: '#ffffff',
                    maintext: '#000000',
                    desctext: '#000000'
                }
            });
            setCanPay(true);
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
                <h3 className="font-medium mb-4">Payment Method</h3>
                <p className="text-sm text-ms-stone mb-6">
                    All transactions are secure and encrypted.
                </p>

                <div className="flex flex-col gap-4">
                    <Button
                        onClick={handlePayment}
                        disabled={!canPay || loading}
                        isLoading={loading}
                        className="w-full py-4 text-lg"
                    >
                        Pay with Card
                    </Button>
                    <p className="text-xs text-center text-ms-silver">
                        Powered by Culqi
                    </p>
                </div>
            </div>
        </div>
    );
}
