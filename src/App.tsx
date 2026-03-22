import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CurrencyProvider } from "@/hooks/useCurrency";
import { AuthProvider } from "@/hooks/useAuth";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { PaidFeatureGate } from "@/components/layout/PaidFeatureGate";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Booking from "./pages/Booking";
import Budget from "./pages/Budget";
import Customers from "./pages/Customers";
import Inventory from "./pages/Inventory";
import Pricing from "./pages/Pricing";
import CurrencyConverter from "./pages/CurrencyConverter";
import Calculator from "./pages/Calculator";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import PublicBooking from "./pages/PublicBooking";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Notes from "./pages/Notes";
import SalesReport from "./pages/SalesReport";
import Affiliate from "./pages/Affiliate";
import Admin from "./pages/Admin";
import { PAID_FEATURES } from "@/lib/featureAccess";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CurrencyProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/book" element={<PublicBooking />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={<PaidFeatureGate featureName={PAID_FEATURES["/dashboard"]}><Dashboard /></PaidFeatureGate>} />
                {/* Free features */}
                <Route path="/converter" element={<CurrencyConverter />} />
                <Route path="/calculator" element={<Calculator />} />
                <Route path="/notes" element={<Notes />} />
                <Route path="/affiliate" element={<Affiliate />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/settings" element={<Settings />} />
                {/* Paid features - gated */}
                <Route path="/booking" element={<PaidFeatureGate featureName={PAID_FEATURES["/booking"]}><Booking /></PaidFeatureGate>} />
                <Route path="/budget" element={<PaidFeatureGate featureName={PAID_FEATURES["/budget"]}><Budget /></PaidFeatureGate>} />
                <Route path="/customers" element={<PaidFeatureGate featureName={PAID_FEATURES["/customers"]}><Customers /></PaidFeatureGate>} />
                <Route path="/inventory" element={<PaidFeatureGate featureName={PAID_FEATURES["/inventory"]}><Inventory /></PaidFeatureGate>} />
                <Route path="/sales-report" element={<PaidFeatureGate featureName={PAID_FEATURES["/sales-report"]}><SalesReport /></PaidFeatureGate>} />
                <Route path="/admin" element={<Admin />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CurrencyProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
