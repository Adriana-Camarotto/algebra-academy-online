import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore, hasRole } from "@/lib/auth";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { adminDeleteBooking } from "@/utils/paymentUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  PoundSterling,
  RefreshCw,
  Download,
  BookOpen,
  Users,
  TrendingUp,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";

interface Booking {
  id: string;
  user_id: string;
  service_type: string;
  lesson_type: string;
  lesson_date: string;
  lesson_time: string;
  lesson_day: string;
  status: string;
  payment_status: string;
  amount: number;
  currency: string;
  created_at: string;
  group_session_number?: number;
  group_session_total?: number;
  recurring_session_number?: number;
  recurring_session_total?: number;
  recurring_session_id?: string;
  user_email?: string;
  user_full_name?: string;
}

const AdminBookingsPage: React.FC = () => {
  const { user, language } = useAuthStore();
  const { loading } = useSupabaseAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  // Filter states - Active (applied) filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [serviceTypeFilter, setServiceTypeFilter] = useState<string>("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>("all");
  const [dateFromFilter, setDateFromFilter] = useState("");
  const [dateToFilter, setDateToFilter] = useState("");

  // Filter states - Pending (UI) filters
  const [pendingSearchTerm, setPendingSearchTerm] = useState("");
  const [pendingStatusFilter, setPendingStatusFilter] = useState<string>("all");
  const [pendingServiceTypeFilter, setPendingServiceTypeFilter] =
    useState<string>("all");
  const [pendingPaymentStatusFilter, setPendingPaymentStatusFilter] =
    useState<string>("all");
  const [pendingDateFromFilter, setPendingDateFromFilter] = useState("");
  const [pendingDateToFilter, setPendingDateToFilter] = useState("");

  // Delete booking state
  const [deletingBookingId, setDeletingBookingId] = useState<string | null>(
    null
  );

  // Dashboard metrics calculations
  const totalBookings = bookings.length;
  const activeStudents = new Set(
    bookings.map((booking) => booking.user_email || booking.user_id)
  ).size;
  const totalRevenue = bookings
    .filter(
      (booking) =>
        booking.payment_status === "paid" ||
        booking.payment_status === "completed"
    )
    .reduce((sum, booking) => {
      return sum + (booking.amount || 0);
    }, 0);

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

  // Initialize pending filters when component mounts
  useEffect(() => {
    setPendingSearchTerm(searchTerm);
    setPendingStatusFilter(statusFilter);
    setPendingServiceTypeFilter(serviceTypeFilter);
    setPendingPaymentStatusFilter(paymentStatusFilter);
    setPendingDateFromFilter(dateFromFilter);
    setPendingDateToFilter(dateToFilter);
  }, []);

  // Load all bookings
  const loadBookings = async () => {
    try {
      setLoadingBookings(true);
      console.log("🔄 Carregando bookings do Supabase...");

      // First, get all bookings - try basic query first
      console.log("🔍 Testando conectividade com Supabase...");
      console.log("👤 Usuário atual:", user);

      // Test basic connectivity and permissions
      const { count } = await supabase
        .from("bookings")
        .select("*", { count: "exact", head: true });

      console.log("📊 Total de bookings na tabela (count):", count);

      // Try to get current user session info
      const {
        data: { session },
      } = await supabase.auth.getSession();
      console.log("🔐 Sessão atual:", session?.user?.id);

      const { data: bookingsData, error: bookingsError } = await supabase
        .from("bookings")
        .select("*")
        .order("lesson_date", { ascending: false });

      console.log("📊 Dados recebidos do Supabase:", {
        bookingsData,
        count: bookingsData?.length || 0,
        error: bookingsError,
      });

      if (bookingsError) {
        console.error("❌ Erro ao carregar bookings:", bookingsError);
        toast({
          title: language === "en" ? "Error" : "Erro",
          description:
            language === "en"
              ? "Failed to load bookings"
              : "Falha ao carregar agendamentos",
          variant: "destructive",
        });
        return;
      }

      // Get unique user IDs
      const userIds = [
        ...new Set(bookingsData?.map((booking) => booking.user_id) || []),
      ];

      // Get user profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from("users")
        .select("id, email, name")
        .in("id", userIds);

      if (profilesError) {
        console.warn("Error loading user profiles:", profilesError);
      }

      // Create a map of user profiles for quick lookup
      const profilesMap = new Map(
        profilesData?.map((profile) => [profile.id, profile]) || []
      );

      // Transform data to include user information
      const transformedBookings: Booking[] =
        bookingsData?.map((booking) => {
          const profile = profilesMap.get(booking.user_id);
          return {
            ...booking,
            user_email: profile?.email || "N/A",
            user_full_name: profile?.name || "N/A",
          };
        }) || [];

      console.log("✅ Bookings transformados:", {
        originalCount: bookingsData?.length || 0,
        transformedCount: transformedBookings.length,
        userProfilesCount: profilesData?.length || 0,
        sampleBooking: transformedBookings[0],
      });

      setBookings(transformedBookings);
    } catch (error) {
      console.error("Error loading bookings:", error);
      toast({
        title: language === "en" ? "Error" : "Erro",
        description:
          language === "en"
            ? "Failed to load bookings"
            : "Falha ao carregar agendamentos",
        variant: "destructive",
      });
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  // Filter bookings based on all filters
  const filteredResults = useMemo(() => {
    let filtered = [...bookings];

    // Search filter (by user name or email)
    if (searchTerm) {
      filtered = filtered.filter(
        (booking) =>
          booking.user_full_name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          booking.user_email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.status === statusFilter);
    }

    // Service type filter
    if (serviceTypeFilter !== "all") {
      filtered = filtered.filter(
        (booking) => booking.service_type === serviceTypeFilter
      );
    }

    // Payment status filter
    if (paymentStatusFilter !== "all") {
      filtered = filtered.filter(
        (booking) => booking.payment_status === paymentStatusFilter
      );
    }

    // Date range filter
    if (dateFromFilter) {
      filtered = filtered.filter(
        (booking) => booking.lesson_date >= dateFromFilter
      );
    }

    if (dateToFilter) {
      filtered = filtered.filter(
        (booking) => booking.lesson_date <= dateToFilter
      );
    }

    return filtered;
  }, [
    bookings,
    searchTerm,
    statusFilter,
    serviceTypeFilter,
    paymentStatusFilter,
    dateFromFilter,
    dateToFilter,
  ]);

  useEffect(() => {
    setFilteredBookings(filteredResults);
  }, [filteredResults]);

  // Utility functions
  const formatCurrency = (amount: number, currency: string = "GBP") => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: currency,
    }).format(amount / 100);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy");
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: {
        color: "bg-green-100 text-green-800",
        label: language === "en" ? "Scheduled" : "Agendado",
      },
      completed: {
        color: "bg-blue-100 text-blue-800",
        label: language === "en" ? "Completed" : "Concluído",
      },
      cancelled: {
        color: "bg-red-100 text-red-800",
        label: language === "en" ? "Cancelled" : "Cancelado",
      },
      pending: {
        color: "bg-yellow-100 text-yellow-800",
        label: language === "en" ? "Pending" : "Pendente",
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      color: "bg-gray-100 text-gray-800",
      label: status,
    };

    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getPaymentStatusBadge = (paymentStatus: string) => {
    const statusConfig = {
      paid: {
        color: "bg-green-100 text-green-800",
        label: language === "en" ? "Paid" : "Pago",
      },
      pending: {
        color: "bg-yellow-100 text-yellow-800",
        label: language === "en" ? "Pending" : "Pendente",
      },
      failed: {
        color: "bg-red-100 text-red-800",
        label: language === "en" ? "Failed" : "Falhou",
      },
      refunded: {
        color: "bg-purple-100 text-purple-800",
        label: language === "en" ? "Refunded" : "Reembolsado",
      },
      completed: {
        color: "bg-green-100 text-green-800",
        label: language === "en" ? "Completed" : "Concluído",
      },
    };

    const config = statusConfig[paymentStatus as keyof typeof statusConfig] || {
      color: "bg-gray-100 text-gray-800",
      label: paymentStatus,
    };

    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getServiceTypeLabel = (serviceType: string, lessonType?: string) => {
    if (serviceType === "individual" && lessonType === "recurring") {
      return language === "en"
        ? "Individual (Recurring)"
        : "Individual (Recorrente)";
    }

    if (
      (serviceType === "primary-school" ||
        serviceType === "secondary-school" ||
        serviceType === "a-level") &&
      lessonType === "recurring"
    ) {
      const baseLabel = types[serviceType as keyof typeof types] || serviceType;
      return language === "en"
        ? `${baseLabel} (Recurring)`
        : `${baseLabel} (Recorrente)`;
    }

    const types = {
      "primary-school":
        language === "en" ? "Primary School" : "Escola Primária",
      "secondary-school":
        language === "en" ? "Secondary School" : "Escola Secundária",
      "a-level": language === "en" ? "A-level" : "A-level",
      individual: language === "en" ? "Individual" : "Individual",
      group: language === "en" ? "Group" : "Grupo",
      "exam-prep": language === "en" ? "Exam Prep" : "Preparação",
    };
    return types[serviceType as keyof typeof types] || serviceType;
  };

  const clearAllFilters = () => {
    // Clear both pending and active filters
    setSearchTerm("");
    setStatusFilter("all");
    setServiceTypeFilter("all");
    setPaymentStatusFilter("all");
    setDateFromFilter("");
    setDateToFilter("");

    // Clear pending filters too
    setPendingSearchTerm("");
    setPendingStatusFilter("all");
    setPendingServiceTypeFilter("all");
    setPendingPaymentStatusFilter("all");
    setPendingDateFromFilter("");
    setPendingDateToFilter("");
  };

  // Delete booking function with automatic refund logic
  const handleDeleteBooking = async (bookingId: string) => {
    try {
      setDeletingBookingId(bookingId);

      // Get the booking details before deletion for UI updates
      const bookingToDelete = bookings.find((b) => b.id === bookingId);
      if (!bookingToDelete) {
        throw new Error("Booking not found");
      }

      // Use the new admin delete function with automatic refund logic
      const result = await adminDeleteBooking(bookingId, language);

      if (!result.success) {
        throw new Error(result.message);
      }

      // Update local state to remove the deleted booking
      setBookings((prev) => prev.filter((booking) => booking.id !== bookingId));
      setFilteredBookings((prev) =>
        prev.filter((booking) => booking.id !== bookingId)
      );

      // Show success message with refund information
      let toastDescription = result.message;

      if (result.withinPaymentWindow && result.automaticRefundProcessed) {
        toastDescription =
          language === "en"
            ? "Booking deleted successfully and automatic refund processed"
            : "Agendamento deletado com sucesso e reembolso automático processado";
      } else if (
        result.withinPaymentWindow &&
        !result.automaticRefundProcessed
      ) {
        toastDescription =
          language === "en"
            ? "Booking deleted but automatic refund failed - please process manually"
            : "Agendamento deletado mas reembolso automático falhou - processar manualmente";
      }

      toast({
        title: language === "en" ? "Success" : "Sucesso",
        description: toastDescription,
        variant:
          result.automaticRefundProcessed === false &&
          result.withinPaymentWindow
            ? "destructive"
            : "default",
      });

      // Log refund information for admin visibility
      if (result.automaticRefundProcessed && result.refundId) {
        console.log("✅ Automatic refund processed:", {
          bookingId,
          refundId: result.refundId,
          studentEmail: bookingToDelete.user_email,
          amount: bookingToDelete.amount,
          currency: bookingToDelete.currency,
        });
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast({
        title: language === "en" ? "Error" : "Erro",
        description:
          error instanceof Error
            ? error.message
            : language === "en"
            ? "Failed to delete booking"
            : "Falha ao deletar agendamento",
        variant: "destructive",
      });
    } finally {
      setDeletingBookingId(null);
    }
  };

  const applyPendingFilters = () => {
    // Apply pending filters to active filters
    setSearchTerm(pendingSearchTerm);
    setStatusFilter(pendingStatusFilter);
    setServiceTypeFilter(pendingServiceTypeFilter);
    setPaymentStatusFilter(pendingPaymentStatusFilter);
    setDateFromFilter(pendingDateFromFilter);
    setDateToFilter(pendingDateToFilter);
  };

  // Check if there are pending changes
  const hasPendingChanges =
    pendingSearchTerm !== searchTerm ||
    pendingStatusFilter !== statusFilter ||
    pendingServiceTypeFilter !== serviceTypeFilter ||
    pendingPaymentStatusFilter !== paymentStatusFilter ||
    pendingDateFromFilter !== dateFromFilter ||
    pendingDateToFilter !== dateToFilter;

  const exportToCSV = () => {
    const headers = [
      "ID",
      "Student Name",
      "Email",
      "Service Type",
      "Lesson Type",
      "Date",
      "Time",
      "Status",
      "Payment Status",
      "Amount",
      "Created At",
    ];

    const csvData = filteredBookings.map((booking) => [
      booking.id,
      booking.user_full_name || "N/A",
      booking.user_email || "N/A",
      getServiceTypeLabel(booking.service_type),
      booking.lesson_type || "N/A",
      booking.lesson_date,
      booking.lesson_time,
      booking.status,
      booking.payment_status,
      formatCurrency(booking.amount, booking.currency),
      formatDate(booking.created_at),
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `bookings_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-white">
      {/* Modern Header with Dashboard Metrics */}
      <div className="bg-white/80 backdrop-blur-xl shadow-2xl border-b border-slate-200/60 mb-8">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center gap-4"
            >
              <Button
                onClick={() => navigate("/admin")}
                className="text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                style={{ backgroundColor: "#2F4858" }}
              >
                <ArrowLeft size={18} />
                {language === "en" ? "Back" : "Voltar"}
              </Button>
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-slate-800 via-blue-600 to-emerald-500 bg-clip-text text-transparent">
                  {language === "en" ? "All Bookings" : "Todos os Agendamentos"}
                </h1>
                <p className="text-slate-600 mt-1">
                  {language === "en"
                    ? "Manage and view all student bookings"
                    : "Gerencie e visualize todos os agendamentos de alunos"}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex items-center gap-3"
            >
              <Button
                onClick={loadBookings}
                disabled={loadingBookings}
                className="text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                style={{ backgroundColor: "#33658A" }}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${
                    loadingBookings ? "animate-spin" : ""
                  }`}
                />
                {language === "en" ? "Refresh" : "Atualizar"}
              </Button>
              <Button
                onClick={exportToCSV}
                className="text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                style={{ backgroundColor: "#86BBD8" }}
              >
                <Download className="h-4 w-4 mr-2" />
                {language === "en" ? "Export CSV" : "Exportar CSV"}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6">
        {/* Enhanced Stats Cards with Modern Design */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div
            className="backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20"
            style={{ backgroundColor: "#33658A" }}
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <p className="text-sm font-medium text-white/80">
                  {language === "en" ? "Total Bookings" : "Total Agendamentos"}
                </p>
                <p className="text-3xl font-black text-white">
                  {bookings.length}
                </p>
              </div>
              <div className="flex items-center justify-center">
                <Calendar className="h-8 w-8 text-white/80" />
              </div>
            </div>
          </div>

          <div
            className="backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20"
            style={{ backgroundColor: "#86BBD8" }}
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <p className="text-sm font-medium text-white/80">
                  {language === "en" ? "Scheduled" : "Agendados"}
                </p>
                <p className="text-3xl font-black text-white">
                  {bookings.filter((b) => b.status === "scheduled").length}
                </p>
              </div>
              <div className="flex items-center justify-center">
                <Clock className="h-8 w-8 text-white/80" />
              </div>
            </div>
          </div>

          <div
            className="backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20"
            style={{ backgroundColor: "#F6AE2D" }}
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <p className="text-sm font-medium text-white/80">
                  {language === "en" ? "Unique Students" : "Alunos Únicos"}
                </p>
                <p className="text-3xl font-black text-white">
                  {new Set(bookings.map((b) => b.user_id)).size}
                </p>
              </div>
              <div className="flex items-center justify-center">
                <Users className="h-8 w-8 text-white/80" />
              </div>
            </div>
          </div>

          <div
            className="backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20"
            style={{ backgroundColor: "#F26419" }}
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <p className="text-sm font-medium text-white/80">
                  {language === "en" ? "Total Revenue" : "Receita Total"}
                </p>
                <p className="text-3xl font-black text-white">
                  £{totalRevenue.toFixed(0)}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Filters Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card className="mb-8 bg-white/90 backdrop-blur-2xl shadow-2xl border-0 rounded-3xl overflow-hidden relative">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-slate-50/30 pointer-events-none"></div>

            <CardHeader className="relative bg-gradient-to-r from-slate-50/80 to-blue-50/80 backdrop-blur-xl border-b border-slate-200/40 p-6">
              <CardTitle className="flex items-center gap-4 text-2xl font-bold">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                  style={{
                    background:
                      "linear-gradient(135deg, #F6AE2D 0%, #F26419 100%)",
                  }}
                >
                  <Filter className="h-6 w-6 text-white" />
                </motion.div>
                <div>
                  <span style={{ color: "#2F4858" }}>
                    {language === "en"
                      ? "Advanced Filters"
                      : "Filtros Avançados"}
                  </span>
                  <p className="text-sm font-normal text-slate-500 mt-1">
                    {language === "en"
                      ? "Refine your search with powerful filters"
                      : "Refine sua busca com filtros poderosos"}
                  </p>
                </div>
              </CardTitle>
            </CardHeader>

            <CardContent className="relative p-8 bg-gradient-to-br from-white via-slate-50/30 to-white">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                {/* Search */}
                <div className="relative group">
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: "#2F4858" }}
                  >
                    {language === "en" ? "Search Student" : "Buscar Aluno"}
                  </label>
                  <div className="relative">
                    <Search
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors duration-200"
                      style={{ color: "#86BBD8" }}
                    />
                    <Input
                      placeholder={
                        language === "en"
                          ? "Type student name..."
                          : "Digite o nome..."
                      }
                      value={pendingSearchTerm}
                      onChange={(e) => setPendingSearchTerm(e.target.value)}
                      className="pl-12 h-11 rounded-xl border-2 border-slate-200/60 bg-white/80 backdrop-blur-sm transition-all duration-200 hover:border-slate-300 focus:border-blue-400 focus:shadow-lg focus:shadow-blue-100/50"
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <div className="group">
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: "#2F4858" }}
                  >
                    {language === "en" ? "Booking Status" : "Status"}
                  </label>
                  <Select
                    value={pendingStatusFilter}
                    onValueChange={setPendingStatusFilter}
                  >
                    <SelectTrigger className="h-11 rounded-xl border-2 border-slate-200/60 bg-white/80 backdrop-blur-sm transition-all duration-200 hover:border-slate-300 focus:border-blue-400">
                      <SelectValue
                        placeholder={
                          language === "en"
                            ? "Select status..."
                            : "Selecione status..."
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-0 shadow-2xl bg-white/95 backdrop-blur-xl">
                      <SelectItem value="all" className="rounded-lg">
                        {language === "en" ? "All Status" : "Todos os Status"}
                      </SelectItem>
                      <SelectItem value="scheduled" className="rounded-lg">
                        {language === "en" ? "Scheduled" : "Agendado"}
                      </SelectItem>
                      <SelectItem value="completed" className="rounded-lg">
                        {language === "en" ? "Completed" : "Concluído"}
                      </SelectItem>
                      <SelectItem value="cancelled" className="rounded-lg">
                        {language === "en" ? "Cancelled" : "Cancelado"}
                      </SelectItem>
                      <SelectItem value="pending" className="rounded-lg">
                        {language === "en" ? "Pending" : "Pendente"}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Service Type Filter */}
                <div className="group">
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: "#2F4858" }}
                  >
                    {language === "en" ? "Service Type" : "Tipo de Serviço"}
                  </label>
                  <Select
                    value={pendingServiceTypeFilter}
                    onValueChange={setPendingServiceTypeFilter}
                  >
                    <SelectTrigger className="h-11 rounded-xl border-2 border-slate-200/60 bg-white/80 backdrop-blur-sm transition-all duration-200 hover:border-slate-300 focus:border-blue-400">
                      <SelectValue
                        placeholder={
                          language === "en"
                            ? "Select type..."
                            : "Selecione tipo..."
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-0 shadow-2xl bg-white/95 backdrop-blur-xl">
                      <SelectItem value="all" className="rounded-lg">
                        {language === "en" ? "All Types" : "Todos os Tipos"}
                      </SelectItem>
                      <SelectItem value="primary-school" className="rounded-lg">
                        {language === "en"
                          ? "Primary School"
                          : "Escola Primária"}
                      </SelectItem>
                      <SelectItem
                        value="secondary-school"
                        className="rounded-lg"
                      >
                        {language === "en"
                          ? "Secondary School"
                          : "Escola Secundária"}
                      </SelectItem>
                      <SelectItem value="a-level" className="rounded-lg">
                        {language === "en" ? "A-level" : "A-level"}
                      </SelectItem>
                      <SelectItem value="individual" className="rounded-lg">
                        {language === "en" ? "Individual" : "Individual"}
                      </SelectItem>
                      <SelectItem value="group" className="rounded-lg">
                        {language === "en" ? "Group" : "Grupo"}
                      </SelectItem>
                      <SelectItem value="exam-prep" className="rounded-lg">
                        {language === "en" ? "Exam Prep" : "Preparação"}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Payment Status Filter */}
                <div className="group">
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: "#2F4858" }}
                  >
                    {language === "en" ? "Payment Status" : "Status Pagamento"}
                  </label>
                  <Select
                    value={pendingPaymentStatusFilter}
                    onValueChange={setPendingPaymentStatusFilter}
                  >
                    <SelectTrigger className="h-11 rounded-xl border-2 border-slate-200/60 bg-white/80 backdrop-blur-sm transition-all duration-200 hover:border-slate-300 focus:border-blue-400">
                      <SelectValue
                        placeholder={
                          language === "en"
                            ? "Select payment..."
                            : "Selecione pagamento..."
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-0 shadow-2xl bg-white/95 backdrop-blur-xl">
                      <SelectItem value="all" className="rounded-lg">
                        {language === "en"
                          ? "All Payments"
                          : "Todos Pagamentos"}
                      </SelectItem>
                      <SelectItem value="paid" className="rounded-lg">
                        {language === "en" ? "Paid" : "Pago"}
                      </SelectItem>
                      <SelectItem value="pending" className="rounded-lg">
                        {language === "en" ? "Pending" : "Pendente"}
                      </SelectItem>
                      <SelectItem value="completed" className="rounded-lg">
                        {language === "en" ? "Completed" : "Concluído"}
                      </SelectItem>
                      <SelectItem value="failed" className="rounded-lg">
                        {language === "en" ? "Failed" : "Falhou"}
                      </SelectItem>
                      <SelectItem value="refunded" className="rounded-lg">
                        {language === "en" ? "Refunded" : "Reembolsado"}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Date From */}
                <div className="group">
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: "#2F4858" }}
                  >
                    {language === "en" ? "From Date" : "Data Inicial"}
                  </label>
                  <Input
                    type="date"
                    value={pendingDateFromFilter}
                    onChange={(e) => setPendingDateFromFilter(e.target.value)}
                    className="h-11 rounded-xl border-2 border-slate-200/60 bg-white/80 backdrop-blur-sm transition-all duration-200 hover:border-slate-300 focus:border-blue-400 focus:shadow-lg focus:shadow-blue-100/50"
                  />
                </div>

                {/* Date To */}
                <div className="group">
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: "#2F4858" }}
                  >
                    {language === "en" ? "To Date" : "Data Final"}
                  </label>
                  <Input
                    type="date"
                    value={pendingDateToFilter}
                    onChange={(e) => setPendingDateToFilter(e.target.value)}
                    className="h-11 rounded-xl border-2 border-slate-200/60 bg-white/80 backdrop-blur-sm transition-all duration-200 hover:border-slate-300 focus:border-blue-400 focus:shadow-lg focus:shadow-blue-100/50"
                  />
                </div>
              </div>

              {/* Action Buttons Section */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-8 pt-6 border-t border-slate-200/40">
                <div className="flex flex-wrap items-center gap-3">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="ghost"
                      onClick={clearAllFilters}
                      className="h-11 px-6 rounded-xl font-medium transition-all duration-200 hover:bg-slate-100/80"
                      style={{ color: "#86BBD8" }}
                    >
                      {language === "en"
                        ? "Clear All Filters"
                        : "Limpar Filtros"}
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={applyPendingFilters}
                      disabled={!hasPendingChanges}
                      className="h-11 px-8 rounded-xl text-white font-semibold shadow-lg transition-all duration-200 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        backgroundColor: hasPendingChanges
                          ? "#2F4858"
                          : "#94A3B8",
                        color: "white",
                        border: "none",
                        opacity: hasPendingChanges ? 1 : 0.5,
                      }}
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      {language === "en" ? "Apply Filters" : "Aplicar Filtros"}
                    </Button>
                  </motion.div>

                  {hasPendingChanges && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Badge
                        variant="outline"
                        className="px-3 py-1 rounded-lg font-medium border-2"
                        style={{
                          color: "#F26419",
                          borderColor: "#F26419",
                          backgroundColor: "#FFF7ED",
                        }}
                      >
                        {language === "en"
                          ? "Filters not applied"
                          : "Filtros não aplicados"}
                      </Badge>
                    </motion.div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: "#86BBD8" }}
                  ></div>
                  <p
                    className="text-sm font-medium"
                    style={{ color: "#2F4858" }}
                  >
                    <span className="font-bold">{filteredBookings.length}</span>{" "}
                    {language === "en" ? "of" : "de"}{" "}
                    <span className="font-bold">{bookings.length}</span>{" "}
                    {language === "en" ? "bookings" : "agendamentos"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Enhanced Bookings Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <Card className="bg-white backdrop-blur-xl shadow-2xl border border-gray-100 rounded-3xl overflow-hidden">
            <CardHeader>
              <CardTitle style={{ color: "#2F4858" }}>
                {language === "en" ? "Bookings List" : "Lista de Agendamentos"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingBookings ? (
                <div className="text-center py-8">
                  <RefreshCw
                    className="h-8 w-8 animate-spin mx-auto mb-2"
                    style={{ color: "#33658A" }}
                  />
                  <p className="text-slate-600">
                    {language === "en"
                      ? "Loading bookings..."
                      : "Carregando agendamentos..."}
                  </p>
                </div>
              ) : filteredBookings.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-500">
                    {language === "en"
                      ? "No bookings found"
                      : "Nenhum agendamento encontrado"}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          {language === "en" ? "Student" : "Aluno"}
                        </TableHead>
                        <TableHead>
                          {language === "en" ? "Service" : "Serviço"}
                        </TableHead>
                        <TableHead>
                          {language === "en" ? "Date" : "Data"}
                        </TableHead>
                        <TableHead>
                          {language === "en" ? "Time" : "Horário"}
                        </TableHead>
                        <TableHead>
                          {language === "en" ? "Status" : "Status"}
                        </TableHead>
                        <TableHead>
                          {language === "en" ? "Payment" : "Pagamento"}
                        </TableHead>
                        <TableHead>
                          {language === "en" ? "Amount" : "Valor"}
                        </TableHead>
                        <TableHead>
                          {language === "en" ? "Created" : "Criado"}
                        </TableHead>
                        <TableHead className="text-center">
                          {language === "en" ? "Actions" : "Ações"}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {booking.user_full_name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {booking.user_email}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {getServiceTypeLabel(
                                  booking.service_type,
                                  booking.lesson_type
                                )}
                              </p>
                              {booking.lesson_type && (
                                <p className="text-sm text-gray-500">
                                  {booking.lesson_type}
                                </p>
                              )}
                              {booking.group_session_number &&
                                booking.group_session_total && (
                                  <p className="text-xs text-blue-500">
                                    {language === "en" ? "Session" : "Sessão"}{" "}
                                    {booking.group_session_number}/
                                    {booking.group_session_total}
                                  </p>
                                )}
                              {booking.recurring_session_number &&
                                booking.recurring_session_total && (
                                  <p className="text-xs text-purple-500">
                                    {language === "en" ? "Lesson" : "Aula"}{" "}
                                    {booking.recurring_session_number}/
                                    {booking.recurring_session_total}
                                  </p>
                                )}
                              {booking.recurring_session_id && (
                                <p className="text-xs text-purple-400">
                                  Series:{" "}
                                  {booking.recurring_session_id.slice(-8)}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {formatDate(booking.lesson_date)}
                          </TableCell>
                          <TableCell>{booking.lesson_time}</TableCell>
                          <TableCell>
                            {getStatusBadge(booking.status)}
                          </TableCell>
                          <TableCell>
                            {getPaymentStatusBadge(booking.payment_status)}
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(booking.amount, booking.currency)}
                          </TableCell>
                          <TableCell>
                            {formatDate(booking.created_at)}
                          </TableCell>
                          <TableCell className="text-center">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 hover:bg-red-50 transition-colors duration-200"
                                  disabled={deletingBookingId === booking.id}
                                >
                                  {deletingBookingId === booking.id ? (
                                    <RefreshCw
                                      className="h-4 w-4 animate-spin"
                                      style={{ color: "#2F4858" }}
                                    />
                                  ) : (
                                    <Trash2
                                      className="h-4 w-4"
                                      style={{ color: "#2F4858" }}
                                    />
                                  )}
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-white rounded-2xl border-0 shadow-2xl">
                                <AlertDialogHeader>
                                  <AlertDialogTitle
                                    className="text-xl font-bold"
                                    style={{ color: "#2F4858" }}
                                  >
                                    {language === "en"
                                      ? "Delete Booking"
                                      : "Deletar Agendamento"}
                                  </AlertDialogTitle>
                                  <AlertDialogDescription className="text-gray-600 space-y-2">
                                    <div>
                                      {language === "en"
                                        ? "Are you sure you want to delete this booking? This action is irreversible and the booking will be permanently removed from the system."
                                        : "Tem certeza que quer deletar este agendamento? Esta ação é irreversível e o agendamento será permanentemente removido do sistema."}
                                    </div>
                                    {(() => {
                                      const lessonDateTime = new Date(
                                        `${booking.lesson_date}T${booking.lesson_time}`
                                      );
                                      const twentyFourHoursBefore = new Date(
                                        lessonDateTime.getTime() -
                                          24 * 60 * 60 * 1000
                                      );
                                      const now = new Date();
                                      const isWithinPaymentWindow =
                                        now >= twentyFourHoursBefore &&
                                        now < lessonDateTime;
                                      const isPaid =
                                        booking.payment_status === "paid" ||
                                        booking.payment_status === "completed";

                                      if (
                                        isWithinPaymentWindow &&
                                        isPaid &&
                                        booking.status !== "cancelled"
                                      ) {
                                        return (
                                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
                                            <div className="text-blue-800 font-medium text-sm">
                                              💰{" "}
                                              {language === "en"
                                                ? "Automatic Refund: This lesson is within the 24-hour payment window. The student will receive an automatic refund."
                                                : "Reembolso Automático: Esta aula está dentro do período de 24 horas de pagamento. O aluno receberá um reembolso automático."}
                                            </div>
                                          </div>
                                        );
                                      }
                                      return null;
                                    })()}
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="gap-3">
                                  <AlertDialogCancel className="rounded-xl border-2 border-gray-300 hover:bg-gray-50">
                                    {language === "en" ? "Cancel" : "Cancelar"}
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleDeleteBooking(booking.id)
                                    }
                                    className="rounded-xl text-white font-semibold hover:opacity-90 transition-opacity"
                                    style={{ backgroundColor: "#F26419" }}
                                  >
                                    {language === "en" ? "Delete" : "Deletar"}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminBookingsPage;
