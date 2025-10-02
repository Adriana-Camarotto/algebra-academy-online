import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, Clock, Star, Loader2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "@/lib/auth";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MathSymbol from "@/components/MathSymbol";
import { useToast } from "@/hooks/use-toast";

const BookingSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useAuthStore();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [isProcessingRecurring, setIsProcessingRecurring] = useState(false);
  const [recurringProcessed, setRecurringProcessed] = useState(false);

  const isRecurring = searchParams.get("recurring") === "true";

  // Process recurring lessons after payment confirmation
  useEffect(() => {
    const processRecurringLessons = async () => {
      if (!isRecurring || recurringProcessed) return;

      const pendingBookingData = sessionStorage.getItem(
        "pendingRecurringBooking"
      );
      if (!pendingBookingData) {
        console.log("No pending recurring booking data found");
        return;
      }

      setIsProcessingRecurring(true);

      try {
        const bookingData = JSON.parse(pendingBookingData);
        console.log(
          "🔄 Processing recurring lessons after payment:",
          bookingData
        );

        const response = await fetch(
          `${
            import.meta.env.VITE_SUPABASE_URL
          }/functions/v1/create-recurring-lessons`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify(bookingData),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || "Failed to create recurring lessons"
          );
        }

        const result = await response.json();
        console.log("✅ Recurring lessons created successfully:", result);

        // Clear the pending booking data
        sessionStorage.removeItem("pendingRecurringBooking");
        setRecurringProcessed(true);

        toast({
          title: language === "en" ? "Success!" : "Sucesso!",
          description:
            language === "en"
              ? `Successfully created ${result.bookings_created} recurring lessons`
              : `${result.bookings_created} aulas recorrentes criadas com sucesso`,
        });
      } catch (error) {
        console.error("❌ Error processing recurring lessons:", error);
        toast({
          title:
            language === "en" ? "Processing Error" : "Erro de Processamento",
          description:
            language === "en"
              ? "There was an issue creating your recurring lessons. Please contact support."
              : "Houve um problema ao criar suas aulas recorrentes. Entre em contato com o suporte.",
          variant: "destructive",
        });
      } finally {
        setIsProcessingRecurring(false);
      }
    };

    processRecurringLessons();
  }, [isRecurring, language, toast, recurringProcessed]);

  const content = {
    en: {
      title: "Payment Successful!",
      subtitle: isRecurring
        ? "Your recurring lessons are being created"
        : "Your lesson has been booked successfully",
      description: isRecurring
        ? "Your payment was successful. We're now creating your recurring lesson series."
        : "You will receive a confirmation email shortly with all the details.",
      returnHome: "Return to Home",
      nextSteps: "Next Steps:",
      step1: isRecurring
        ? "Wait for lesson creation to complete"
        : "Check your email for confirmation",
      step2: "Add the lessons to your calendar",
      step3: "Join the lessons at the scheduled times",
      processing: "Creating your recurring lessons...",
      recurringSuccess: "All recurring lessons created successfully!",
    },
    pt: {
      title: "Pagamento Realizado!",
      subtitle: isRecurring
        ? "Suas aulas recorrentes estão sendo criadas"
        : "Sua aula foi agendada com sucesso",
      description: isRecurring
        ? "Seu pagamento foi realizado. Agora estamos criando sua série de aulas recorrentes."
        : "Você receberá um email de confirmação em breve com todos os detalhes.",
      returnHome: "Voltar ao Início",
      nextSteps: "Próximos Passos:",
      step1: isRecurring
        ? "Aguarde a criação das aulas ser concluída"
        : "Verifique seu email para confirmação",
      step2: "Adicione as aulas ao seu calendário",
      step3: "Participe das aulas nos horários agendados",
      processing: "Criando suas aulas recorrentes...",
      recurringSuccess: "Todas as aulas recorrentes criadas com sucesso!",
    },
  };

  const t = content[language as keyof typeof content] || content.en;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Enhanced Hero Section */}
        <section className="relative py-20 md:py-32 bg-gradient-to-br from-orange-400 via-orange-500 to-primary-600 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute top-20 left-20 w-32 h-32 border-2 border-white/20 rounded-full"
            />
            <motion.div
              animate={{ y: [0, -30, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/4 right-20 text-white/30"
            >
              <MathSymbol symbol="∫" size="3xl" />
            </motion.div>
            <motion.div
              animate={{ rotate: [0, -360] }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute bottom-20 left-1/3 text-white/20"
            >
              <MathSymbol symbol="π" size="3xl" />
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-white/10 rounded-full blur-xl"
            />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col items-center text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-green-100/20 backdrop-blur-sm border border-green-300/30"
              >
                {isProcessingRecurring ? (
                  <Loader2 className="h-16 w-16 text-yellow-300 animate-spin" />
                ) : (
                  <CheckCircle className="h-16 w-16 text-green-300" />
                )}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 text-white leading-tight"
                style={{
                  textShadow: "0 4px 20px rgba(0,0,0,0.3)",
                }}
              >
                {t.title}
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="w-32 h-2 bg-white rounded-full mb-10 shadow-lg"
              />

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-xl md:text-2xl lg:text-3xl max-w-4xl text-white/95 leading-relaxed font-medium"
                style={{
                  textShadow: "0 2px 10px rgba(0,0,0,0.2)",
                }}
              >
                {t.subtitle}
              </motion.p>

              {/* Processing Status for Recurring Lessons */}
              {isRecurring && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  className="mt-6 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20"
                >
                  {isProcessingRecurring ? (
                    <div className="flex items-center gap-2 text-yellow-200">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span className="font-medium">{t.processing}</span>
                    </div>
                  ) : recurringProcessed ? (
                    <div className="flex items-center gap-2 text-green-200">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">{t.recurringSuccess}</span>
                    </div>
                  ) : null}
                </motion.div>
              )}
            </div>
          </div>
        </section>

        {/* Success Details Section */}
        <section className="py-20 md:py-32 bg-gradient-to-br from-gray-50 via-white to-orange-50">
          <div className="container mx-auto px-4">
            <Card className="max-w-2xl mx-auto shadow-2xl border-none bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <p className="text-lg text-gray-700 mb-8 text-center">
                  {t.description}
                </p>

                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    {t.nextSteps}
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-semibold text-sm">
                          1
                        </span>
                      </div>
                      <p className="text-gray-700">{t.step1}</p>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-semibold text-sm">
                          2
                        </span>
                      </div>
                      <p className="text-gray-700">{t.step2}</p>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-semibold text-sm">
                          3
                        </span>
                      </div>
                      <p className="text-gray-700">{t.step3}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-8 text-center">
                  <Button
                    onClick={() => navigate("/")}
                    className="bg-gradient-to-r from-primary-600 to-orange-500 hover:from-primary-700 hover:to-orange-600 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {t.returnHome}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BookingSuccessPage;
