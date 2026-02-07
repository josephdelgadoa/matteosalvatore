'use client';

import React, { useCallback, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Spinner } from '@/components/ui/Spinner';

interface ImageUploaderProps {
    value?: string[];
    onChange: (urls: string[]) => void;
    maxFiles?: number;
}

export const ImageUploader = ({ value = [], onChange, maxFiles = 5 }: ImageUploaderProps) => {
    const [isUploading, setIsUploading] = useState(false);

    // Mock upload for now - in production use Supabase Storage
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);

        // Simulate upload delay
        setTimeout(() => {
            // Create object URLs for preview (pseudo-upload)
            const newUrls = Array.from(files).map(file => URL.createObjectURL(file));
            onChange([...value, ...newUrls].slice(0, maxFiles));
            setIsUploading(false);
        }, 1000);
    };

    const removeImage = (indexToRemove: number) => {
        onChange(value.filter((_, idx) => idx !== indexToRemove));
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {value.map((url, idx) => (
                    <div key={idx} className="relative aspect-square bg-ms-pearl border border-ms-fog group">
                        <div
                            className="w-full h-full bg-cover bg-center"
                            style={{ backgroundImage: `url(${url})` }}
                        />
                        <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-1 right-1 bg-ms-white/80 p-1 rounded-full text-ms-error opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}

                {value.length < maxFiles && (
                    <label className={cn(
                        "border-2 border-dashed border-ms-fog hover:border-ms-stone transition-colors cursor-pointer aspect-square flex flex-col items-center justify-center text-ms-stone",
                        isUploading && "opacity-50 cursor-not-allowed"
                    )}>
                        {isUploading ? (
                            <Spinner size="sm" />
                        ) : (
                            <>
                                <Upload className="w-6 h-6 mb-2" />
                                <span className="text-xs">Upload</span>
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
            <p className="text-xs text-ms-silver">
                Upload up to {maxFiles} images. Recommended aspect ratio 3:4.
            </p>
        </div>
    );
};
