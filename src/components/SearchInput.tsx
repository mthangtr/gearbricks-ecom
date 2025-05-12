"use client";

import { useRouter } from "nextjs-toploader/app";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function SearchInput() {
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && searchQuery.trim()) {
            router.push(`/category?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <div className="relative w-64">
            <Input
                type="text"
                placeholder="Search..."
                className="h-10 pr-10 pl-4 rounded-full border focus:outline-none focus:ring-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 cursor-pointer" size={18}
                onClick={() => {
                    if (searchQuery.trim()) {
                        router.push(`/category?search=${encodeURIComponent(searchQuery.trim())}`);
                    }
                }}
            />
        </div>
    );
}
