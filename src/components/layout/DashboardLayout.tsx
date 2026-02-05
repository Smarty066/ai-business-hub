import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Outlet } from "react-router-dom";

export function DashboardLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <div className="gradient-glow absolute inset-x-0 top-0 h-96 pointer-events-none" />
          <div className="relative">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
