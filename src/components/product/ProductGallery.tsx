"use client";
import Image from 'next/image';
import { useState } from 'react';

interface ProductGalleryProps {
    images: string[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
    // Index của ảnh đang được chọn làm chính
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Nếu không có ảnh, render fallback
    if (images.length === 0) {
        return <div className="text-center text-gray-500">No images available</div>;
    }

    return (
        <div className="space-y-4">
            {/* Ảnh chính */}
            <div className="relative aspect-square w-full rounded-lg overflow-hidden">
                <Image
                    src={images[selectedIndex]}
                    alt={`Image ${selectedIndex + 1}`}
                    fill
                    className="object-cover"
                />
            </div>

            {/* Thumbnail list */}
            <div className="flex gap-2">
                {images.map((src, i) => {
                    const isActive = i === selectedIndex;
                    return (
                        <button
                            key={i}
                            onClick={() => setSelectedIndex(i)}
                            className={`
                relative w-24 h-24 rounded-md overflow-hidden
                transition ring-2 focus:outline-none
                ${isActive
                                    ? 'ring-primary ring-offset-2'
                                    : 'ring-transparent hover:ring-border'}
              `}
                        >
                            <Image
                                src={src}
                                alt={`Thumbnail ${i + 1}`}
                                fill
                                className="object-cover cursor-pointer"
                            />
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
