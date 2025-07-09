import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "@/lib/auth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import AdminPanelPage from "./pages/AdminPanelPage";
import UserManagementPage from "./pages/UserManagementPage";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";
import ContactPage from "./pages/ContactPage";
import BookingPage from "./pages/BookingPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import StudentDashboardLayout from "./pages/student/StudentDashboardLayout";
import StudentDashboardPage from "./pages/student/StudentDashboardPage";
import StudentBookingsPage from "./pages/student/StudentBookingsPage";
import StudentHistoryPage from "./pages/student/StudentHistoryPage";
import StudentProgressPage from "./pages/student/StudentProgressPage";

const queryClient = new QueryClient();

const App = () => {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    // Initialize authentication on app startup
    initializeAuth();
  }, [initializeAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/admin" element={<AdminPanelPage />} />
            <Route path="/admin/users" element={<UserManagementPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/payment-success" element={<PaymentSuccessPage />} />

            {/* Student Dashboard Routes */}
            <Route path="/student" element={<StudentDashboardLayout />}>
              <Route index element={<StudentDashboardPage />} />
              <Route path="bookings" element={<StudentBookingsPage />} />
              <Route path="history" element={<StudentHistoryPage />} />
              <Route path="progress" element={<StudentProgressPage />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
