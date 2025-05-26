// app/mystery-box/[slug]/page.tsx

import { notFound } from "next/navigation";
import MysteryBoxDetail from "@/components/blindbox/MysteryBoxDetail";
import { Blindbox } from "@/types/global";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function MysteryBoxSSRPage({
    params
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params;
    const session = await getServerSession(authOptions);

    let isAuthenticated = false;
    let blindboxSpinCount = 0;
    if (session) {
        isAuthenticated = true;
        blindboxSpinCount = session.user?.blindboxSpinCount ?? 0;
    }

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

    const blindbox: Blindbox = await res.json();

    // 3) Render client-component với props đã fetch sẵn
    return <MysteryBoxDetail blindbox={blindbox} isAuthenticated={isAuthenticated} blindboxSpinCount={blindboxSpinCount} />;
}
