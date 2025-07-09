import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Plus, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Booking {
  id: string;
  service_type: string;
  lesson_type: string | null;
  lesson_date: string;
  lesson_time: string;
  lesson_day: string;
  payment_status: string | null;
  status: string;
  amount: number;
  currency: string | null;
  can_cancel_until: string | null;
  student_email: string | null;
  created_at: string;
  user_id: string;
}

const StudentBookingsPage: React.FC = () => {
  const { language, user } = useAuthStore();
  const { toast } = useToast();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Load bookings from database
  const loadBookings = async () => {
    if (!user) {
      console.log("No user found, cannot load bookings");
      return;
    }

    try {
      setLoading(true);
      console.log("Loading bookings for user:", user.id);

      // Check if we have a valid session
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        console.error("No valid session found:", sessionError);
        toast({
          title:
            language === "en" ? "Authentication Error" : "Erro de Autenticação",
          description:
            language === "en" ? "Please log in again" : "Faça login novamente",
          variant: "destructive",
        });
        return;
      }

      console.log("Session found, user authenticated. Fetching bookings...");

      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("user_id", user.id)
        .order("lesson_date", { ascending: false });

      if (error) {
        console.error("Error fetching bookings:", error);
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

      console.log("Bookings loaded successfully:", data);
      setBookings(data || []);

      if (!data || data.length === 0) {
        toast({
          title: language === "en" ? "No Bookings" : "Sem Agendamentos",
          description:
            language === "en"
              ? "No bookings found. Create your first booking!"
              : "Nenhum agendamento encontrado. Crie seu primeiro agendamento!",
        });
      }
    } catch (error) {
      console.error("Error in loadBookings:", error);
      toast({
        title: language === "en" ? "Error" : "Erro",
        description:
          language === "en"
            ? "An error occurred while loading bookings"
            : "Ocorreu um erro ao carregar os agendamentos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">
            {language === "en" ? "My Bookings" : "Meus Agendamentos"}
          </h1>
          <Button onClick={loadBookings} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            {language === "en" ? "Refresh" : "Atualizar"}
          </Button>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">
            {language === "en"
              ? "Loading bookings..."
              : "Carregando agendamentos..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {language === "en" ? "My Bookings" : "Meus Agendamentos"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {language === "en"
              ? "Manage your scheduled lessons and view payment status"
              : "Gerencie suas aulas agendadas e visualize o status de pagamento"}
          </p>
          {user && (
            <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
              <p>
                <strong>User Info:</strong> {user.name} ({user.email}) - Role:{" "}
                {user.role}
              </p>
              <p>
                <strong>Authentication:</strong> ✅ Authenticated with Supabase
              </p>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button onClick={loadBookings} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            {language === "en" ? "Refresh" : "Atualizar"}
          </Button>
          <Button
            onClick={() => window.open("/booking", "_blank")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            {language === "en" ? "New Booking" : "Novo Agendamento"}
          </Button>
        </div>
      </div>

      {/* Bookings Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {language === "en" ? "All Bookings" : "Todos os Agendamentos"}
          </CardTitle>
          <CardDescription>
            {language === "en"
              ? "Your lesson bookings"
              : "Seus agendamentos de aula"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 mb-4">
                {language === "en"
                  ? "No bookings found"
                  : "Nenhum agendamento encontrado"}
              </p>
              <p className="text-sm text-gray-400">
                {language === "en"
                  ? "You're successfully authenticated! Bookings will appear here when you create them."
                  : "Você está autenticado com sucesso! Os agendamentos aparecerão aqui quando você criá-los."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{booking.service_type}</h3>
                      <p className="text-sm text-gray-500">
                        {booking.lesson_date} at {booking.lesson_time}
                      </p>
                      <p className="text-sm">Status: {booking.status}</p>
                      <p className="text-sm">
                        Payment: {booking.payment_status}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {new Intl.NumberFormat(
                          language === "en" ? "en-GB" : "pt-BR",
                          {
                            style: "currency",
                            currency: (booking.currency || "GBP").toUpperCase(),
                          }
                        ).format(booking.amount / 100)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {language === "en" ? "Total Bookings" : "Total de Agendamentos"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookings.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {language === "en" ? "Upcoming" : "Próximas"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {
                bookings.filter(
                  (b) =>
                    b.status === "scheduled" &&
                    new Date(b.lesson_date) >= new Date()
                ).length
              }
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {language === "en" ? "Completed" : "Concluídas"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {bookings.filter((b) => b.status === "completed").length}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentBookingsPage;
