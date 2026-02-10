import React from 'react';

export default function RefundPolicyPage() {
    return (
        <div className="container mx-auto px-4 py-12 md:py-20 max-w-3xl animate-fade-in text-ms-black">
            <h1 className="ms-heading-2 mb-8">Refund Policy</h1>

            <div className="prose prose-stone max-w-none space-y-6">
                <p>At Matteo Salvatore, we pride ourselves on the quality and craftsmanship of our products. If you are not completely satisfied with your purchase, we are here to help.</p>

                <h3 className="text-lg font-medium mt-6 mb-2">Returns</h3>
                <p>You have 30 calendar days to return an item from the date you received it. To be eligible for a return, your item must be unused, unwashed, and in the same condition that you received it. Your item must be in the original packaging with all tags attached.</p>

                <h3 className="text-lg font-medium mt-6 mb-2">Refunds</h3>
                <p>Once we receive your item, we will inspect it and notify you that we have received your returned item. We will immediately notify you on the status of your refund after inspecting the item.</p>
                <p>If your return is approved, we will initiate a refund to your original method of payment (credit card, Culqi, etc.). You will receive the credit within a certain amount of days, depending on your card issuer's policies.</p>

                <h3 className="text-lg font-medium mt-6 mb-2">Shipping</h3>
                <p>You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable. If you receive a refund, the cost of return shipping will be deducted from your refund.</p>

                <h3 className="text-lg font-medium mt-6 mb-2">Contact Us</h3>
                <p>If you have any questions on how to return your item to us, contact us at <a href="mailto:support@matteosalvatore.pe" className="underline hover:text-ms-taupe">support@matteosalvatore.pe</a>.</p>
            </div>
        </div>
    );
}
