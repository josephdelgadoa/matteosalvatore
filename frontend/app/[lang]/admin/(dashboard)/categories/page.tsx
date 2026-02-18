'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { productCategoriesApi, ProductCategory } from '@/lib/api/productCategories';
import { Plus, Edit, Trash, GripVertical, CornerDownRight } from 'lucide-react';
import { Spinner } from '@/components/ui/Spinner';
import { useToast, ToastContainer } from '@/components/ui/Toast';

export default function ProductCategoriesPage() {
    const [categories, setCategories] = useState<ProductCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { addToast } = useToast();
    const [draggedId, setDraggedId] = useState<string | null>(null);
    const [dropTarget, setDropTarget] = useState<{ id: string, position: 'before' | 'inside' | 'after' } | null>(null);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            setIsLoading(true);
            const data = await productCategoriesApi.getAll();
            setCategories(data);
        } catch (error: any) {
            console.error('Failed to load product categories', error);
            const msg = error.response?.data?.error || error.message || 'Failed to load categories';
            addToast(`Error: ${msg}`, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this category?')) return;

        try {
            await productCategoriesApi.delete(id);
            addToast('Category deleted', 'success');
            loadCategories();
        } catch (error: any) {
            console.error('Failed to delete category', error);
            const msg = error.response?.data?.error || error.message;
            addToast(`Failed to delete: ${msg}`, 'error');
        }
    };

    // Build Tree
    const buildTree = (items: ProductCategory[]) => {
        // Sort by display_order
        const sorted = [...items].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

        const map = new Map<string, ProductCategory & { children: any[] }>();
        const roots: any[] = [];

        sorted.forEach(item => {
            map.set(item.id, { ...item, children: [] });
        });

        // Link children
        items.forEach(item => {
            const node = map.get(item.id);
            if (item.parent_id && map.has(item.parent_id)) {
                // Check if parent eventually points to this node (simple cycle check)
                if (isSelfReferencing(map, item.id, item.parent_id)) {
                    console.warn(`Circular reference detected for ${item.name_en}. Promoting to root.`);
                    node!.parent_id = undefined; // Break cycle in UI
                    roots.push(node);
                } else {
                    map.get(item.parent_id)!.children.push(node);
                }
            } else {
                roots.push(node);
            }
        });

        return roots;
    };

    // Helper to check for cycles before rendering
    const isSelfReferencing = (map: Map<string, any>, targetId: string, currentParentId: string): boolean => {
        let parent = map.get(currentParentId);
        let depth = 0;
        while (parent && depth < 20) { // Max depth check
            if (parent.id === targetId) return true;
            if (!parent.parent_id) return false;
            parent = map.get(parent.parent_id);
            depth++;
        }
        return false;
    };

    // DND Handlers
    const handleDragStart = (e: React.DragEvent, id: string) => {
        setDraggedId(id);
        e.dataTransfer.effectAllowed = 'move';
        // e.dataTransfer.setDragImage(img, 0, 0); // Optional: Custom drag image
    };

    const handleDragOver = (e: React.DragEvent, targetId: string) => {
        e.preventDefault();
        e.stopPropagation();
        if (!draggedId || draggedId === targetId) return;

        // Calculate Drop Zone
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const y = e.clientY - rect.top;
        const height = rect.height;

        let position: 'before' | 'inside' | 'after' = 'inside';

        if (y < height * 0.25) position = 'before';
        else if (y > height * 0.75) position = 'after';
        else position = 'inside';

        setDropTarget({ id: targetId, position });
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDragLeave = () => {
        setDropTarget(null);
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation(); // Stop bubbling

        if (!draggedId || !dropTarget) return;

        const { id: targetId, position } = dropTarget;
        if (draggedId === targetId) return;

        if (isDescendant(draggedId, targetId)) {
            addToast('Cannot move a parent into its own child', 'error');
            setDropTarget(null);
            setDraggedId(null);
            return;
        }

        try {
            // Calculate new parent and order
            let newParentId: string | undefined | null;
            let siblings: ProductCategory[] = [];
            let targetIndex = -1;

            const targetCategory = categories.find(c => c.id === targetId);
            if (!targetCategory) return;

            if (position === 'inside') {
                newParentId = targetId;
                siblings = categories.filter(c => c.parent_id === targetId && c.id !== draggedId);
                // Append to end
                targetIndex = siblings.length;
            } else {
                // Normalize parent_id for comparison (treat null and undefined as same)
                const normalizeId = (id?: string | null) => id || null;
                newParentId = normalizeId(targetCategory.parent_id);

                const parentSiblings = categories.filter(c =>
                    normalizeId(c.parent_id) === newParentId && c.id !== draggedId
                ).sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

                // Find index of target in siblings
                const idx = parentSiblings.findIndex(c => c.id === targetId);
                targetIndex = position === 'before' ? idx : idx + 1;
            }

            // Reconstruct the new order for the affected group
            const draggedCategory = categories.find(c => c.id === draggedId)!;
            const newGroup = position === 'inside'
                ? [...siblings, draggedCategory]
                : [
                    ...categories.filter(c => c.parent_id === newParentId && c.id !== draggedId)
                        .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
                ];

            // If inside, we just added to end. If before/after, we need to insert at targetIndex
            if (position !== 'inside') {
                newGroup.splice(targetIndex, 0, draggedCategory);
            }

            // Create update payloads
            const updates = newGroup.map((cat, index) => ({
                id: cat.id,
                parent_id: position === 'inside' && cat.id === draggedId ? targetId : (cat.id === draggedId ? newParentId : cat.parent_id),
                display_order: index
            }));

            // Optimistic Update
            const updatedCategories = categories.map(c => {
                const update = updates.find(u => u.id === c.id);
                return update ? { ...c, parent_id: update.parent_id || undefined, display_order: update.display_order } : c;
            });
            setCategories(updatedCategories);

            // API Call
            await productCategoriesApi.reorder(updates);
            addToast('Categories reordered', 'success');

        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.error || error.message || 'Unknown error';
            addToast(`Failed to reorder: ${msg}`, 'error');
            loadCategories(); // Revert
        } finally {
            setDropTarget(null);
            setDraggedId(null);
        }
    };

    const isDescendant = (parentId: string, targetId: string | null): boolean => {
        if (!targetId) return false;
        const target = categories.find(c => c.id === targetId);
        if (!target) return false;
        if (target.parent_id === parentId) return true;
        return isDescendant(parentId, target.parent_id || null);
    };

    const treeData = buildTree(categories);

    return (
        <div className="max-w-6xl mx-auto pb-20">
            <ToastContainer />
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="ms-heading-2">Product Categories</h1>
                    <p className="text-ms-stone mt-1">Manage product taxonomy hierarchy.</p>
                </div>
                <Link href="/admin/categories/new">
                    <Button>
                        <Plus size={20} className="mr-2" />
                        Add Root Category
                    </Button>
                </Link>
            </div>

            <div className="bg-white rounded-lg border border-ms-fog p-6">
                {isLoading ? (
                    <div className="flex justify-center p-12"><Spinner /></div>
                ) : (
                    <>
                        {categories.length === 0 && <div className="p-8 text-center text-ms-stone">No categories. Add one!</div>}
                        <CategoryList
                            items={treeData}
                            onDragStart={handleDragStart}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            dropTarget={dropTarget}
                            onDelete={handleDelete}
                        />
                    </>
                )}
            </div>
        </div>
    );
}

function CategoryList({ items, onDragStart, onDragOver, onDrop, dropTarget, onDelete }: any) {
    if (!items || items.length === 0) return null;

    return (
        <ul className="space-y-1">
            {items.map((item: any) => {
                const isTarget = dropTarget?.id === item.id;
                const position = dropTarget?.position;

                return (
                    <li key={item.id} className="relative">
                        {/* Drop Indicator Logic */}
                        <div
                            draggable
                            onDragStart={(e) => onDragStart(e, item.id)}
                            onDragOver={(e) => onDragOver(e, item.id)}
                            onDrop={onDrop}
                            className={`
                                group flex items-center justify-between p-3 rounded-md transition-all cursor-move
                                border border-transparent
                                ${isTarget && position === 'inside' ? 'bg-blue-50 border-blue-200' : 'hover:bg-ms-pearl hover:border-ms-fog'}
                                ${isTarget && position === 'before' ? 'border-t-2 border-t-blue-500' : ''}
                                ${isTarget && position === 'after' ? 'border-b-2 border-b-blue-500' : ''}
                            `}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-ms-stone opacity-50"><GripVertical size={16} /></span>
                                <div className={`w-2 h-2 rounded-full ${item.is_active ? 'bg-green-500' : 'bg-gray-300'}`} />
                                <span className="font-medium">{item.name_es}</span>
                                <span className="text-sm text-ms-stone">/ {item.name_en}</span>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Link href={`/admin/categories/new?parentId=${item.id}`}>
                                    <button className="p-1.5 text-ms-stone hover:text-blue-600 rounded" title="Add Subcategory">
                                        <Plus size={16} />
                                    </button>
                                </Link>
                                <Link href={`/admin/categories/${item.id}`}>
                                    <button className="p-1.5 text-ms-stone hover:text-ms-black rounded" title="Edit">
                                        <Edit size={16} />
                                    </button>
                                </Link>
                                <button onClick={() => onDelete(item.id)} className="p-1.5 text-ms-stone hover:text-red-600 rounded" title="Delete">
                                    <Trash size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Nested Children */}
                        {item.children.length > 0 && (
                            <div className="ml-6 pl-2 border-l border-ms-fog mt-1">
                                <CategoryList
                                    items={item.children}
                                    onDragStart={onDragStart}
                                    onDragOver={onDragOver}
                                    onDrop={onDrop}
                                    dropTarget={dropTarget}
                                    onDelete={onDelete}
                                />
                            </div>
                        )}
                    </li>
                );
            })}
        </ul>
    );
}
