import React from "react";
import Link from "next/link";
import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuLink,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { User, AlignJustify } from "lucide-react";
import { Button } from "@/components/ui/button";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import CategoryDropdown from "./CategoryDropdown";
import SearchInput from "../SearchInput";
import UserProfileWrapper from "@/components/wrapper/UserProfileWrapper";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import CartIcon from "@/components/cart/CartIcon";

export default async function Header() {
    const session = await getServerSession(authOptions);

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
                                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                    <Link href="/category?category=all">Newest</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                    <Link href="/">Best seller</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <CategoryDropdown />
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                    <Link href="/blindbox/car-edition" className="relative inline-block">
                                        Mystery box
                                        <span className="absolute -top-2 -right-2 text-[10px] font-semibold text-white bg-red-500 px-1.5 py-0.5 rounded-full animate-pulse shadow">
                                            210k
                                        </span>
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                {/* Search + Icon + LocaleSwitcher (desktop) */}
                <div className="hidden lg:flex items-center gap-2">
                    <SearchInput />
                    <CartIcon />
                    <UserProfileWrapper isAdmin={session?.user?.isAdmin} />
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
                                <Link href="/mystery-box/blindbox-car-edition" className="">
                                    Mystery box
                                    <span className="text-[10px] font-semibold text-white bg-red-500 px-1.5 py-0.5 rounded-full animate-pulse shadow">
                                        hot
                                    </span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/cart">Cart</Link>
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
