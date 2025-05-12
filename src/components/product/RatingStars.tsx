import { Star } from "lucide-react";

export default function RatingStars({ rating, reviewCount }: { rating: number; reviewCount: number }) {
    return (
        <div className="flex items-center gap-1 text-yellow-500">
            {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.round(rating) ? 'fill-yellow-500' : 'stroke-yellow-500'}`} />
            ))}
            <span className="text-xs text-muted-foreground ml-2">({reviewCount} đánh giá)</span>
        </div>
    );
}
