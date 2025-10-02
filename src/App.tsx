import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import AdminPanelPage from "./pages/AdminPanelPage";
import AdminBookingsPage from "./pages/AdminBookingsPage";
import TutorDashboardPage from "./pages/TutorDashboardPage";
import UserManagementPage from "./pages/UserManagementPage";
import SystemSettingsPage from "./pages/SystemSettingsPage";
import SecurityPage from "./pages/SecurityPage";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";
import ContactPage from "./pages/ContactPage";
import BookingPage from "./pages/BookingPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import CheckoutPage from "./pages/CheckoutPage";
import BookingSuccessPage from "./pages/BookingSuccessPage";
import DateDebugger from "./components/DateDebugger";
import BookingDebugPage from "./pages/BookingDebugPage";
import SupabaseDebugPage from "./pages/SupabaseDebugPage";
import StudentDashboardLayout from "./pages/student/StudentDashboardLayout";
import StudentDashboardPage from "./pages/student/StudentDashboardPage";
import StudentBookingsPage from "./pages/student/StudentBookingsPage";
import StudentHistoryPage from "./pages/student/StudentHistoryPage";
import StudentProgressPage from "./pages/student/StudentProgressPage";
import { AuthProtectedRoute } from "./components/auth/AuthProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<Index />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/dashboard"
            element={
              <AuthProtectedRoute>
                <DashboardPage />
              </AuthProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AuthProtectedRoute>
                <AdminPanelPage />
              </AuthProtectedRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <AuthProtectedRoute>
                <AdminBookingsPage />
              </AuthProtectedRoute>
            }
          />
          <Route
            path="/tutor"
            element={
              <AuthProtectedRoute>
                <TutorDashboardPage />
              </AuthProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AuthProtectedRoute>
                <UserManagementPage />
              </AuthProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <AuthProtectedRoute>
                <SystemSettingsPage />
              </AuthProtectedRoute>
            }
          />
          <Route
            path="/admin/security"
            element={
              <AuthProtectedRoute>
                <SecurityPage />
              </AuthProtectedRoute>
            }
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/booking-success" element={<BookingSuccessPage />} />
          <Route path="/payment-success" element={<PaymentSuccessPage />} />
          <Route path="/debug-date" element={<DateDebugger />} />
          <Route path="/debug-booking" element={<BookingDebugPage />} />
          <Route path="/debug-supabase" element={<SupabaseDebugPage />} />
          {/* Student Dashboard Routes */}
          <Route path="/student" element={<StudentDashboardLayout />}>
            <Route index element={<StudentDashboardPage />} />
            <Route path="bookings" element={<StudentBookingsPage />} />
            <Route path="history" element={<StudentHistoryPage />} />
            <Route path="progress" element={<StudentProgressPage />} />
            {/* Additional student routes will be added here later */}
            <Route path="*" element={<NotFound />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
