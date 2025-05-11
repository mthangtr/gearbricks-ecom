'use client';

import { Star } from "lucide-react";
import { Review } from "@/types/global";

export default function ReviewSummary({ reviews }: { reviews: Review[] }) {
    if (!reviews || reviews.length === 0) {
        return <p className="text-sm text-muted-foreground mt-6">Chưa có đánh giá nào.</p>;
    }

    const avg = (
        reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    ).toFixed(1);

    return (
        <div className="mt-6 space-y-2">
            <div className="flex items-center gap-2">
                <span className="text-lg font-semibold">{avg}</span>
                <div className="flex text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.round(Number(avg)) ? 'fill-yellow-500' : 'stroke-yellow-500'}`}
                        />
                    ))}
                </div>
                <span className="text-sm text-muted-foreground">({reviews.length} đánh giá)</span>
            </div>

            <ul className="text-sm space-y-1 text-foreground">
                {reviews.slice(0, 3).map((r) => (
                    <li key={r.id} className="border-t pt-2">
                        <p className="font-medium">⭐ {r.rating} sao</p>
                        <p className="text-muted-foreground">{r.comment}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
