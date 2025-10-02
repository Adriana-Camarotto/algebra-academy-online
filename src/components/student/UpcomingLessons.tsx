import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useBookingLogic } from "@/hooks/useBookingLogic";
import { useAuthStore } from "@/lib/auth";

interface UpcomingLessonsProps {
  upcomingLessons: Array<{
    id: number;
    title: string;
    date: string;
    time: string;
    day?: string;
    lesson_type?: string;
    service_type?: string;
  }>;
  language: "en" | "pt";
  formatDate: (dateString: string) => string;
  onLessonCancelled?: () => void; // Callback to refresh lessons
}

const UpcomingLessons: React.FC<UpcomingLessonsProps> = ({
  upcomingLessons,
  language,
  formatDate,
  onLessonCancelled,
}) => {
  const { user } = useAuthStore();

  const handleCancelLesson = async (lesson: any) => {
    try {
      // Note: This function needs to be implemented or passed from parent
      console.log("Cancel lesson:", lesson);
      if (onLessonCancelled) {
        onLessonCancelled(); // Refresh the lessons list
      }
    } catch (error) {
      console.error("Error cancelling lesson:", error);
    }
  };

  const canCancelLesson = (lesson: any) => {
    // Check if it's within 24 hours of the lesson
    const lessonDateTime = new Date(`${lesson.date}T${lesson.time}`);
    const now = new Date();
    const timeUntilLesson = lessonDateTime.getTime() - now.getTime();
    const hoursUntilLesson = timeUntilLesson / (1000 * 60 * 60);

    // Allow cancellation for all lesson types if more than 24 hours in advance
    return hoursUntilLesson > 24;
  };

  const getServiceDisplayName = (
    serviceType: string,
    language: "en" | "pt"
  ) => {
    const serviceNames = {
      "primary-school":
        language === "en" ? "Primary School" : "Escola Primária",
      "secondary-school":
        language === "en"
          ? "Secondary School (including GCSE preparation)"
          : "Escola Secundária (incluindo preparação para GCSE)",
      "a-level": language === "en" ? "A-level" : "A-level",
      individual:
        language === "en" ? "Individual Tutoring" : "Tutoria Individual",
      group: language === "en" ? "Group Session" : "Sessão em Grupo",
      "exam-prep":
        language === "en" ? "GCSE & A-Level Prep" : "Preparação para Exames",
    };
    return serviceNames[serviceType] || serviceType;
  };

  const getPaymentStatus = (lesson: any) => {
    // For group sessions, show automatic payment info
    if (lesson.service_type === "group") {
      const lessonDateTime = new Date(`${lesson.date}T${lesson.time}`);
      const now = new Date();
      const timeUntilLesson = lessonDateTime.getTime() - now.getTime();
      const hoursUntilLesson = timeUntilLesson / (1000 * 60 * 60);

      if (hoursUntilLesson <= 24 && lesson.payment_status === "pending") {
        return {
          status: "processing",
          text:
            language === "en"
              ? "Payment processing..."
              : "Processando pagamento...",
          color: "text-yellow-600",
        };
      } else if (lesson.payment_status === "paid") {
        return {
          status: "paid",
          text: language === "en" ? "Paid" : "Pago",
          color: "text-green-600",
        };
      } else {
        return {
          status: "pending",
          text:
            language === "en"
              ? "Auto-pay in 24h"
              : "Pagamento automático em 24h",
          color: "text-blue-600",
        };
      }
    }

    // For other lesson types
    if (lesson.payment_status === "paid") {
      return {
        status: "paid",
        text: language === "en" ? "Paid" : "Pago",
        color: "text-green-600",
      };
    } else {
      return {
        status: "pending",
        text: language === "en" ? "Pending payment" : "Pagamento pendente",
        color: "text-yellow-600",
      };
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {language === "en" ? "Upcoming Lessons" : "Próximas Aulas"}
        </CardTitle>
        <CardDescription>
          {language === "en"
            ? "Your scheduled sessions"
            : "Suas sessões agendadas"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {upcomingLessons.length > 0 ? (
          <div className="space-y-4">
            {upcomingLessons.map((lesson) => {
              const paymentInfo = getPaymentStatus(lesson);
              const canCancel = canCancelLesson(lesson);

              return (
                <div
                  key={lesson.id}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-900">
                        {getServiceDisplayName(lesson.service_type, language)}
                      </p>
                      {lesson.service_type === "group" && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {language === "en" ? "Group" : "Grupo"}
                        </span>
                      )}
                      {lesson.lesson_type === "recurring" &&
                        lesson.service_type === "individual" && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {language === "en" ? "Recurring" : "Recorrente"}
                          </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      {formatDate(lesson.date)} • {lesson.time}
                    </p>
                    <div className="flex items-center gap-4">
                      <span
                        className={`text-xs font-medium ${paymentInfo.color}`}
                      >
                        {paymentInfo.text}
                      </span>
                      {lesson.service_type === "group" && (
                        <span className="text-xs text-gray-500">
                          0.30{" "}
                          {language === "en" ? "per session" : "por sessão"}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    {canCancel ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCancelLesson(lesson)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        title={
                          language === "en" ? "Cancel lesson" : "Cancelar aula"
                        }
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    ) : (
                      <span className="text-xs text-gray-400 px-2">
                        {language === "en" ? "Cannot cancel" : "Não cancelável"}
                        {lesson.service_type === "group" && (
                          <span className="block text-xs">
                            {language === "en" ? "(< 24h)" : "(< 24h)"}
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            {language === "en" ? "No upcoming lessons" : "Sem aulas agendadas"}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingLessons;
