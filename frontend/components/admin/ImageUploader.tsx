'use client';

import React, { useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useToast } from '@/components/ui/Toast';

interface ImageUploaderProps {
    value?: string[];
    onChange: (urls: string[]) => void;
    maxFiles?: number;
}

export const ImageUploader = ({ value = [], onChange, maxFiles = 5 }: ImageUploaderProps) => {
    const [isUploading, setIsUploading] = useState(false);
    const supabase = createClientComponentClient();
    const { addToast } = useToast();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        const newUrls: string[] = [];

        try {
            for (const file of Array.from(files)) {
                // validation
                if (!file.type.startsWith('image/')) {
                    addToast(`File ${file.name} is not an image`, 'error');
                    continue;
                }

                if (file.size > 5 * 1024 * 1024) { // 5MB limit
                    addToast(`File ${file.name} is too large (max 5MB)`, 'error');
                    continue;
                }

                // Upload to Supabase
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('products')
                    .upload(filePath, file);

                if (uploadError) {
                    throw uploadError;
                }

                // Get Public URL
                const { data: { publicUrl } } = supabase.storage
                    .from('products')
                    .getPublicUrl(filePath);

                newUrls.push(publicUrl);
            }

            if (newUrls.length > 0) {
                onChange([...value, ...newUrls].slice(0, maxFiles));
                addToast('Images uploaded successfully', 'success');
            }

        } catch (error: any) {
            console.error('Upload error:', error);
            addToast('Failed to upload image', 'error');
        } finally {
            setIsUploading(false);
            // Reset input
            e.target.value = '';
        }
    };

    const removeImage = (indexToRemove: number) => {
        onChange(value.filter((_, idx) => idx !== indexToRemove));
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {value.map((url, idx) => (
                    <div key={idx} className="relative aspect-square bg-ms-pearl border border-ms-fog group overflow-hidden rounded-md">
                        <div
                            className="w-full h-full bg-cover bg-center"
                            style={{ backgroundImage: `url(${url})` }}
                        />
                        <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-1 right-1 bg-ms-white/90 p-1.5 rounded-full text-ms-error opacity-0 group-hover:opacity-100 transition-all hover:bg-ms-white"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}

                {value.length < maxFiles && (
                    <label className={cn(
                        "border-2 border-dashed border-ms-fog hover:border-ms-stone transition-colors cursor-pointer aspect-square flex flex-col items-center justify-center text-ms-stone rounded-md bg-ms-ivory/20",
                        isUploading && "opacity-50 cursor-not-allowed"
                    )}>
                        {isUploading ? (
                            <Loader2 className="w-6 h-6 animate-spin text-ms-brand-primary" />
                        ) : (
                            <>
                                <Upload className="w-6 h-6 mb-2 opacity-50" />
                                <span className="text-xs font-medium">Upload Image</span>
                            </>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleFileChange}
                            disabled={isUploading}
                        />
                    </label>
                )}
            </div>
            <p className="text-xs text-ms-stone/60">
                Upload up to {maxFiles} images. Max 5MB per file.
            </p>
        </div>
    );
};
