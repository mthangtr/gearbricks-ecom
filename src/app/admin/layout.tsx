import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NextTopLoader from 'nextjs-toploader';
import { SessionClientProvider } from "@/components/provider/SessionProvider";

import "@/app/globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "GearBricks",
    description: "Resell bricks and own designs",
};


export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.isAdmin === false) {
        return redirect("/");
    }
    return (
        <html lang="en">
            <head />
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <NextTopLoader
                    color="#6366f1"
                    height={3}
                    showSpinner={false}
                />
                <SessionClientProvider>
                    <SidebarProvider>
                        <AppSidebar />
                        <main className="flex-1 overflow-auto">
                            <div className="flex items-center justify-between px-4 py-2 bg-accent border-b">
                                <SidebarTrigger className="cursor-pointer" />
                            </div>
                            {children}
                        </main>
                    </SidebarProvider>
                </SessionClientProvider>
            </body>
        </html>

    );
}
