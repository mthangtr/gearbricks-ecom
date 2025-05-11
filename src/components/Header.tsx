'use client';

import Link from "next/link";
import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuLink,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { User, ShoppingCart, Search, AlignJustify } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export default function Header() {
    return (
        <header className="border-b bg-background sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                {/* Logo trái */}
                <Link href="/" className="text-xl font-bold text-primary">
                    GearBricks
                </Link>

                {/* Desktop Menu */}
                <div className="hidden lg:flex justify-center flex-1">
                    <NavigationMenu>
                        <NavigationMenuList className="flex items-center gap-4">
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link href="/category/all">Newest</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link href="/mystery-box">Best seller</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link href="/category">Categories</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link href="/mystery-box" className="relative inline-block">
                                        Mystery box
                                        <span className="absolute -top-1 -right-2 text-[10px] font-semibold text-white bg-red-500 px-1.5 py-0.5 rounded-full animate-pulse shadow">
                                            250k
                                        </span>
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                {/* Search + Icon + LocaleSwitcher (desktop) */}
                <div className="hidden lg:flex items-center gap-2">
                    <Input
                        type="text"
                        placeholder="Search..."
                        className="w-64 h-10 pr-4 rounded-full border focus:outline-none focus:ring-2"
                    />
                    <Link href="/cart">
                        <Button className="cursor-pointer" variant="ghost" size="icon">
                            <ShoppingCart />
                        </Button>
                    </Link>
                    <Button className="cursor-pointer" variant="ghost" size="icon">
                        <User />
                    </Button>
                    <LocaleSwitcher />
                </div>

                {/* Mobile Hamburger Menu */}
                <div className="lg:hidden flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <AlignJustify />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuItem asChild>
                                <Link href="/category/all">Newest</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/mystery-box">Best seller</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/category">Categories</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/mystery-box" className="">
                                    Mystery box
                                    <span className="text-[10px] font-semibold text-white bg-red-500 px-1.5 py-0.5 rounded-full animate-pulse shadow">
                                        hot
                                    </span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/cart"><ShoppingCart /> Cart</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/profile"><User /> Profile</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <LocaleSwitcher />
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
