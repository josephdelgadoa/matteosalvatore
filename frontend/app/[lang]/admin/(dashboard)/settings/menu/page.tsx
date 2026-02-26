'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { menuApi, MenuItem } from '@/lib/api/menu';
import { useToast, ToastContainer } from '@/components/ui/Toast';
import { Spinner } from '@/components/ui/Spinner';
import { ChevronRight, ChevronDown, Plus, Trash2, GripVertical, Save, X } from 'lucide-react';
import { Locale } from '@/i18n-config';
import { useAdminDictionary } from '@/providers/AdminDictionaryProvider';

export default function MenuSettingsPage() {
    const dict = useAdminDictionary();
    const { addToast } = useToast();
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Edit State
    const [editingItem, setEditingItem] = useState<Partial<MenuItem> | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCreatingChild, setIsCreatingChild] = useState<string | null>(null); // Parent ID

    const [availableCategories, setAvailableCategories] = useState<any[]>([]);
    const [draggedAvailableItem, setDraggedAvailableItem] = useState<any | null>(null);
    const [draggedMenuItem, setDraggedMenuItem] = useState<MenuItem | null>(null);

    useEffect(() => {
        loadMenu();
        loadCategories();
    }, []);

    const loadMenu = async () => {
        try {
            setIsLoading(true);
            const data = await menuApi.getAll();
            setMenuItems(data);
        } catch (error) {
            console.error(error);
            addToast(dict.menuSettings.loadError, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            const { productCategoriesApi } = await import('@/lib/api/productCategories');
            const data = await productCategoriesApi.getAll();
            setAvailableCategories(data);
        } catch (error) {
            console.error('Failed to load categories', error);
        }
    };

    const handleCreateRoot = () => {
        setEditingItem({
            label_es: '',
            label_en: '',
            link_url: '',
            type: 'link',
            parent_id: null,
            display_order: menuItems.length,
            is_active: true
        });
        setIsCreatingChild(null);
        setIsEditModalOpen(true);
    };

    const handleCreateChild = (parentId: string) => {
        const parent = findItem(menuItems, parentId);
        const childCount = parent?.children?.length || 0;

        setEditingItem({
            label_es: '',
            label_en: '',
            link_url: '',
            type: 'link',
            parent_id: parentId,
            display_order: childCount,
            is_active: true
        });
        setIsCreatingChild(parentId);
        setIsEditModalOpen(true);
    };

    const handleEdit = (item: MenuItem) => {
        setEditingItem(item);
        setIsCreatingChild(null);
        setIsEditModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm(dict.menuSettings.deleteConfirm)) return;
        try {
            await menuApi.delete(id);
            addToast(dict.menuSettings.deleteSuccess, 'success');
            loadMenu();
        } catch (error) {
            addToast(dict.menuSettings.deleteError, 'error');
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingItem) return;

        setIsSaving(true);
        try {
            const payload = {
                ...editingItem,
                link_url: editingItem.link_url && editingItem.link_url.trim() !== '' ? editingItem.link_url.trim() : null,
                label_es: editingItem.label_es?.trim(),
                label_en: editingItem.label_en?.trim(),
                parent_id: editingItem.parent_id || null
            };

            if (editingItem.id) {
                await menuApi.update(editingItem.id, payload);
            } else {
                await menuApi.create(payload);
            }
            addToast(dict.menuSettings.saveSuccess, 'success');
            setIsEditModalOpen(false);
            loadMenu();
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.error || error.message || dict.menuSettings.saveErrorDefault;
            addToast(msg, 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const findItem = (items: MenuItem[], id: string): MenuItem | null => {
        for (const item of items) {
            if (item.id === id) return item;
            if (item.children) {
                const found = findItem(item.children, id);
                if (found) return found;
            }
        }
        return null;
    };

    // Drag and Drop Logic for adding from Left to Right
    const handleDragStartAvailable = (item: any, type: 'category' | 'page') => {
        setDraggedAvailableItem({ ...item, itemType: type });
        setDraggedMenuItem(null);
    };

    const handleDragStartInternal = (item: MenuItem) => {
        setDraggedMenuItem(item);
        setDraggedAvailableItem(null);
    };

    const handleDropOnMenu = async (parentId: string | null = null) => {
        if (!draggedAvailableItem && !draggedMenuItem) return;

        setIsSaving(true);
        try {
            if (draggedAvailableItem) {
                const newItem: Partial<MenuItem> = {
                    label_es: draggedAvailableItem.name_es || draggedAvailableItem.label,
                    label_en: draggedAvailableItem.name_en || draggedAvailableItem.label,
                    link_url: draggedAvailableItem.slug_es ? `/categoria/${draggedAvailableItem.slug_es}` : draggedAvailableItem.url,
                    type: 'link',
                    parent_id: parentId,
                    display_order: parentId ? (findItem(menuItems, parentId)?.children?.length || 0) : menuItems.length,
                    is_active: true
                };

                await menuApi.create(newItem);
                addToast(dict.menuSettings.saveSuccess, 'success');
            } else if (draggedMenuItem) {
                // Internal Move
                await menuApi.update(draggedMenuItem.id, {
                    parent_id: parentId,
                    display_order: parentId ? (findItem(menuItems, parentId)?.children?.length || 0) : menuItems.length
                });
                addToast(dict.menuSettings.saveSuccess, 'success');
            }
            loadMenu();
        } catch (error) {
            console.error(error);
            addToast('Error updated menu position', 'error');
        } finally {
            setIsSaving(false);
            setDraggedAvailableItem(null);
            setDraggedMenuItem(null);
        }
    };

    if (isLoading) return <div className="flex justify-center p-20"><Spinner /></div>;

    const customPages = [
        { label: 'Nosotros', url: '/about' },
        { label: 'Nuevos', url: '/products?sort=newest' },
        { label: 'Contacto', url: '/contact' }
    ];

    return (
        <div className="max-w-7xl mx-auto pb-20">
            <ToastContainer />
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="ms-heading-2">{dict.menuSettings.title}</h1>
                    <p className="text-ms-stone mt-1">{dict.menuSettings.subtitle}</p>
                </div>
                <Button onClick={handleCreateRoot}>
                    <Plus className="w-4 h-4 mr-2" /> {dict.menuSettings.addMain}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Available Items */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white border border-ms-fog rounded-lg shadow-sm overflow-hidden">
                        <div className="bg-ms-pearl px-4 py-3 border-b border-ms-fog">
                            <h3 className="font-medium text-sm text-ms-black uppercase tracking-wider">Categorías de Productos</h3>
                        </div>
                        <div className="p-4 max-h-[400px] overflow-y-auto space-y-2">
                            {availableCategories.map(cat => (
                                <div
                                    key={cat.id}
                                    draggable
                                    onDragStart={() => handleDragStartAvailable(cat, 'category')}
                                    className="flex items-center justify-between p-2 rounded border border-ms-fog hover:bg-ms-pearl cursor-grab active:cursor-grabbing transition-colors"
                                >
                                    <div className="flex items-center gap-2">
                                        <GripVertical className="w-3 h-3 text-ms-stone" />
                                        <span className="text-sm">{cat.name_es}</span>
                                    </div>
                                    <button
                                        onClick={() => { setDraggedAvailableItem({ ...cat, itemType: 'category' }); handleDropOnMenu(); }}
                                        className="text-ms-stone hover:text-ms-black"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white border border-ms-fog rounded-lg shadow-sm overflow-hidden">
                        <div className="bg-ms-pearl px-4 py-3 border-b border-ms-fog">
                            <h3 className="font-medium text-sm text-ms-black uppercase tracking-wider">Páginas Personalizadas</h3>
                        </div>
                        <div className="p-4 space-y-2">
                            {customPages.map(page => (
                                <div
                                    key={page.url}
                                    draggable
                                    onDragStart={() => handleDragStartAvailable(page, 'page')}
                                    className="flex items-center justify-between p-2 rounded border border-ms-fog hover:bg-ms-pearl cursor-grab transition-colors"
                                >
                                    <div className="flex items-center gap-2">
                                        <GripVertical className="w-3 h-3 text-ms-stone" />
                                        <span className="text-sm">{page.label}</span>
                                    </div>
                                    <button
                                        onClick={() => { setDraggedAvailableItem({ ...page, itemType: 'page' }); handleDropOnMenu(); }}
                                        className="text-ms-stone hover:text-ms-black"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Menu Structure */}
                <div className="lg:col-span-8">
                    <div
                        className="bg-white border border-ms-fog rounded-lg shadow-sm min-h-[500px]"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => handleDropOnMenu()}
                    >
                        <div className="bg-ms-pearl px-4 py-3 border-b border-ms-fog flex justify-between items-center">
                            <h3 className="font-medium text-sm text-ms-black uppercase tracking-wider">Estructura del Menú</h3>
                            <span className="text-xs text-ms-stone">Arrastra elementos aquí para agregarlos</span>
                        </div>
                        <div className="p-6">
                            <MenuTree
                                items={menuItems}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onAddChild={handleCreateChild}
                                onDropOnItem={handleDropOnMenu}
                                onDragStartInternal={handleDragStartInternal}
                            />
                            {menuItems.length === 0 && (
                                <div className="p-12 text-center text-ms-stone italic border-2 border-dashed border-ms-fog rounded-lg">
                                    {dict.menuSettings.noItems || "El menú está vacío. Agrega elementos desde la izquierda."}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {isEditModalOpen && editingItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">
                                {editingItem.id ? dict.menuSettings.editItem : dict.menuSettings.newItem}
                            </h3>
                            <button onClick={() => setIsEditModalOpen(false)}><X className="w-5 h-5" /></button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-ms-stone mb-1">{dict.menuSettings.labelEs}</label>
                                    <Input
                                        value={editingItem.label_es || ''}
                                        onChange={e => setEditingItem({ ...editingItem, label_es: e.target.value })}
                                        placeholder="Inicio"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-ms-stone mb-1">{dict.menuSettings.labelEn}</label>
                                    <Input
                                        value={editingItem.label_en || ''}
                                        onChange={e => setEditingItem({ ...editingItem, label_en: e.target.value })}
                                        placeholder="Home"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-ms-stone mb-1">{dict.menuSettings.type}</label>
                                <select
                                    className="ms-input w-full"
                                    value={editingItem.type}
                                    onChange={e => setEditingItem({ ...editingItem, type: e.target.value as any })}
                                >
                                    <option value="link">{dict.menuSettings.typeLink}</option>
                                    <option value="dropdown">{dict.menuSettings.typeDropdown}</option>
                                </select>
                            </div>

                            {editingItem.type === 'link' && (
                                <div>
                                    <label className="block text-xs font-medium text-ms-stone mb-1">{dict.menuSettings.linkUrl}</label>
                                    <Input
                                        value={editingItem.link_url || ''}
                                        onChange={e => setEditingItem({ ...editingItem, link_url: e.target.value })}
                                        placeholder="/products/tops"
                                    />
                                </div>
                            )}

                            <div className="flex justify-end gap-3 pt-4">
                                <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>{dict.menuSettings.cancel}</Button>
                                <Button type="submit" isLoading={isSaving}>{dict.menuSettings.save}</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

function MenuTree({
    items, onEdit, onDelete, onAddChild, onDropOnItem, onDragStartInternal, level = 0
}: {
    items: MenuItem[], onEdit: any, onDelete: any, onAddChild: any, onDropOnItem: any, onDragStartInternal: any, level?: number
}) {
    if (!items || items.length === 0) return null;

    return (
        <ul className={`${level > 0 ? 'pl-8 border-l border-ms-fog ml-4' : ''}`}>
            {items.map((item) => (
                <li key={item.id} className="group py-2">
                    <div
                        draggable
                        onDragStart={(e) => { e.stopPropagation(); onDragStartInternal(item); }}
                        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        onDrop={(e) => { e.stopPropagation(); onDropOnItem(item.id); }}
                        className="flex items-center justify-between p-2 rounded-md hover:bg-ms-pearl transition-colors border border-transparent hover:border-ms-fog cursor-grab active:cursor-grabbing"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-ms-stone"><GripVertical className="w-4 h-4" /></span>
                            <div>
                                <div className="font-medium text-sm text-ms-black flex items-center gap-2">
                                    {item.label_es} <span className="text-xs text-ms-stone font-normal">/ {item.label_en}</span>
                                    {item.type === 'dropdown' && <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">Dropdown</span>}
                                </div>
                                <div className="text-xs text-ms-stone truncate max-w-[200px]">{item.link_url}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {item.type === 'dropdown' && (
                                <button onClick={() => { onAddChild(item.id); }} className="p-1.5 text-ms-stone hover:text-blue-600 hover:bg-blue-50 rounded" title="Add Sub-item">
                                    <Plus className="w-4 h-4" />
                                </button>
                            )}
                            <button onClick={() => onEdit(item)} className="p-1.5 text-ms-stone hover:text-ms-black hover:bg-gray-100 rounded" title="Edit">
                                {/* Edit Icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                            </button>
                            <button onClick={() => onDelete(item.id)} className="p-1.5 text-ms-stone hover:text-red-600 hover:bg-red-50 rounded" title="Delete">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    {item.children && (
                        <MenuTree
                            items={item.children}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onAddChild={onAddChild}
                            onDropOnItem={onDropOnItem}
                            onDragStartInternal={onDragStartInternal}
                            level={level + 1}
                        />
                    )}
                </li>
            ))}
        </ul>
    );
}
