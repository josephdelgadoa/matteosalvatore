import React from 'react';
import { getDictionary } from '../../../../get-dictionary';
import { Locale } from '../../../../i18n-config';

export default async function ReturnsPage({ params }: { params: { lang: Locale } }) {
    const dict = await getDictionary(params.lang);

    const isEs = params.lang === 'es';

    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            <h1 className="text-4xl font-serif text-center mb-12">{isEs ? 'Política de Cambios y Devoluciones' : 'Returns & Exchanges Policy'}</h1>

            <div className="space-y-12 text-ms-stone text-sm leading-relaxed">
                <section>
                    <h2 className="text-2xl font-serif text-ms-black mb-4">
                        {isEs ? 'Compromiso de Calidad' : 'Quality Commitment'}
                    </h2>
                    <div className="space-y-4">
                        <p>
                            {isEs
                                ? 'En Matteo Salvatore, nos esforzamos por ofrecer productos de la más alta calidad. Queremos que estés completamente satisfecho con tu compra. Si por alguna razón no lo estás, estamos aquí para ayudarte con el proceso de cambio o devolución.'
                                : 'At Matteo Salvatore, we strive to offer products of the highest quality. We want you to be completely satisfied with your purchase. If for any reason you are not, we are here to help you with the exchange or return process.'}
                        </p>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-serif text-ms-black mb-4">
                        {isEs ? 'Condiciones para Cambios y Devoluciones' : 'Conditions for Exchanges and Returns'}
                    </h2>
                    <div className="space-y-4">
                        <ul className="list-disc pl-5 space-y-2">
                            <li>
                                {isEs
                                    ? 'El plazo para realizar cualquier cambio o devolución es de 7 días calendario a partir de la fecha de recepción del producto.'
                                    : 'The period to make any exchange or return is 7 calendar days from the date of receipt of the product.'}
                            </li>
                            <li>
                                {isEs
                                    ? 'Las prendas deben estar en su estado original, sin uso, sin lavar y con todas las etiquetas y empaques originales intactos.'
                                    : 'Garments must be in their original condition, unworn, unwashed, and with all original tags and packaging intact.'}
                            </li>
                            <li>
                                {isEs
                                    ? 'Es indispensable presentar el comprobante de pago (boleta o factura) correspondiente a la compra.'
                                    : 'It is essential to present the proof of purchase (receipt or invoice) corresponding to the purchase.'}
                            </li>
                            <li>
                                {isEs
                                    ? 'Por razones de higiene, no se aceptan cambios ni devoluciones de ropa interior, medias o productos de uso personal, a menos que presenten fallas de fabricación.'
                                    : 'For hygiene reasons, exchanges or returns of underwear, socks or products for personal use are not accepted, unless they have manufacturing defects.'}
                            </li>
                        </ul>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-serif text-ms-black mb-4">
                        {isEs ? 'Proceso de Cambio' : 'Exchange Process'}
                    </h2>
                    <div className="space-y-4">
                        <p>
                            {isEs
                                ? 'Si deseas cambiar un producto por talle o color, puedes hacerlo acercándote a nuestras tiendas físicas o gestionándolo a través de nuestro servicio de atención al cliente.'
                                : 'If you wish to exchange a product for size or color, you can do so by visiting our physical stores or managing it through our customer service.'}
                        </p>
                        <p>
                            {isEs
                                ? 'En caso de envíos, los costos de transporte para cambios por motivos ajenos a fallas de origen correrán por cuenta del cliente.'
                                : 'In the case of shipping, the transportation costs for exchanges for reasons other than manufacturing defects will be borne by the customer.'}
                        </p>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-serif text-ms-black mb-4">
                        {isEs ? 'Devoluciones y Reembolsos' : 'Returns and Refunds'}
                    </h2>
                    <div className="space-y-4">
                        <p>
                            {isEs
                                ? 'Las devoluciones de dinero se realizarán a través del mismo medio de pago utilizado en la compra original.'
                                : 'Refunds will be made through the same payment method used in the original purchase.'}
                        </p>
                        <p>
                            {isEs
                                ? 'El tiempo de procesamiento del reembolso puede variar dependiendo de la entidad financiera, generalmente entre 7 a 15 días hábiles.'
                                : 'The processing time for the refund may vary depending on the financial institution, generally between 7 to 15 business days.'}
                        </p>
                    </div>
                </section>

                <section className="bg-ms-ivory p-8">
                    <h2 className="text-2xl font-serif text-ms-black mb-4">
                        {isEs ? 'Atención al Cliente' : 'Customer Service'}
                    </h2>
                    <div className="space-y-4">
                        <p>
                            {isEs
                                ? 'Para iniciar un proceso de cambio o devolución, por favor contáctanos:'
                                : 'To start an exchange or return process, please contact us:'}
                        </p>
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
