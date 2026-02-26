import React from 'react';
import { getDictionary } from '../../../../get-dictionary';
import { Locale } from '../../../../i18n-config';

export default async function ShippingReturnsPage({ params }: { params: { lang: Locale } }) {
    const dict = await getDictionary(params.lang);

    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            <h1 className="text-4xl font-serif text-center mb-12">{dict.footer?.shipping || 'Envíos y Devoluciones'}</h1>

            <div className="space-y-12 text-ms-stone text-sm leading-relaxed">

                {/* Shipping info */}
                <section>
                    <h2 className="text-2xl font-serif text-ms-black mb-4">
                        {params.lang === 'es' ? 'Políticas de Envío' : 'Shipping Policies'}
                    </h2>
                    <div className="space-y-4">
                        <p>
                            {params.lang === 'es'
                                ? 'Realizamos envíos a todo el Perú utilizando couriers seguros y confiables para garantizar que tus prendas lleguen en perfectas condiciones.'
                                : 'We ship throughout Peru using secure and reliable couriers to ensure your garments arrive in perfect condition.'}
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>
                                <strong>{params.lang === 'es' ? 'Lima Metropolitana' : 'Lima Metropolitan Area'}:</strong>
                                {params.lang === 'es' ? ' 1-3 días hábiles.' : ' 1-3 business days.'}
                            </li>
                            <li>
                                <strong>{params.lang === 'es' ? 'Provincias' : 'Provinces'}:</strong>
                                {params.lang === 'es' ? ' 3-7 días hábiles dependiendo de la localidad.' : ' 3-7 business days depending on the location.'}
                            </li>
                            <li>
                                <strong>{params.lang === 'es' ? 'Despacho Rápido' : 'Fast Dispatch'}:</strong>
                                {params.lang === 'es' ? ' Procesamos pedidos de lunes a viernes en un plazo máximo de 48 horas.' : ' We process orders Monday through Friday within a maximum of 48 hours.'}
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Returns info */}
                <section>
                    <h2 className="text-2xl font-serif text-ms-black mb-4">
                        {params.lang === 'es' ? 'Cambios y Devoluciones' : 'Returns & Exchanges'}
                    </h2>
                    <div className="space-y-4">
                        <p>
                            {params.lang === 'es'
                                ? 'Queremos que estés completamente satisfecho con tu compra. Si no es así, puedes solicitar un cambio o crédito a tu favor.'
                                : 'We want you to be completely satisfied with your purchase. If not, you can request an exchange or store credit.'}
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>
                                {params.lang === 'es'
                                    ? 'Plazo máximo de 7 días calendario tras recibir tu pedido.'
                                    : 'Maximum period of 7 calendar days after receiving your order.'}
                            </li>
                            <li>
                                {params.lang === 'es'
                                    ? 'Las prendas deben estar en su estado original, sin uso, sin lavar y con todas sus etiquetas y empaques intactos.'
                                    : 'Garments must be in their original condition, unworn, unwashed, and with all tags and packaging intact.'}
                            </li>
                            <li>
                                {params.lang === 'es'
                                    ? 'Ropa interior, calcetines y productos de liquidación final no aplican para cambios ni devoluciones por razones de higiene.'
                                    : 'Underwear, socks, and final sale items are not eligible for exchange or return for hygiene reasons.'}
                            </li>
                        </ul>
                        <p className="mt-4 font-medium text-ms-black">
                            {params.lang === 'es' ? '¿Cómo solicitar un cambio?' : 'How to request an exchange?'}
                        </p>
                        <p>
                            {params.lang === 'es'
                                ? 'Escríbenos a nuestro correo o WhatsApp de servicio al cliente indicando tu número de pedido y los detalles del cambio.'
                                : 'Write to our customer service email or WhatsApp indicating your order number and exchange details.'}
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}
