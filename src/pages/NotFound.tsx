
import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useAuthStore } from "@/lib/auth";
import { t } from "@/lib/i18n";
import MathSymbol from "@/components/MathSymbol";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
      
      <main className="flex-grow flex items-center justify-center bg-tutor-light">
        <div className="text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-6 text-8xl text-tutor-primary flex justify-center">
              <span className="mr-4">4</span>
              <MathSymbol symbol="∅" size="3xl" animate />
              <span className="ml-4">4</span>
            </div>
            <h1 className="text-4xl font-bold mb-4 gradient-text">{t('error404', language)}</h1>
            <p className="text-xl text-gray-600 mb-8">
              {language === 'en'
                ? 'Oops! This page seems to have vanished from our equation.'
                : 'Ops! Esta página parece ter desaparecido da nossa equação.'}
            </p>
            <Link to="/" className="btn-primary">
              {language === 'en' ? 'Return to Home' : 'Retornar à Página Inicial'}
            </Link>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
