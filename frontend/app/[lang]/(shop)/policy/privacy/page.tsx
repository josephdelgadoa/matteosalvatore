import React from 'react';

export default function PrivacyPolicyPage() {
    return (
        <div className="container mx-auto px-4 py-12 md:py-20 max-w-3xl animate-fade-in text-ms-black">
            <h1 className="ms-heading-2 mb-8">Privacy Policy</h1>

            <div className="prose prose-stone max-w-none space-y-6">
                <p>Your privacy is important to us. It is Matteo Salvatore's policy to respect your privacy regarding any information we may collect from you across our website, <a href="https://matteosalvatore.pe" className="underline">matteosalvatore.pe</a>, and other sites we own and operate.</p>

                <h3 className="text-lg font-medium mt-6 mb-2">Information We Collect</h3>
                <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.</p>
                <p>We may collect information such as your name, email address, phone number, and shipping address when you place an order or sign up for our newsletter.</p>

                <h3 className="text-lg font-medium mt-6 mb-2">How We Use Information</h3>
                <p>We use the information we collect in various ways, including to:</p>
                <ul className="list-disc pl-5 space-y-2">
                    <li>Provide, operate, and maintain our website</li>
                    <li>Improve, personalize, and expand our website</li>
                    <li>Understand and analyze how you use our website</li>
                    <li>Develop new products, services, features, and functionality</li>
                    <li>Process your transactions and manage your orders</li>
                    <li>Send you emails, including order confirmations and newsletters (if subscribed)</li>
                </ul>

                <h3 className="text-lg font-medium mt-6 mb-2">Data Retention</h3>
                <p>We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we’ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use, or modification.</p>

                <h3 className="text-lg font-medium mt-6 mb-2">Sharing Information</h3>
                <p>We don’t share any personally identifying information publicly or with third-parties, except when required to by law or to facilitate our services (e.g., shipping providers, payment gateways).</p>

                <h3 className="text-lg font-medium mt-6 mb-2">Your Rights</h3>
                <p>You are free to refuse our request for your personal information, with the understanding that we may be unable to provide you with some of your desired services. You have the right to access, update, or delete your personal information at any time by contacting us.</p>
            </div>
        </div>
    );
}
