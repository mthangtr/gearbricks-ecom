"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {

    return (
        <SidebarProvider>
            <div className="flex">
                <AppSidebar />
                <main className="flex-1">{children}</main>
            </div>
        </SidebarProvider>
    );
}
