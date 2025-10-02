import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/auth";
import { motion } from "framer-motion";
import {
  Calendar,
  BookOpen,
  TrendingUp,
  Clock,
  Award,
  Target,
} from "lucide-react";
import ProgressChart from "@/components/student/ProgressChart";
import UpcomingLessons from "@/components/student/UpcomingLessons";
import RecentLessonHistory from "@/components/student/RecentLessonHistory";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import {
  getProgressData,
  getRecentLessons,
} from "@/utils/studentDashboardData";

const StudentDashboardPage = () => {
  const { language, user } = useAuthStore();
  const [upcomingLessons, setUpcomingLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Convert language to 'en' or 'pt' for the data functions
  const dataLanguage = language === "pt" ? "pt" : "en";

  // Load upcoming lessons from Supabase
  const loadUpcomingLessons = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("user_id", user.id)
        .in("status", ["scheduled", "pending"]) // Include both scheduled and pending
        .gte("lesson_date", new Date().toISOString().split("T")[0])
        .order("lesson_date", { ascending: true })
        .limit(15); // Increased limit to show more lessons for group sessions

      if (error) {
        console.error("Error loading upcoming lessons:", error);
        return;
      }

      // Transform data to match UpcomingLessons component format
      const transformedLessons =
        data?.map((booking) => ({
          id: booking.id,
          title: getServiceName(
            booking.service_type,
            booking.group_session_number,
            booking.group_session_total
          ),
          date: booking.lesson_date,
          time: booking.lesson_time,
          day: booking.lesson_day,
          lesson_type: booking.lesson_type,
          service_type: booking.service_type,
          payment_status: booking.payment_status,
          group_session_number: booking.group_session_number,
          group_session_total: booking.group_session_total,
        })) || [];

      setUpcomingLessons(transformedLessons);
    } catch (error) {
      console.error("Error loading upcoming lessons:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUpcomingLessons();
  }, [user]);

  // Get service name with group session details
  const getServiceName = (
    serviceType: string,
    groupSessionNumber?: number,
    groupSessionTotal?: number
  ) => {
    let baseName = "";

    const serviceTypes = {
      individual:
        language === "en" ? "Individual Tutoring" : "Tutoria Individual",
      group: language === "en" ? "Group Session" : "Sessão em Grupo",
      "exam-prep":
        language === "en"
          ? "GCSE & A-Level Preparation"
          : "Preparação para Exames",
    };

    baseName = serviceTypes[serviceType] || serviceType;

    // Add session number for group sessions
    if (serviceType === "group" && groupSessionNumber && groupSessionTotal) {
      baseName += ` ${groupSessionNumber}/${groupSessionTotal}`;
    }

    return baseName;
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return language === "en"
      ? format(date, "MMM dd, yyyy")
      : format(date, "dd/MM/yyyy");
  };

  // Get mock data for other components
  const progressData = getProgressData(dataLanguage);
  const recentLessons = getRecentLessons(dataLanguage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-white">
      {/* Modern Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/80 backdrop-blur-xl shadow-2xl border-b border-slate-200/60 mb-8"
      >
        <div className="container mx-auto px-6 py-6">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl font-black bg-gradient-to-r from-slate-800 via-emerald-600 to-blue-500 bg-clip-text text-transparent"
          >
            {language === "en"
              ? `Welcome back, ${user?.name.split(" ")[0]}!`
              : `Bem-vindo(a) de volta, ${user?.name.split(" ")[0]}!`}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-slate-600 mt-1"
          >
            {language === "en"
              ? "Track your progress and manage your lessons"
              : "Acompanhe seu progresso e gerencie suas aulas"}
          </motion.p>
        </div>
      </motion.div>

      <div className="container mx-auto px-6">
        {/* Student Metrics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {[
            {
              title: language === "en" ? "Next Lesson" : "Próxima Aula",
              value: upcomingLessons.length > 0 ? "Today" : "None",
              icon: Calendar,
              color: "bg-gradient-to-r from-blue-500 to-blue-600",
              textColor: "text-blue-50",
              style: { backgroundColor: "#33658A" },
            },
            {
              title: language === "en" ? "Completed" : "Concluídas",
              value: "12",
              icon: BookOpen,
              color: "bg-gradient-to-r from-emerald-500 to-emerald-600",
              textColor: "text-emerald-50",
              style: { backgroundColor: "#86BBD8" },
            },
            {
              title: language === "en" ? "Progress" : "Progresso",
              value: "87%",
              icon: TrendingUp,
              color: "bg-gradient-to-r from-orange-500 to-orange-600",
              textColor: "text-orange-50",
              style: { backgroundColor: "#F6AE2D" },
            },
            {
              title: language === "en" ? "Study Time" : "Tempo de Estudo",
              value: "45h",
              icon: Clock,
              color: "bg-gradient-to-r from-purple-500 to-purple-600",
              textColor: "text-purple-50",
              style: { backgroundColor: "#F26419" },
            },
          ].map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300"
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

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Progress Chart */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="lg:col-span-2 bg-white backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100 p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: "#F6AE2D" }}
              >
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold" style={{ color: "#2F4858" }}>
                {language === "en"
                  ? "Learning Progress"
                  : "Progresso de Aprendizagem"}
              </h3>
            </div>
            <ProgressChart
              progressData={progressData}
              language={dataLanguage}
            />
          </motion.div>

          {/* Upcoming Lessons */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="bg-white backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100 p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: "#33658A" }}
              >
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold" style={{ color: "#2F4858" }}>
                {language === "en" ? "Upcoming" : "Próximas"}
              </h3>
            </div>
            <UpcomingLessons
              upcomingLessons={upcomingLessons}
              language={dataLanguage}
              formatDate={formatDate}
              onLessonCancelled={loadUpcomingLessons}
            />
          </motion.div>
        </div>

        {/* Recent Lesson History */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="mt-8 bg-white backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100 p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "#F26419" }}
            >
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-2xl font-bold" style={{ color: "#2F4858" }}>
              {language === "en" ? "Recent Lessons" : "Aulas Recentes"}
            </h3>
          </div>
          <RecentLessonHistory
            recentLessons={recentLessons}
            language={dataLanguage}
            formatDate={formatDate}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default StudentDashboardPage;
