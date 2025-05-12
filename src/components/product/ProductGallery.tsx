import Image from "next/image";

export default function ProductGallery({ images }: { images: string[] }) {
    return (
        <div className="space-y-4">
            <div className="relative aspect-square w-full rounded-lg overflow-hidden">
                <Image src={images[0]} alt="main" fill className="object-cover" />
            </div>
            <div className="flex gap-2">
                {images.slice(1).map((src, i) => (
                    <div key={i} className="relative w-24 h-24 rounded-md overflow-hidden border">
                        <Image src={src} alt={`thumb-${i}`} fill className="object-cover" />
                    </div>
                ))}
            </div>
        </div>
    );
}
