'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api/api';
import { Spinner } from '@/components/ui/Spinner';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface HealthData {
    uptime: number;
    message: string;
    environment: {
        node_env: string;
        supabase_url_set: boolean;
        supabase_key_set: boolean;
        port: string;
    };
    database: {
        status: string;
        error?: string;
        latency?: string;
        product_count?: number;
    };
}

export default function AdminHealthPage() {
    const [health, setHealth] = useState<HealthData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchHealth = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.get('/health');
            setHealth(data);
        } catch (err: any) {
            console.error('Health check failed', err);
            setError(err.message || 'Failed to fetch health status');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHealth();
    }, []);

    if (loading) return <div className="p-10 flex justify-center"><Spinner /></div>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">System Health Disagnostics</h1>

            <div className="grid gap-6">
                {/* GLOBAL STATUS */}
                <div className={`p-4 rounded-lg border ${error ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                    <div className="flex items-center gap-3">
                        {error ? <XCircle className="text-red-600" /> : <CheckCircle className="text-green-600" />}
                        <div>
                            <h2 className="font-semibold text-lg">{error ? 'System Unhealthy' : 'System Operational'}</h2>
                            {error && <p className="text-red-700">{error}</p>}
                        </div>
                    </div>
                </div>

                {/* FRONTEND CONFIG */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="font-semibold mb-4 text-lg border-b pb-2">Frontend Configuration</h3>
                    <div className="space-y-2 font-mono text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">NEXT_PUBLIC_API_URL:</span>
                            <span className="bg-gray-100 px-2 py-1 rounded">{process.env.NEXT_PUBLIC_API_URL}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">NEXT_PUBLIC_SUPABASE_URL:</span>
                            <span className="bg-gray-100 px-2 py-1 rounded">{process.env.NEXT_PUBLIC_SUPABASE_URL}</span>
                        </div>
                    </div>
                </div>

                {/* BACKEND STATUS */}
                {health && (
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <h3 className="font-semibold mb-4 text-lg border-b pb-2">Backend Diagnostics</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Environment */}
                            <div>
                                <h4 className="font-medium text-gray-700 mb-2">Environment</h4>
                                <ul className="space-y-2">
                                    <StatusItem label="NODE_ENV" value={health.environment.node_env} success={true} />
                                    <StatusItem
                                        label="SUPABASE_URL"
                                        value={health.environment.supabase_url_set ? 'Set' : 'MISSING'}
                                        success={health.environment.supabase_url_set}
                                    />
                                    <StatusItem
                                        label="SUPABASE_SERVICE_KEY"
                                        value={health.environment.supabase_key_set ? 'Set' : 'MISSING'}
                                        success={health.environment.supabase_key_set}
                                    />
                                </ul>
                            </div>

                            {/* Database */}
                            <div>
                                <h4 className="font-medium text-gray-700 mb-2">Database Connection</h4>
                                <ul className="space-y-2">
                                    <StatusItem
                                        label="Status"
                                        value={health.database.status}
                                        success={health.database.status === 'connected'}
                                    />
                                    <StatusItem
                                        label="Latency"
                                        value={health.database.latency || 'N/A'}
                                        success={true}
                                    />
                                    <StatusItem
                                        label="Product Count"
                                        value={health.database.product_count?.toString() || '0'}
                                        success={!!health.database.product_count}
                                    />
                                    {health.database.error && (
                                        <li className="text-red-600 text-sm mt-2 font-mono bg-red-50 p-2 rounded">
                                            {health.database.error}
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <button
                onClick={fetchHealth}
                className="mt-6 px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800"
            >
                Refresh Status
            </button>
        </div>
    );
}

function StatusItem({ label, value, success }: { label: string, value: string, success: boolean }) {
    return (
        <li className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{label}:</span>
            <span className={`font-medium px-2 py-0.5 rounded ${success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {value}
            </span>
        </li>
    );
}
