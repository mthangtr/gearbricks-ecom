"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { Button } from "../ui/button"

export default function CategoryDropdown() {
    const [open, setOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Đóng dropdown nếu click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <div className="relative" ref={dropdownRef}>
            <Button
                variant={"ghost"}
                onClick={() => setOpen(!open)}
                className="flex items-center gap-1 text-sm cursor-pointer transition font-normal"
            >
                Categories
                <ChevronDown className={`w-4 h-4 transition ${open ? "rotate-180" : ""}`} />
            </Button>

            {open && (
                <div className="absolute z-50 mt-2 w-40 rounded-md border bg-white shadow-lg p-2 space-y-1">
                    <DropdownLink href="/category?category=all">All</DropdownLink>
                    <DropdownLink href="/category?category=classic">Classic Car</DropdownLink>
                    <DropdownLink href="/category?category=race">Race Car</DropdownLink>
                    <DropdownLink href="/category?category=super">Super Car</DropdownLink>
                </div>
            )}
        </div>
    )
}

function DropdownLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="block px-3 py-2 text-sm rounded hover:bg-accent hover:text-accent-foreground transition"
        >
            {children}
        </Link>
    )
}
