import React from 'react';

export default function PrivacyPolicyPage({ params: { lang } }: { params: { lang: string } }) {
    const isEs = lang === 'es';

    return (
        <div className="container mx-auto px-4 py-12 md:py-20 max-w-3xl animate-fade-in text-ms-black">
            <h1 className="ms-heading-2 mb-8">{isEs ? 'Política de Privacidad' : 'Privacy Policy'}</h1>

            <div className="prose prose-stone max-w-none space-y-6">
                <p>
                    {isEs
                        ? 'Su privacidad es importante para nosotros. La política de Matteo Salvatore es respetar su privacidad con respecto a cualquier información que podamos recopilar de usted en nuestro sitio web, '
                        : 'Your privacy is important to us. It is Matteo Salvatore\'s policy to respect your privacy regarding any information we may collect from you across our website, '}
                    <a href="https://matteosalvatore.pe" className="underline">matteosalvatore.pe</a>
                    {isEs
                        ? ', y otros sitios que poseemos y operamos.'
                        : ', and other sites we own and operate.'}
                </p>

                <h3 className="text-lg font-medium mt-6 mb-2">
                    {isEs ? 'Información que Recopilamos' : 'Information We Collect'}
                </h3>
                <p>
                    {isEs
                        ? 'Solo solicitamos información personal cuando realmente la necesitamos para brindarle un servicio. La recopilamos por medios justos y legales, con su conocimiento y consentimiento. También le informamos por qué la estamos recopilando y cómo se utilizará.'
                        : 'We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.'}
                </p>
                <p>
                    {isEs
                        ? 'Podemos recopilar información como su nombre, dirección de correo electrónico, número de teléfono y dirección de envío cuando realiza un pedido o se suscribe a nuestro boletín.'
                        : 'We may collect information such as your name, email address, phone number, and shipping address when you place an order or sign up for our newsletter.'}
                </p>

                <h3 className="text-lg font-medium mt-6 mb-2">
                    {isEs ? 'Cómo Utilizamos la Información' : 'How We Use Information'}
                </h3>
                <p>
                    {isEs
                        ? 'Utilizamos la información que recopilamos de varias maneras, incluyendo:'
                        : 'We use the information we collect in various ways, including to:'}
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li>{isEs ? 'Proporcionar, operar y mantener nuestro sitio web' : 'Provide, operate, and maintain our website'}</li>
                    <li>{isEs ? 'Mejorar, personalizar y expandir nuestro sitio web' : 'Improve, personalize, and expand our website'}</li>
                    <li>{isEs ? 'Comprender y analizar cómo utiliza nuestro sitio web' : 'Understand and analyze how you use our website'}</li>
                    <li>{isEs ? 'Desarrollar nuevos productos, servicios, características y funcionalidades' : 'Develop new products, services, features, and functionality'}</li>
                    <li>{isEs ? 'Procesar sus transacciones y administrar sus pedidos' : 'Process your transactions and manage your orders'}</li>
                    <li>{isEs ? 'Enviarle correos electrónicos, incluyendo confirmaciones de pedidos y boletines informativos' : 'Send you emails, including order confirmations and newsletters (if subscribed)'}</li>
                </ul>

                <h3 className="text-lg font-medium mt-6 mb-2">
                    {isEs ? 'Retención de Datos' : 'Data Retention'}
                </h3>
                <p>
                    {isEs
                        ? 'Solo retenemos la información recopilada durante el tiempo que sea necesario para brindarle el servicio solicitado. Los datos que almacenamos, los protegeremos dentro de medios comercialmente aceptables para evitar pérdidas y robos, así como acceso, divulgación, copia, uso o modificación no autorizados.'
                        : 'We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we’ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use, or modification.'}
                </p>

                <h3 className="text-lg font-medium mt-6 mb-2">
                    {isEs ? 'Compartir Información' : 'Sharing Information'}
                </h3>
                <p>
                    {isEs
                        ? 'No compartimos información de identificación personal públicamente ni con terceros, excepto cuando lo exija la ley o para facilitar nuestros servicios (por ejemplo, proveedores de envío, pasarelas de pago).'
                        : 'We don’t share any personally identifying information publicly or with third-parties, except when required to by law or to facilitate our services (e.g., shipping providers, payment gateways).'}
                </p>

                <h3 className="text-lg font-medium mt-6 mb-2">
                    {isEs ? 'Sus Derechos' : 'Your Rights'}
                </h3>
                <p>
                    {isEs
                        ? 'Usted es libre de rechazar nuestra solicitud de su información personal, en el entendido de que es posible que no podamos brindarle algunos de los servicios deseados. Tiene derecho a acceder, actualizar o eliminar su información personal en cualquier momento poniéndose en contacto con nosotros.'
                        : 'You are free to refuse our request for your personal information, with the understanding that we may be unable to provide you with some of your desired services. You have the right to access, update, or delete your personal information at any time by contacting us.'}
                </p>
            </div>
        </div>
    );
}
