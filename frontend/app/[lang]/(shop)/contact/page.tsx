// @t// @ts-ignore
import { Locale } from '@/i18n-config';
import { getDictionary } from '@/get-dictionary';
import { PageHero } from '@/components/ui/PageHero';
import { ContactForm } from '@/components/shop/ContactForm';

export default async function ContactPage({ params }: { params: { lang: Locale } }) {
    const dict = await getDictionary(params.lang);

    return (
        <div className="animate-fade-in">
            <PageHero
                title={dict.contact.title}
                subtitle={dict.contact.subtitle}
                image="/images/hero-image-01.png"
            />

            <div className="container mx-auto px-4 py-12 md:py-20 max-w-5xl">
                <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
                    <div>
                        <h2 className="ms-heading-2 mb-6">{dict.contact.heading}</h2>
                        <p className="text-ms-stone mb-8">
                            {dict.contact.description}
                        </p>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-medium uppercase tracking-wider text-ms-stone mb-1">{dict.contact.email}</h3>
                                <p className="text-ms-black">support@matteosalvatore.pe</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium uppercase tracking-wider text-ms-stone mb-1">{dict.contact.whatsapp}</h3>
                                <p className="text-ms-black">+51 987 654 321</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium uppercase tracking-wider text-ms-stone mb-1">{dict.contact.atelier}</h3>
                                <p className="text-ms-black" dangerouslySetInnerHTML={{ __html: dict.contact.address }} />
                            </div>
                        </div>
                    </div>

                    <ContactForm dict={dict.contact.form} />
                </div>
            </div>
        </div>
    );
}
