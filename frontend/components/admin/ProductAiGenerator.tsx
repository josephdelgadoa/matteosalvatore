'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { aiApi, AiProductGenerationData, GeneratedProductAsset } from '@/lib/api/ai';
import { Sparkles, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

interface ProductAiGeneratorProps {
    initialName?: string;
    initialCategory?: string;
    onGenerate: (data: GeneratedProductAsset) => void;
}

export const ProductAiGenerator = ({ initialName, initialCategory, onGenerate }: ProductAiGeneratorProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { addToast } = useToast();

    const [aiData, setAiData] = useState<AiProductGenerationData>({
        name: initialName || '',
        category: initialCategory || '',
        color: '',
        material: 'Algodón Peruano',
        collection: 'Essential 2026',
        fit: 'Slim Regular',
        gender: 'Hombre',
        price: ''
    });

    const handleGenerate = async () => {
        if (!aiData.name || !aiData.category || !aiData.price) {
            addToast('Please fill in Name, Category and Price', 'error');
            return;
        }

        setIsLoading(true);
        try {
            const result = await aiApi.generateProduct(aiData);
            onGenerate(result);
            addToast('AI Content generated successfully', 'success');
            setIsOpen(false);
        } catch (error: any) {
            console.error(error);
            addToast(error.message || 'Failed to generate content', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Button
                type="button"
                variant="outline"
                className="gap-2 border-ms-brand-primary text-ms-brand-primary hover:bg-ms-brand-primary hover:text-ms-white transition-all shadow-sm"
                onClick={() => {
                    setAiData(prev => ({ ...prev, name: initialName || prev.name, category: initialCategory || prev.category }));
                    setIsOpen(true);
                }}
            >
                <Sparkles className="w-4 h-4" />
                AI Generate Content
            </Button>

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="AI Product Content Generator" width="lg">
                <div className="space-y-6">
                    <p className="text-sm text-ms-stone italic">
                        Enter basic details and our AI will build a complete premium store listing (ES/EN), including SEO, tags, descriptions, and more.
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <Input
                                label="Product Name"
                                value={aiData.name}
                                onChange={e => setAiData({ ...aiData, name: e.target.value })}
                                placeholder="e.g. Polo Básico"
                            />
                        </div>
                        <Input
                            label="Category"
                            value={aiData.category}
                            onChange={e => setAiData({ ...aiData, category: e.target.value })}
                            placeholder="e.g. Polos Hombre"
                        />
                        <Input
                            label="Base Price (S/.)"
                            type="number"
                            value={aiData.price}
                            onChange={e => setAiData({ ...aiData, price: e.target.value })}
                            placeholder="99.90"
                        />
                        <Input
                            label="Color"
                            value={aiData.color}
                            onChange={e => setAiData({ ...aiData, color: e.target.value })}
                            placeholder="e.g. Blanco"
                        />
                        <Input
                            label="Material"
                            value={aiData.material}
                            onChange={e => setAiData({ ...aiData, material: e.target.value })}
                        />
                        <Input
                            label="Collection"
                            value={aiData.collection}
                            onChange={e => setAiData({ ...aiData, collection: e.target.value })}
                        />
                        <Input
                            label="Fit"
                            value={aiData.fit}
                            onChange={e => setAiData({ ...aiData, fit: e.target.value })}
                        />
                        <Input
                            label="Gender"
                            value={aiData.gender}
                            onChange={e => setAiData({ ...aiData, gender: e.target.value })}
                        />
                    </div>

                    <div className="flex gap-3 justify-end pt-4 border-t border-ms-fog">
                        <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>Cancel</Button>
                        <Button onClick={handleGenerate} isLoading={isLoading} className="gap-2">
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                            Generate Now
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};
