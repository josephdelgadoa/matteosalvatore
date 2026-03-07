import React from 'react';
import { getDictionary } from '../../../../get-dictionary';
import { Locale } from '../../../../i18n-config';

export default async function ReturnsPage({ params }: { params: { lang: Locale } }) {
    const dict = await getDictionary(params.lang);
    const policy = dict.returnsPolicy;

    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            <h1 className="text-4xl font-serif text-center mb-12">{policy.title}</h1>

            <div className="space-y-12 text-ms-stone text-sm leading-relaxed">
                <section>
                    <h2 className="text-2xl font-serif text-ms-black mb-4">
                        {policy.quality.title}
                    </h2>
                    <div className="space-y-4">
                        <p>{policy.quality.text}</p>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-serif text-ms-black mb-4">
                        {policy.conditions.title}
                    </h2>
                    <div className="space-y-4">
                        <ul className="list-disc pl-5 space-y-2">
                            {policy.conditions.items.map((item: string, index: number) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-serif text-ms-black mb-4">
                        {policy.exchange.title}
                    </h2>
                    <div className="space-y-4">
                        <p>{policy.exchange.text1}</p>
                        <p>{policy.exchange.text2}</p>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-serif text-ms-black mb-4">
                        {policy.refund.title}
                    </h2>
                    <div className="space-y-4">
                        <p>{policy.refund.text1}</p>
                        <p>{policy.refund.text2}</p>
                    </div>
                </section>

                <section className="bg-ms-ivory p-8">
                    <h2 className="text-2xl font-serif text-ms-black mb-4">
                        {policy.support.title}
                    </h2>
                    <div className="space-y-4">
                        <p>{policy.support.text}</p>
                        <ul className="space-y-2">
                            <li><strong>WhatsApp:</strong> +51 900 000 000</li>
                            <li><strong>Email:</strong> soporte@matteosalvatore.pe</li>
                        </ul>
                    </div>
                </section>
            </div>
        </div>
    );
}
