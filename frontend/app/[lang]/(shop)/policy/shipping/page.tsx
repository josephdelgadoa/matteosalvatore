import React from 'react';

export default function ShippingPolicyPage() {
    return (
        <div className="container mx-auto px-4 py-12 md:py-20 max-w-3xl animate-fade-in text-ms-black">
            <h1 className="ms-heading-2 mb-8">Shipping Policy</h1>

            <div className="prose prose-stone max-w-none space-y-6">
                <h3 className="text-lg font-medium mt-6 mb-2">Order Processing</h3>
                <p>All orders are processed within 1-2 business days. Orders are not shipped or delivered on weekends or holidays.</p>
                <p>If we are experiencing a high volume of orders, shipments may be delayed by a few days. Please allow additional days in transit for delivery. If there will be a significant delay in shipment of your order, we will contact you via email or telephone.</p>

                <h3 className="text-lg font-medium mt-6 mb-2">Shipping Rates & Delivery Estimates</h3>
                <p>Shipping charges for your order will be calculated and displayed at checkout.</p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Lima Metropolitan Area:</strong> Free shipping. Estimated delivery: 1-2 business days.</li>
                    <li><strong>Provinces (Standard):</strong> S/. 15.00. Estimated delivery: 3-5 business days.</li>
                    <li><strong>Provinces (Express):</strong> S/. 25.00. Estimated delivery: 2-3 business days.</li>
                </ul>
                <p className="text-sm italic mt-2">* Delivery delays can occasionally occur.</p>

                <h3 className="text-lg font-medium mt-6 mb-2">Shipment Confirmation & Order Tracking</h3>
                <p>You will receive a Shipment Confirmation email once your order has shipped containing your tracking number(s). The tracking number will be active within 24 hours.</p>

                <h3 className="text-lg font-medium mt-6 mb-2">Customs, Duties and Taxes</h3>
                <p>Matteo Salvatore is not responsible for any customs and taxes applied to your order. All fees imposed during or after shipping are the responsibility of the customer (tariffs, taxes, etc.).</p>

                <h3 className="text-lg font-medium mt-6 mb-2">Damages</h3>
                <p>Matteo Salvatore is not liable for any products damaged or lost during shipping. If you received your order damaged, please contact the shipment carrier to file a claim. Please save all packaging materials and damaged goods before filing a claim.</p>
            </div>
        </div>
    );
}
