import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Outlet, Link } from "react-router-dom";
import { Zap } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export function DashboardLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          {/* Mobile top bar */}
          <div className="sticky top-0 z-40 flex items-center justify-between gap-2 border-b border-border bg-background/95 backdrop-blur-sm px-4 h-14 md:hidden">
            <SidebarTrigger className="-ml-1" />
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
                <Zap className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-base font-bold text-gradient">OjaLink</span>
            </Link>
            <ThemeToggle />
          </div>
          <div className="gradient-glow absolute inset-x-0 top-0 h-96 pointer-events-none" />
          <div className="relative">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
