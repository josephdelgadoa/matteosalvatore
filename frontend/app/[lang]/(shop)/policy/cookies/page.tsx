import React from 'react';

export default function CookiePolicyPage({ params: { lang } }: { params: { lang: string } }) {
    const isEs = lang === 'es';

    return (
        <div className="container mx-auto px-4 py-12 md:py-20 max-w-3xl animate-fade-in text-ms-black">
            <h1 className="ms-heading-2 mb-8">{isEs ? 'Política de Cookies' : 'Cookie Policy'}</h1>

            <div className="prose prose-stone max-w-none space-y-6">
                <p>
                    {isEs
                        ? 'Esta política de cookies explica qué son las cookies y cómo las usamos en '
                        : 'This cookie policy explains what cookies are and how we use them on '}
                    <a href="https://matteosalvatore.pe" className="underline font-medium hover:text-ms-stone transition-colors">matteosalvatore.pe</a>.
                </p>

                <h3 className="text-xl font-serif mt-8 mb-4 border-b pb-2">
                    {isEs ? '¿Qué son las cookies?' : 'What are cookies?'}
                </h3>
                <p>
                    {isEs
                        ? 'Las cookies son pequeños archivos de texto que los sitios web almacenan en su dispositivo (computadora, tableta, teléfono inteligente) cuando los visita. Se utilizan ampliamente para hacer que los sitios web funcionen, de manera más eficiente, así como para proporcionar información a los propietarios del sitio.'
                        : 'Cookies are small text files that websites store on your device (computer, tablet, smartphone) when you visit them. They are widely used to make websites work, or work more efficiently, as well as to provide information to the owners of the site.'}
                </p>

                <h3 className="text-xl font-serif mt-8 mb-4 border-b pb-2">
                    {isEs ? 'Cómo usamos las cookies' : 'How we use cookies'}
                </h3>
                <p>
                    {isEs
                        ? 'En Matteo Salvatore utilizamos cookies para:'
                        : 'At Matteo Salvatore, we use cookies to:'}
                </p>
                <ul className="list-disc pl-5 space-y-3 mt-4 text-ms-stone">
                    <li>
                        <strong className="text-ms-black items-center">{isEs ? 'Proporcionar funciones básicas:' : 'Provide basic functions:'}</strong>{' '}
                        {isEs ? 'Algunas cookies son necesarias para navegar y utilizar funciones clave de la web, como el carrito de compras y áreas seguras.' : 'Some cookies are necessary for navigating and using key web functions, such as the shopping cart and secure areas.'}
                    </li>
                    <li>
                        <strong className="text-ms-black">{isEs ? 'Mejorar el rendimiento:' : 'Improve performance:'}</strong>{' '}
                        {isEs ? 'Recopilamos información sobre cómo usa nuestra web (páginas visitadas, enlaces clickeados) para ayudar a mejorar el servicio que ofrecemos.' : 'We collect information about how you use our web (pages visited, links clicked) to help improve the service we offer.'}
                    </li>
                    <li>
                        <strong className="text-ms-black">{isEs ? 'Personalizar su experiencia:' : 'Personalize your experience:'}</strong>{' '}
                        {isEs ? 'Las cookies nos permiten recordar las elecciones que hace (como su idioma preferido o la región en la que se encuentra) para brindarle experiencias más personalizadas.' : 'Cookies allow us to remember the choices you make (such as your preferred language or the region you are in) to provide you with more personalized experiences.'}
                    </li>
                    <li>
                        <strong className="text-ms-black">{isEs ? 'Fines de marketing:' : 'Marketing purposes:'}</strong>{' '}
                        {isEs ? 'Podemos utilizar cookies para rastrear sus hábitos de navegación y mostrarle publicidad más relevante.' : 'We may use cookies to track your browsing habits and show you more relevant advertising.'}
                    </li>
                </ul>

                <h3 className="text-xl font-serif mt-8 mb-4 border-b pb-2">
                    {isEs ? 'Gestión de sus preferencias' : 'Managing your preferences'}
                </h3>
                <p>
                    {isEs
                        ? 'Puede administrar sus preferencias de cookies cambiando la configuración de su navegador web en cualquier momento. Sin embargo, tenga en cuenta que deshabilitar cookies puede afectar la funcionalidad de nuestro sitio.'
                        : 'You can manage your cookie preferences by changing the settings of your web browser at any time. However, please note that disabling cookies may affect the functionality of our site.'}
                </p>

                <div className="mt-12 p-6 bg-ms-fog rounded-xl border border-ms-stone/10">
                    <p className="text-sm text-ms-stone mb-2">
                        {isEs ? 'Última actualización: 25 de febrero de 2026' : 'Last updated: February 25, 2026'}
                    </p>
                    <p className="text-sm font-medium">
                        {isEs ? '¿Tiene más preguntas?' : 'Have more questions?'} <a href={`/${lang}/contact`} className="underline decoration-ms-stone hover:text-ms-stone transition-colors">{isEs ? 'Contáctenos' : 'Contact us'}</a>.
                    </p>
                </div>
            </div>
        </div>
    );
}
