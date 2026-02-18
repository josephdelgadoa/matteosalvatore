'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { categoriesApi, FeaturedCategory } from '@/lib/api/categories';
import { useToast, ToastContainer } from '@/components/ui/Toast';
import { Spinner } from '@/components/ui/Spinner';
import { ImageUploader } from '@/components/admin/ImageUploader';

export default function CategoriesImagesPage() {
    const router = useRouter();
    const { addToast } = useToast();
    const [categories, setCategories] = useState<Partial<FeaturedCategory>[]>(
        Array(5).fill(null).map((_, index) => ({
            id: '',
            title_es: '',
            title_en: '',
            subtitle_es: '',
            subtitle_en: '',
            image_url: '',
            link_url: '',
            display_order: index,
            is_active: true
        }))
    );
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    // Ensure we have 5 slots
    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            setIsLoading(true);
            const data = await categoriesApi.getAll();

            // Map existing categories to 5 slots based on order, or create empty placeholders
            const slots = Array(5).fill(null).map((_, index) => {
                const existing = data.find((c: any) => c.display_order === index);
                return existing || {
                    id: '', // Empty ID means new
                    title_es: '',
                    title_en: '',
                    subtitle_es: '',
                    subtitle_en: '',
                    image_url: '',
                    link_url: '',
                    display_order: index,
                    is_active: true
                };
            });

            setCategories(slots);
        } catch (error: any) {
            console.error('Error loading categories:', error);
            const msg = error.response?.data?.error || error.message || 'Failed to load categories';
            addToast(`Error: ${msg}`, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdate = (index: number, field: string, value: any) => {
        const newCategories = [...categories];
        newCategories[index] = { ...newCategories[index], [field]: value };
        setCategories(newCategories);
    };

    // DND Handlers
    const handleDragStart = (e: React.DragEvent, index: number) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = "move";
        // Transparent drag image or default
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (e: React.DragEvent, targetIndex: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === targetIndex) return;

        const newCategories = [...categories];

        // Swap items
        const draggedItem = newCategories[draggedIndex];
        const targetItem = newCategories[targetIndex];

        newCategories[draggedIndex] = targetItem;
        newCategories[targetIndex] = draggedItem;

        // Update display_order for all to reflect new positions
        const updatedCategories = newCategories.map((cat, idx) => ({
            ...cat,
            display_order: idx
        }));

        setCategories(updatedCategories);
        setDraggedIndex(null);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Save each slot
            for (let i = 0; i < categories.length; i++) {
                const category = categories[i];
                // Ensure correct order before saving
                const payload = { ...category, display_order: i };

                // Skip completely empty ones if they don't have an ID
                if (!payload.id && !payload.image_url && !payload.title_es) continue;

                if (payload.id) {
                    await categoriesApi.update(payload.id, payload);
                } else {
                    await categoriesApi.create(payload);
                }
            }
            addToast('Categories updated successfully', 'success');
            // Reload to get IDs
            loadCategories();
        } catch (error) {
            console.error(error);
            addToast('Failed to save categories', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="flex justify-center p-20"><Spinner /></div>;

    return (
        <div className="max-w-6xl mx-auto pb-20">
            <ToastContainer />
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="ms-heading-2">Categories Images</h1>
                    <p className="text-ms-stone mt-1">Manage the 5 main categories displayed on the homepage. Drag to reorder.</p>
                </div>
                <Button onClick={handleSave} isLoading={isSaving}>Save Changes</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Slot 0: Large Left */}
                <div
                    className={`md:row-span-2 border rounded-lg p-6 space-y-4 transition-all ${draggedIndex === 0 ? 'border-dashed border-ms-brand-primary bg-ms-brand-primary/5' : 'border-ms-fog bg-white'}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, 0)}
                    onDragOver={(e) => handleDragOver(e, 0)}
                    onDrop={(e) => handleDrop(e, 0)}
                >
                    <div className="flex items-center justify-between border-b border-ms-fog pb-2">
                        <h3 className="font-medium text-lg">Main Category (Left) <span className="text-xs text-ms-stone font-normal ml-2">Slot 1</span></h3>
                        <span className="text-ms-stone cursor-move" title="Drag to move">:::</span>
                    </div>
                    <CategorySlot index={0} category={categories[0]} onUpdate={handleUpdate} />
                </div>

                {/* Right Column Layout Visual */}
                <div className="space-y-8">
                    {/* Top Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <DraggableSlot
                            index={1}
                            category={categories[1]}
                            onUpdate={handleUpdate}
                            title="Top Right 1"
                            slotLabel="Slot 2"
                            onDragStart={handleDragStart}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            isDragged={draggedIndex === 1}
                        />
                        <DraggableSlot
                            index={2}
                            category={categories[2]}
                            onUpdate={handleUpdate}
                            title="Top Right 2"
                            slotLabel="Slot 3"
                            onDragStart={handleDragStart}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            isDragged={draggedIndex === 2}
                        />
                    </div>

                    {/* Bottom Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <DraggableSlot
                            index={3}
                            category={categories[3]}
                            onUpdate={handleUpdate}
                            title="Bottom Right 1"
                            slotLabel="Slot 4"
                            onDragStart={handleDragStart}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            isDragged={draggedIndex === 3}
                        />
                        <DraggableSlot
                            index={4}
                            category={categories[4]}
                            onUpdate={handleUpdate}
                            title="Bottom Right 2"
                            slotLabel="Slot 5"
                            onDragStart={handleDragStart}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            isDragged={draggedIndex === 4}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function DraggableSlot({
    index, category, onUpdate, title, slotLabel,
    onDragStart, onDragOver, onDrop, isDragged
}: any) {
    return (
        <div
            className={`border rounded-lg p-6 space-y-4 transition-all ${isDragged ? 'border-dashed border-ms-brand-primary bg-ms-brand-primary/5' : 'border-ms-fog bg-white'}`}
            draggable
            onDragStart={(e) => onDragStart(e, index)}
            onDragOver={(e) => onDragOver(e, index)}
            onDrop={(e) => onDrop(e, index)}
        >
            <div className="flex items-center justify-between border-b border-ms-fog pb-2">
                <h3 className="font-medium text-sm">{title} <span className="text-xs text-ms-stone font-normal ml-1">{slotLabel}</span></h3>
                <span className="text-ms-stone cursor-move text-xs" title="Drag to move">:::</span>
            </div>
            <CategorySlot index={index} category={category} onUpdate={onUpdate} compact />
        </div>
    );
}

function CategorySlot({ index, category, onUpdate, compact = false }: { index: number, category: any, onUpdate: any, compact?: boolean }) {
    const images = category.image_url ? [{ image_url: category.image_url }] : [];

    return (
        <div className="space-y-3">
            <ImageUploader
                value={images}
                onChange={(newImages) => {
                    const url = newImages.length > 0 ? (typeof newImages[0] === 'string' ? newImages[0] : newImages[0].image_url) : '';
                    onUpdate(index, 'image_url', url);
                }}
                maxFiles={1}
            />

            <div className={`grid ${compact ? 'grid-cols-1' : 'grid-cols-2'} gap-3`}>
                <div className="space-y-1">
                    <label className="text-xs font-medium text-ms-stone">Title (ES)</label>
                    <input className="ms-input h-8 text-sm" value={category.title_es || ''} onChange={e => onUpdate(index, 'title_es', e.target.value)} />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-medium text-ms-stone">Title (EN)</label>
                    <input className="ms-input h-8 text-sm" value={category.title_en || ''} onChange={e => onUpdate(index, 'title_en', e.target.value)} />
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-medium text-ms-stone">Link URL</label>
                <input className="ms-input h-8 text-sm" value={category.link_url || ''} onChange={e => onUpdate(index, 'link_url', e.target.value)} placeholder="/products/..." />
            </div>
        </div>
    );
}
