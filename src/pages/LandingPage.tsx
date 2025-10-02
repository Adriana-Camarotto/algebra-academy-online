import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RubiksCube3D from "@/components/RubiksCube3D";
import { useAuthStore } from "@/lib/auth";
import { t } from "@/lib/i18n";

const LandingPage: React.FC = () => {
  const { language } = useAuthStore();
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 via-white to-green-50">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center py-24 md:py-32">
        <h1 className="text-5xl md:text-7xl font-black text-[#1a202c] text-center drop-shadow-lg mb-6">
          {t("heroTitle", language)}
        </h1>
        <p className="mt-4 text-lg md:text-2xl text-[#1a202c]/80 text-center max-w-2xl mx-auto mb-10">
          {t("heroSubtitle", language)}
        </p>

        {/* Cubo Mágico 3D */}
        <div className="mb-12">
          <RubiksCube3D />
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
          <Link to="/booking">
            <Button
              size="lg"
              className="bg-[#ff8933] hover:bg-[#1a202c] text-white text-lg px-10 py-4 rounded-2xl shadow-xl font-bold transition-all duration-300"
            >
              {t("bookLesson", language)}
            </Button>
          </Link>
          <Link to="/about">
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-10 py-4 border-[#ff8933] text-[#ff8933] hover:bg-[#ff8933] hover:text-white rounded-2xl font-bold transition-all duration-300"
            >
              {t("learnMore", language)}
            </Button>
          </Link>
          <Link to="/contact">
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-10 py-4 border-[#1a202c] text-[#1a202c] hover:bg-[#1a202c] hover:text-white rounded-2xl font-bold transition-all duration-300"
            >
              {t("contact", language)}
            </Button>
          </Link>
        </div>
        <div className="bg-white/80 rounded-2xl shadow-lg p-8 max-w-xl w-full text-center">
          <h2 className="text-2xl font-bold mb-2 text-tutor-primary">
            {language === "en"
              ? "Secure your spot at launch!"
              : "Garanta sua vaga no lançamento!"}
          </h2>
          <p className="mb-4 text-gray-700">
            {language === "en"
              ? "Sign up to receive news and exclusive offers for new students."
              : "Cadastre-se para receber novidades e ofertas exclusivas para novos alunos."}
          </p>
          <form className="flex flex-col sm:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder={
                language === "en" ? "Your best email" : "Seu melhor email"
              }
              className="border border-gray-300 rounded-lg px-4 py-2 flex-1"
              required
            />
            <Button className="bg-tutor-primary text-white font-bold px-6 py-2 rounded-lg">
              {language === "en" ? "I want to receive" : "Quero Receber"}
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
