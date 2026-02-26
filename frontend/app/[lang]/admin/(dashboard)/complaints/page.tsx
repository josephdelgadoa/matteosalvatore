'use client';

import React, { useEffect, useState } from 'react';
import { Download, FileText, Search } from 'lucide-react';
import * as XLSX from 'xlsx';
// @ts-ignore
import { Locale } from '../../../../../i18n-config';

export default function ComplaintsAdminPage({ params }: { params: { lang: Locale } }) {
    const [complaints, setComplaints] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch complaints from backend
    const fetchComplaints = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/complaints`);

            if (!res.ok) {
                throw new Error('Error al obtener reclamos');
            }

            const { data } = await res.json();
            setComplaints(data.complaints || []);
        } catch (err: any) {
            console.error('Error fetching complaints:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    const handleExportExcel = () => {
        if (complaints.length === 0) return;

        // Create a new workbook
        const wb = XLSX.utils.book_new();

        // Map data to a clean array of objects for Excel
        const dataForExcel = complaints.map(c => ({
            "Nro. Reclamo": c.complaint_number,
            "Fecha": new Date(c.created_at).toLocaleDateString(),
            "Estado": c.status === 'pending' ? 'Pendiente' : c.status,
            "Tipo": c.complaint_type,
            "Cliente": c.consumer_name,
            "Doc. Tipo": c.consumer_id_type,
            "Doc. Número": c.consumer_id_number,
            "Email": c.consumer_email,
            "Teléfono": c.consumer_phone,
            "Dirección": c.consumer_address,
            "Bien Contratado": c.product_type,
            "Detalle del Bien": c.product_description,
            "Detalle del Reclamo": c.complaint_details,
            "Propuesta de Solución": c.proposed_solution || 'Ninguna',
        }));

        // Create a worksheet from the data
        const ws = XLSX.utils.json_to_sheet(dataForExcel);

        // Adjust column widths automatically based on headers
        const colWidths = Object.keys(dataForExcel[0]).map(key => ({ wch: Math.max(key.length, 15) }));
        ws['!cols'] = colWidths;

        // Append standard formatting
        XLSX.utils.book_append_sheet(wb, ws, "Reclamaciones");

        // Write file and trigger download
        XLSX.writeFile(wb, `Libro_Reclamaciones_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    const filteredComplaints = complaints.filter(c =>
        c.complaint_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.consumer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.consumer_email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Libro de Reclamaciones</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Gestione las quejas y reclamos registrados por los clientes.
                    </p>
                </div>
                <button
                    onClick={handleExportExcel}
                    disabled={loading || complaints.length === 0}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                    <Download className="w-4 h-4" />
                    Exportar Excel
                </button>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar por Nro, Nombre o Email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black"
                    />
                </div>
                {/* Placeholder for future date filters if needed */}
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left whitespace-nowrap">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4">Nro. Reclamo</th>
                                <th className="px-6 py-4">Fecha</th>
                                <th className="px-6 py-4">Tipo</th>
                                <th className="px-6 py-4">Cliente</th>
                                <th className="px-6 py-4">Estado</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        <div className="flex justify-center flex-col items-center space-y-2">
                                            <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></span>
                                            <span>Cargando reclamaciones...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-red-500">
                                        Ocurrió un error: {error}
                                    </td>
                                </tr>
                            ) : filteredComplaints.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center space-y-3">
                                            <FileText className="w-8 h-8 text-gray-300" />
                                            <p>No se encontraron reclamaciones.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredComplaints.map((c) => (
                                    <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-black">
                                            {c.complaint_number}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {new Date(c.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${c.complaint_type === 'Queja' ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {c.complaint_type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-gray-900 font-medium">{c.consumer_name}</span>
                                                <span className="text-gray-500 text-xs">{c.consumer_email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex px-2.5 py-1 text-xs rounded-md bg-gray-100 text-gray-800 font-medium">
                                                {c.status === 'pending' ? 'Pendiente' : c.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {/* En el futuro se puede abrir un modal */}
                                            <button
                                                className="text-ms-primary hover:text-black font-medium transition-colors"
                                                onClick={() => alert(`Detalle en desarrollo.\n\nReclamo: ${c.complaint_details}`)}
                                            >
                                                Ver Detalle
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
