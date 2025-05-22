"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type UserProfileWrapperProps = {
    isAdmin?: boolean;
};

export default function UserProfileWrapper({ isAdmin }: UserProfileWrapperProps) {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return (
            <Button variant="ghost" size="icon" disabled className="cursor-not-allowed">
                <UserIcon className="animate-pulse" />
            </Button>
        );
    }

    if (!session) {
        return (
            <Link href="/login">
                <Button variant="ghost" size="icon" className="cursor-pointer">
                    <UserIcon />
                </Button>
            </Link>
        );
    }

    const { user } = session;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="cursor-pointer">
                    <UserIcon />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel className="font-semibold">
                    Hi, {user?.name || user?.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    {isAdmin ? (
                        <Link href="/admin/dashboard" className="w-full">Dashboard</Link>
                    ) : (
                        <Link href="/profile" className="w-full">Profile</Link>
                    )}
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Link href="/orders" className="w-full">Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Link href="/settings" className="w-full">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <Link href="/help" className="w-full">Help</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Link href="/contact" className="w-full">Contact Us</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onSelect={() => signOut({ callbackUrl: "/" })}>
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu >
    );
}