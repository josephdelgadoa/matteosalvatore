'use client';

import React, { useState } from 'react';

export default function ComplaintsPage() {
    const [formData, setFormData] = useState({
        consumer_name: '',
        consumer_id_type: 'DNI',
        consumer_id_number: '',
        consumer_address: '',
        consumer_phone: '',
        consumer_email: '',
        product_type: 'Bien',
        product_description: '',
        complaint_type: 'Queja',
        complaint_details: '',
        proposed_solution: '',
        accepted_terms: false
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.accepted_terms) {
            alert("Debe aceptar las condiciones y el tratamiento de sus datos personales.");
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/complaints`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Error al enviar el reclamo');
            }

            setSubmitStatus({
                type: 'success',
                message: 'Su presentación ha sido enviada exitosamente. Nos pondremos en contacto con usted.'
            });

            // Reset form
            setFormData({
                consumer_name: '',
                consumer_id_type: 'DNI',
                consumer_id_number: '',
                consumer_address: '',
                consumer_phone: '',
                consumer_email: '',
                product_type: 'Bien',
                product_description: '',
                complaint_type: 'Queja',
                complaint_details: '',
                proposed_solution: '',
                accepted_terms: false
            });
        } catch (error) {
            setSubmitStatus({
                type: 'error',
                message: 'Ocurrió un error al enviar el formulario. Por favor, intente nuevamente más tarde.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-3xl font-bold text-center mb-8">Libro de Reclamaciones Virtual</h1>

            <div className="border border-gray-300 p-6 mb-8 text-sm text-gray-700 bg-gray-50 uppercase tracking-wide">
                <p className="font-bold mb-1">INVERSIONES MATTEO SALVATORE SAC.</p>
                <p>RUC: 20613099752</p>
                <p>Teléfono: +51 908 913 172</p>
                <p>Correo: gloriaquispe@matteosalvatore.pe</p>
                <p>Sitio Web: matteosalvatore.pe</p>
            </div>

            <p className="mb-8 text-sm text-gray-600">
                Tu opinión nos ayuda a mejorar en nuestro trabajo, por favor, escribe tu reclamo en las siguientes líneas.
            </p>

            {submitStatus && (
                <div className={`p-4 mb-8 rounded ${submitStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {submitStatus.message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8 text-sm">
                {/* 1. Datos del consumidor reclamante */}
                <section>
                    <h2 className="text-lg font-bold mb-4">1. Datos del consumidor reclamante</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block mb-1 font-medium">Nombre completo *</label>
                            <input required type="text" name="consumer_name" value={formData.consumer_name} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded focus:ring-black focus:border-black outline-none" placeholder="Ingrese su nombre completo" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block mb-1 font-medium">Tipo de Documento *</label>
                                <select name="consumer_id_type" value={formData.consumer_id_type} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded focus:ring-black focus:border-black outline-none bg-white">
                                    <option value="DNI">DNI</option>
                                    <option value="CE">Carné de Extranjería</option>
                                    <option value="PASAPORTE">Pasaporte</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block mb-1 font-medium">Número de documento *</label>
                                <input required type="text" name="consumer_id_number" value={formData.consumer_id_number} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded focus:ring-black focus:border-black outline-none" placeholder="Número de documento" />
                            </div>
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Dirección *</label>
                            <input required type="text" name="consumer_address" value={formData.consumer_address} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded focus:ring-black focus:border-black outline-none" placeholder="Dirección completa" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-1 font-medium">Teléfono *</label>
                                <input required type="text" name="consumer_phone" value={formData.consumer_phone} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded focus:ring-black focus:border-black outline-none" placeholder="Número de teléfono" />
                            </div>
                            <div>
                                <label className="block mb-1 font-medium">Correo electrónico *</label>
                                <input required type="email" name="consumer_email" value={formData.consumer_email} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded focus:ring-black focus:border-black outline-none" placeholder="correo@ejemplo.com" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. Identificación del bien contratado */}
                <section>
                    <h2 className="text-lg font-bold mb-4">2. Identificación del bien contratado</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block mb-2 font-medium">Tipo de bien contratado *</label>
                            <div className="flex space-x-6">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input type="radio" name="product_type" value="Bien" checked={formData.product_type === 'Bien'} onChange={handleChange} className="form-radio text-black focus:ring-black" />
                                    <span>Bien</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input type="radio" name="product_type" value="Servicio" checked={formData.product_type === 'Servicio'} onChange={handleChange} className="form-radio text-black focus:ring-black" />
                                    <span>Servicio</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Descripción del bien o servicio *</label>
                            <input required type="text" name="product_description" value={formData.product_description} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded focus:ring-black focus:border-black outline-none" placeholder="Describa el producto o servicio" />
                        </div>
                    </div>
                </section>

                {/* 3. Detalle de la reclamación o queja */}
                <section>
                    <h2 className="text-lg font-bold mb-4">3. Detalle de la reclamación o queja</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block mb-2 font-medium">Tipo *</label>
                            <div className="flex space-x-6">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input type="radio" name="complaint_type" value="Queja" checked={formData.complaint_type === 'Queja'} onChange={handleChange} className="form-radio text-black focus:ring-black" />
                                    <span>Queja</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input type="radio" name="complaint_type" value="Reclamo" checked={formData.complaint_type === 'Reclamo'} onChange={handleChange} className="form-radio text-black focus:ring-black" />
                                    <span>Reclamo</span>
                                </label>
                            </div>
                            <div className="mt-2 text-xs text-gray-500 space-y-1">
                                <p><strong>Queja:</strong> Malestar o descontento respecto a la atención al público.</p>
                                <p><strong>Reclamo:</strong> Disconformidad relacionada con los productos o servicios.</p>
                            </div>
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Detalle de su reclamo o queja *</label>
                            <textarea required rows={4} name="complaint_details" value={formData.complaint_details} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded focus:ring-black focus:border-black outline-none" placeholder="Describa detalladamente su reclamo o queja"></textarea>
                        </div>
                    </div>
                </section>

                {/* 4. Propuesta de solución */}
                <section>
                    <h2 className="text-lg font-bold mb-4">4. Propuesta de solución</h2>

                    <div>
                        <label className="block mb-1 font-medium">¿Qué solución propone para resolver su reclamo? (opcional)</label>
                        <textarea rows={3} name="proposed_solution" value={formData.proposed_solution} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded focus:ring-black focus:border-black outline-none" placeholder="Describa qué solución considera apropiada para resolver su problema (ej: reembolso, cambio de producto, reparación, disculpa formal, etc.)"></textarea>
                    </div>
                </section>

                {/* 5. Cláusula de aceptación */}
                <section>
                    <h2 className="text-lg font-bold mb-4">5. Cláusula de aceptación</h2>
                    <div className="text-xs text-gray-600 space-y-2 mb-4">
                        <p>Declaro ser el titular de la información brindada en este formulario y acepto el tratamiento de mis datos personales conforme a la Ley N° 29733 – Ley de Protección de Datos Personales.</p>
                    </div>
                    <label className="flex items-center space-x-2 cursor-pointer mb-6">
                        <input required type="checkbox" name="accepted_terms" checked={formData.accepted_terms} onChange={handleChange} className="form-checkbox text-black focus:ring-black rounded" />
                        <span className="font-medium">Acepto las condiciones y el tratamiento de mis datos personales</span>
                    </label>
                </section>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#242424] text-white px-8 py-3 rounded text-sm font-medium hover:bg-black transition-colors disabled:opacity-50"
                >
                    {isSubmitting ? 'Enviando...' : 'Enviar Reclamo'}
                </button>

            </form>

            <div className="mt-12 text-xs text-gray-500 space-y-4 border-t pt-8">
                <p>La formulación del reclamo no impide acudir a otras vías de solución de controversias ni es requisito previo para interponer una denuncia ante el INDECOPI.</p>
                <p>INVERSIONES MATTEO SALVATORE SAC. deberá dar respuesta al reclamo en un plazo no mayor a quince (15) días hábiles. Este plazo es improrrogable.</p>
                <p>El tratamiento de sus datos personales en este portal tiene por finalidad gestionar de manera correcta su reclamo o queja conforme las disposiciones legales sobre la materia y llevar un registro histórico de la casuística presentada a fin de mejorar nuestros niveles de atención.</p>
            </div>
        </div>
    );
}
