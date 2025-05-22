// app/mystery-box/[slug]/page.tsx

import { notFound } from "next/navigation";
import MysteryBoxDetail from "@/components/blindbox/MysteryBoxDetail";
import { Blindbox } from "@/types/global";

interface Stats {
    totalSpins: number;
    winCounts: Record<string, number>;
}

export default async function MysteryBoxSSRPage({
    params }: {
        params: Promise<{ slug: string }>
    }) {
    const { slug } = await params;
    const baseUrl =
        process.env.NODE_ENV === "development"
            ? `http://${process.env.HOST || "localhost"}:${process.env.PORT || 3000}`
            : `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;

    const res = await fetch(
        `${baseUrl}/api/blindbox/${encodeURIComponent(slug)}`,
        { cache: "no-store" }
    );
    if (!res.ok) {
        return notFound();
    }

    // 2) Endpoint trả về { blindbox, stats }
    const { blindbox, stats }: { blindbox: Blindbox; stats: Stats } =
        await res.json();


    // 3) Render client-component với props đã fetch sẵn
    return <MysteryBoxDetail blindbox={blindbox} stats={stats} />;
}
