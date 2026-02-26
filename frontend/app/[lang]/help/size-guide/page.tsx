import React from 'react';
import { getDictionary } from '../../../../get-dictionary';
import { Locale } from '../../../../i18n-config';

export default async function SizeGuidePage({ params }: { params: { lang: Locale } }) {
    const dict = await getDictionary(params.lang);

    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            <h1 className="text-4xl font-serif text-center mb-12">{dict.footer?.sizeGuide || 'Guía de Tallas'}</h1>

            <div className="prose prose-sm sm:prose lg:prose-lg mx-auto text-ms-stone">
                <p className="mb-8">
                    {params.lang === 'es'
                        ? 'Encuentra la talla perfecta para ti con nuestra tabla de medidas. Recomendamos tomar tus medidas reales sin ropa ajustada para mayor precisión.'
                        : 'Find your perfect fit with our size chart. We recommend taking your actual measurements without tight clothing for greater accuracy.'}
                </p>

                <h2 className="text-2xl font-serif text-ms-black mt-8 mb-4">
                    {params.lang === 'es' ? 'Ropa Superior (Polos, Hoodies, Casacas)' : 'Tops (Polos, Hoodies, Jackets)'}
                </h2>
                <div className="overflow-x-auto mb-10">
                    <table className="min-w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-ms-fog uppercase text-xs tracking-wider text-ms-black">
                                <th className="p-4 border border-gray-200">{params.lang === 'es' ? 'Talla' : 'Size'}</th>
                                <th className="p-4 border border-gray-200">{params.lang === 'es' ? 'Pecho' : 'Chest'} (cm)</th>
                                <th className="p-4 border border-gray-200">{params.lang === 'es' ? 'Cintura' : 'Waist'} (cm)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td className="p-4 border border-gray-200">S</td><td className="p-4 border border-gray-200">90 - 95</td><td className="p-4 border border-gray-200">76 - 81</td></tr>
                            <tr className="bg-gray-50"><td className="p-4 border border-gray-200">M</td><td className="p-4 border border-gray-200">96 - 101</td><td className="p-4 border border-gray-200">82 - 87</td></tr>
                            <tr><td className="p-4 border border-gray-200">L</td><td className="p-4 border border-gray-200">102 - 107</td><td className="p-4 border border-gray-200">88 - 93</td></tr>
                            <tr className="bg-gray-50"><td className="p-4 border border-gray-200">XL</td><td className="p-4 border border-gray-200">108 - 113</td><td className="p-4 border border-gray-200">94 - 100</td></tr>
                        </tbody>
                    </table>
                </div>

                <h2 className="text-2xl font-serif text-ms-black mt-8 mb-4">
                    {params.lang === 'es' ? 'Ropa Inferior (Pantalones, Joggers)' : 'Bottoms (Pants, Joggers)'}
                </h2>
                <div className="overflow-x-auto mb-10">
                    <table className="min-w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-ms-fog uppercase text-xs tracking-wider text-ms-black">
                                <th className="p-4 border border-gray-200">{params.lang === 'es' ? 'Talla' : 'Size'}</th>
                                <th className="p-4 border border-gray-200">{params.lang === 'es' ? 'Cintura' : 'Waist'} (cm)</th>
                                <th className="p-4 border border-gray-200">{params.lang === 'es' ? 'Cadera' : 'Hip'} (cm)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td className="p-4 border border-gray-200">28 (XS)</td><td className="p-4 border border-gray-200">71 - 74</td><td className="p-4 border border-gray-200">86 - 89</td></tr>
                            <tr className="bg-gray-50"><td className="p-4 border border-gray-200">30 (S)</td><td className="p-4 border border-gray-200">76 - 79</td><td className="p-4 border border-gray-200">91 - 94</td></tr>
                            <tr><td className="p-4 border border-gray-200">32 (M)</td><td className="p-4 border border-gray-200">81 - 84</td><td className="p-4 border border-gray-200">96 - 99</td></tr>
                            <tr className="bg-gray-50"><td className="p-4 border border-gray-200">34 (L)</td><td className="p-4 border border-gray-200">86 - 89</td><td className="p-4 border border-gray-200">101 - 104</td></tr>
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}
