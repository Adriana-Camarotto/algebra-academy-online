import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  Shield,
  Calendar,
  Users,
  TrendingUp,
  BookOpen,
  Settings,
  BarChart3,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useAuthStore, hasRole } from "@/lib/auth";
import { motion } from "framer-motion";

const DashboardPage: React.FC = () => {
  const { user, session, signOut } = useSupabaseAuth();
  const { user: authUser } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  useEffect(() => {
    if (!user && !session) {
      navigate("/login");
    }
  }, [user, session, navigate]);

  if (!user || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-white text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Dashboard metrics cards data
  const metrics = [
    {
      title: "Current MRR",
      value: "$12.4k",
      icon: TrendingUp,
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
      textColor: "text-blue-50",
      style: { backgroundColor: "#33658A" },
    },
    {
      title: "Active Students",
      value: "342",
      icon: Users,
      color: "bg-gradient-to-r from-emerald-500 to-emerald-600",
      textColor: "text-emerald-50",
      style: { backgroundColor: "#86BBD8" },
    },
    {
      title: "Sessions Today",
      value: "24",
      icon: BookOpen,
      color: "bg-gradient-to-r from-orange-500 to-orange-600",
      textColor: "text-orange-50",
      style: { backgroundColor: "#F6AE2D" },
    },
    {
      title: "Growth Rate",
      value: "+12%",
      icon: BarChart3,
      color: "bg-gradient-to-r from-purple-500 to-purple-600",
      textColor: "text-purple-50",
      style: { backgroundColor: "#F26419" },
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-white">
      {/* Modern Header */}
      <div className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-slate-200/60">
        <div className="container mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl font-black bg-gradient-to-r from-slate-800 via-orange-600 to-yellow-500 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-slate-600 mt-1">Welcome back, {user.email}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Button
                onClick={handleLogout}
                className="bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
              >
                <LogOut size={18} />
                Sign Out
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Metrics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform"
              style={metric.style}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium opacity-90">
                    {metric.title}
                  </p>
                  <p className="text-white text-3xl font-black mt-2">
                    {metric.value}
                  </p>
                </div>
                <metric.icon className="text-white w-12 h-12 opacity-80" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Modern Action Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8"
        >
          <div className="mb-8">
            <h3
              className="text-2xl font-bold mb-2"
              style={{ color: "#2F4858" }}
            >
              Quick Actions
            </h3>
            <p className="text-slate-600">
              Access your most important tools and features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Admin Panel Access */}
            {authUser && hasRole(authUser, "admin") && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group"
              >
                <Link to="/admin">
                  <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 h-32 flex flex-col items-center justify-center text-center relative overflow-hidden border border-gray-100">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-50 to-transparent transform -skew-x-12 opacity-0 group-hover:opacity-100 group-hover:animate-pulse" />
                    <Shield
                      className="h-10 w-10 mb-3 relative z-10"
                      style={{ color: "#F26419" }}
                    />
                    <span
                      className="font-bold text-lg relative z-10"
                      style={{ color: "#2F4858" }}
                    >
                      Admin Panel
                    </span>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Bookings Management */}
            {authUser &&
              (hasRole(authUser, "admin") || hasRole(authUser, "tutor")) && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group"
                >
                  <Link
                    to={
                      hasRole(authUser, "admin") ? "/admin/bookings" : "/tutor"
                    }
                  >
                    <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 h-32 flex flex-col items-center justify-center text-center relative overflow-hidden border border-gray-100">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-50 to-transparent transform -skew-x-12 opacity-0 group-hover:opacity-100 group-hover:animate-pulse" />
                      <Calendar
                        className="h-10 w-10 mb-3 relative z-10"
                        style={{ color: "#33658A" }}
                      />
                      <span
                        className="font-bold text-lg relative z-10"
                        style={{ color: "#2F4858" }}
                      >
                        View All Bookings
                      </span>
                    </div>
                  </Link>
                </motion.div>
              )}

            {/* Student Dashboard */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group"
            >
              <Link to="/student">
                <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 h-32 flex flex-col items-center justify-center text-center relative overflow-hidden border border-gray-100">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-50 to-transparent transform -skew-x-12 opacity-0 group-hover:opacity-100 group-hover:animate-pulse" />
                  <Users
                    className="h-10 w-10 mb-3 relative z-10"
                    style={{ color: "#86BBD8" }}
                  />
                  <span
                    className="font-bold text-lg relative z-10"
                    style={{ color: "#2F4858" }}
                  >
                    Student Portal
                  </span>
                </div>
              </Link>
            </motion.div>
          </div>

          {/* Recent Activity Section */}
          <div className="mt-12">
            <h3
              className="text-2xl font-bold mb-6"
              style={{ color: "#2F4858" }}
            >
              Recent Activity
            </h3>
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg">
              <div className="text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: "#F6AE2D" }}
                >
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <p className="text-lg" style={{ color: "#2F4858" }}>
                  No recent activity to show.
                </p>
                <p className="text-slate-500 text-sm mt-2">
                  Your recent actions and updates will appear here.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
