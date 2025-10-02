import React from "react";
import { useAuthStore } from "@/lib/auth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingWizard from "@/components/BookingWizard";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Star } from "lucide-react";
import { t } from "@/lib/i18n";
import MathSymbol from "@/components/MathSymbol";

const BookingPage: React.FC = () => {
  const { language } = useAuthStore();

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
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-6 py-3 mb-8"
              >
                <Star className="w-5 h-5 text-yellow-300" fill="currentColor" />
                <span className="text-white font-semibold text-sm tracking-wide">
                  {language === "en"
                    ? "Reserve Your Learning Experience"
                    : "Reserve Sua Experiência de Aprendizado"}
                </span>
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
                {language === "en" ? "Book a Lesson" : "Agendar uma Aula"}
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
                {language === "en"
                  ? "Choose your preferred learning option and take the first step towards mathematical excellence."
                  : "Escolha sua opção de aprendizagem preferida e dê o primeiro passo em direção à excelência matemática."}
              </motion.p>
            </div>
          </div>
        </section>

        {/* Booking Section */}
        <section className="py-20 md:py-32 bg-gradient-to-br from-gray-50 via-white to-orange-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-4xl mx-auto"
            >
              <BookingWizard />
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BookingPage;
