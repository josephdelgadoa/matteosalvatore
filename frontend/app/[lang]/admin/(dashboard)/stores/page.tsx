'use client';

import React, { useEffect, useState } from 'react';
import { storesApi, Store } from '@/lib/api/stores';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, Trash, Edit2 } from 'lucide-react';
import { useToast, ToastContainer } from '@/components/ui/Toast';
import { Spinner } from '@/components/ui/Spinner';

export default function StoresPage() {
    const [stores, setStores] = useState<Store[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<Store>>({ name: '', address: '' });
    const { addToast } = useToast();

    const loadStores = async () => {
        try {
            const data = await storesApi.getAll();
            setStores(data);
        } catch (err) {
            addToast('Error al cargar tiendas', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadStores();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await storesApi.update(isEditing, formData);
                addToast('Tienda actualizada', 'success');
            } else {
                await storesApi.create(formData);
                addToast('Tienda creada', 'success');
            }
            setIsEditing(null);
            setFormData({ name: '', address: '' });
            loadStores();
        } catch (err) {
            addToast('Error al guardar tienda', 'error');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar esta tienda?')) return;
        try {
            await storesApi.delete(id);
            addToast('Tienda eliminada', 'success');
            loadStores();
        } catch (err) {
            addToast('Error al eliminar tienda', 'error');
        }
    };

    if (isLoading) return <div className="flex justify-center p-20"><Spinner /></div>;

    return (
        <div className="space-y-8">
            <ToastContainer />
            <div className="flex justify-between items-center">
                <h1 className="ms-heading-2">Gestión de Tiendas</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-ms-white p-6 border border-ms-fog h-fit">
                    <h3 className="font-medium mb-4">{isEditing ? 'Editar Tienda' : 'Nueva Tienda'}</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Nombre de la Tienda"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                        <Input
                            label="Dirección"
                            value={formData.address}
                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                            required
                        />
                        <div className="flex gap-2">
                            <Button type="submit" className="flex-1">
                                {isEditing ? 'Actualizar' : 'Crear Tienda'}
                            </Button>
                            {isEditing && (
                                <Button variant="outline" onClick={() => { setIsEditing(null); setFormData({ name: '', address: '' }); }}>
                                    Cancelar
                                </Button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="lg:col-span-2 space-y-4">
                    {stores.map(store => (
                        <div key={store.id} className="bg-ms-white p-4 border border-ms-fog flex justify-between items-center">
                            <div>
                                <h4 className="font-medium text-lg">{store.name}</h4>
                                <p className="text-sm text-ms-stone">{store.address}</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => { setIsEditing(store.id); setFormData(store); }}>
                                    <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="sm" className="text-red-500" onClick={() => handleDelete(store.id)}>
                                    <Trash className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                    {stores.length === 0 && <p className="text-ms-stone italic">No hay tiendas registradas.</p>}
                </div>
            </div>
        </div>
    );
}
