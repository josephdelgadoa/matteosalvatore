import React from 'react';

export default function TermsPage({ params: { lang } }: { params: { lang: string } }) {
    const isEs = lang === 'es';

    return (
        <div className="container mx-auto px-4 py-12 md:py-20 max-w-3xl animate-fade-in text-ms-black">
            <h1 className="ms-heading-2 mb-8">{isEs ? 'Términos de Servicio' : 'Terms of Service'}</h1>

            <div className="prose prose-stone max-w-none space-y-6">
                <p>
                    {isEs
                        ? 'Al acceder al sitio web en '
                        : 'By accessing the website at '}
                    <a href="https://matteosalvatore.pe" className="underline">matteosalvatore.pe</a>
                    {isEs
                        ? ', usted acepta estar sujeto a estos términos de servicio, a todas las leyes y regulaciones aplicables, y acepta que es responsable del cumplimiento de las leyes locales aplicables. Si no está de acuerdo con alguno de estos términos, tiene prohibido usar o acceder a este sitio.'
                        : ', you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.'}
                </p>

                <h3 className="text-lg font-medium mt-6 mb-2">
                    {isEs ? 'Licencia de Uso' : 'Use License'}
                </h3>
                <p>
                    {isEs
                        ? 'Se concede permiso para descargar temporalmente una copia de los materiales (información o software) en el sitio web de Matteo Salvatore solo para visualización transitoria personal y no comercial. Esta es la concesión de una licencia, no una transferencia de título, y bajo esta licencia usted no puede:'
                        : 'Permission is granted to temporarily download one copy of the materials (information or software) on Matteo Salvatore\'s website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:'}
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li>{isEs ? 'modificar o copiar los materiales;' : 'modify or copy the materials;'}</li>
                    <li>{isEs ? 'usar los materiales para cualquier propósito comercial o para cualquier exhibición pública;' : 'use the materials for any commercial purpose, or for any public display (commercial or non-commercial);'}</li>
                    <li>{isEs ? 'intentar descompilar o aplicar ingeniería inversa a cualquier software contenido en el sitio web;' : 'attempt to decompile or reverse engineer any software contained on Matteo Salvatore\'s website;'}</li>
                    <li>{isEs ? 'eliminar cualquier derecho de autor u otras anotaciones de propiedad de los materiales; o' : 'remove any copyright or other proprietary notations from the materials; or'}</li>
                    <li>{isEs ? 'transferir los materiales a otra persona o "reflejar" los materiales en cualquier otro servidor.' : 'transfer the materials to another person or "mirror" the materials on any other server.'}</li>
                </ul>

                <h3 className="text-lg font-medium mt-6 mb-2">
                    {isEs ? 'Descargo de Responsabilidad' : 'Disclaimer'}
                </h3>
                <p>
                    {isEs
                        ? 'Los materiales en el sitio web de Matteo Salvatore se proporcionan "tal cual". Matteo Salvatore no ofrece garantías, expresas o implícitas, y por la presente renuncia y niega todas las demás garantías, incluyendo, sin limitación, garantías implícitas o condiciones de comerciabilidad, idoneidad para un propósito particular o no infracción de propiedad intelectual u otra violación de derechos.'
                        : 'The materials on Matteo Salvatore\'s website are provided on an \'as is\' basis. Matteo Salvatore makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.'}
                </p>

                <h3 className="text-lg font-medium mt-6 mb-2">
                    {isEs ? 'Limitaciones' : 'Limitations'}
                </h3>
                <p>
                    {isEs
                        ? 'En ningún caso Matteo Salvatore o sus proveedores serán responsables de ningún daño (incluidos, entre otros, daños por pérdida de datos o ganancias, o debido a la interrupción del negocio) que surja del uso o la incapacidad de usar los materiales en el sitio web de Matteo Salvatore.'
                        : 'In no event shall Matteo Salvatore or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Matteo Salvatore\'s website.'}
                </p>

                <h3 className="text-lg font-medium mt-6 mb-2">
                    {isEs ? 'Precisión de los Materiales' : 'Accuracy of Materials'}
                </h3>
                <p>
                    {isEs
                        ? 'Los materiales que aparecen en el sitio web de Matteo Salvatore pueden incluir errores técnicos, tipográficos o fotográficos. Matteo Salvatore no garantiza que ninguno de los materiales de su sitio web sea preciso, completo o actual. Matteo Salvatore puede realizar cambios en los materiales contenidos en su sitio web en cualquier momento sin previo aviso.'
                        : 'The materials appearing on Matteo Salvatore\'s website could include technical, typographical, or photographic errors. Matteo Salvatore does not warrant that any of the materials on its website are accurate, complete or current. Matteo Salvatore may make changes to the materials contained on its website at any time without notice.'}
                </p>
            </div>
        </div>
    );
}
