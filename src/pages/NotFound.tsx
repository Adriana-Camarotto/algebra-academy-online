import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useAuthStore } from "@/lib/auth";
import { t } from "@/lib/i18n";
import MathSymbol from "@/components/MathSymbol";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Star } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const { language } = useAuthStore();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Enhanced Hero Section */}
        <section className="relative py-20 md:py-32 bg-gradient-to-br from-orange-400 via-orange-500 to-primary-600 overflow-hidden min-h-screen flex items-center justify-center">
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="mb-6 text-8xl text-white flex justify-center items-center">
                  <span className="mr-4">4</span>
                  <MathSymbol symbol="∅" size="3xl" animate />
                  <span className="ml-4">4</span>
                </div>

                <motion.h1
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 text-white leading-tight"
                  style={{
                    textShadow: "0 4px 20px rgba(0,0,0,0.3)",
                  }}
                >
                  {t("error404", language)}
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
                  className="text-xl md:text-2xl lg:text-3xl max-w-4xl text-white/95 leading-relaxed font-medium mb-10"
                  style={{
                    textShadow: "0 2px 10px rgba(0,0,0,0.2)",
                  }}
                >
                  {language === "en"
                    ? "Oops! This page seems to have vanished from our equation."
                    : "Ops! Esta página parece ter desaparecido da nossa equação."}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                >
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Star className="w-5 h-5" />
                    {language === "en"
                      ? "Return to Home"
                      : "Retornar à Página Inicial"}
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
