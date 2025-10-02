import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Home } from "lucide-react";
import { useAuthStore, hasRole } from "@/lib/auth";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import AdminBookingsPage from "./AdminBookingsPage";

const TutorDashboardPage: React.FC = () => {
  const { user, logout, language } = useAuthStore();
  const { loading } = useSupabaseAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check permissions
  useEffect(() => {
    if (loading) return;

    if (!user || (!hasRole(user, "admin") && !hasRole(user, "tutor"))) {
      toast({
        title: language === "en" ? "Access Denied" : "Acesso Negado",
        description:
          language === "en"
            ? "You don't have permission to access this page"
            : "Você não tem permissão para acessar esta página",
        variant: "destructive",
      });
      navigate("/dashboard");
    }
  }, [user, loading, navigate, toast, language]);

  const handleGoHome = () => {
    navigate("/");
  };

  const handleLogout = () => {
    logout();
    toast({
      title: language === "en" ? "Logged out" : "Sessão encerrada",
      description:
        language === "en"
          ? "You have been successfully logged out"
          : "Você foi desconectado com sucesso",
    });
    navigate("/");
  };

  if (
    loading ||
    !user ||
    (!hasRole(user, "admin") && !hasRole(user, "tutor"))
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-white text-lg">
            {loading ? "🔐 Loading..." : "🚫 Access denied. Redirecting..."}
          </p>
        </div>
      </div>
    );
  }

  // Modern Tutor dashboard with premium design
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-white">
      {/* Premium Header with glassmorphism */}
      <div className="bg-white/80 backdrop-blur-xl shadow-2xl border-b border-slate-200/60">
        <div className="container mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl font-black bg-gradient-to-r from-slate-800 via-blue-600 to-emerald-500 bg-clip-text text-transparent">
                {language === "en" ? "Tutor Dashboard" : "Dashboard do Tutor"}
              </h1>
              <p className="text-slate-600 mt-1">
                Manage your lessons and students
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center gap-3"
            >
              <Button
                onClick={handleGoHome}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
              >
                <Home size={18} />
                {language === "en" ? "Home" : "Início"}
              </Button>
              <Button
                onClick={handleLogout}
                className="bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
              >
                <LogOut size={18} />
                {language === "en" ? "Sign Out" : "Sair"}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Enhanced Bookings content with modern styling */}
      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
        >
          <AdminBookingsPage />
        </motion.div>
      </div>
    </div>
  );
};

export default TutorDashboardPage;
