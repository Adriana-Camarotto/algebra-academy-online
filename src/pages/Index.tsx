import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/lib/auth";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { t } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import MathSymbol from "@/components/MathSymbol";
import RubiksCube3D from "@/components/RubiksCube3D";
import { Link } from "react-router-dom";

const Index: React.FC = () => {
  const { language, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleBookLessonClick = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: "/booking" } } });
    } else {
      navigate("/booking");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />

      <main className="flex-grow">
        <HeroSection />

        {/* Enhanced Divider with floating math symbols */}
        <div className="relative py-12 overflow-hidden bg-gradient-to-r from-slate-800/50 to-slate-900/30 backdrop-blur-sm">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-transparent to-yellow-500/5" />
            <motion.div
              animate={{ x: [-100, 100], rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute top-4 left-1/4 text-orange-400/60 drop-shadow-lg"
            >
              <MathSymbol symbol="π" size="xl" />
            </motion.div>
            <motion.div
              animate={{ x: [100, -100], rotate: [360, 0] }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute top-2 right-1/3 text-orange-300/50 drop-shadow-lg"
            >
              <MathSymbol symbol="∫" size="lg" />
            </motion.div>
            <motion.div
              animate={{ y: [0, -20, 0], opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-4 left-1/2 text-yellow-400/40 drop-shadow-md"
            >
              <MathSymbol symbol="∞" size="2xl" />
            </motion.div>
          </div>
        </div>

        {/* Spectacular My Services Section - Revolutionary Design */}
        <section className="py-24 md:py-32 relative overflow-hidden">
          {/* Dynamic gradient background with mesh effect */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-yellow-50" />
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-100/30 via-transparent to-yellow-100/20" />
            <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-orange-50/40 to-transparent" />

            {/* Animated mesh pattern */}
            <div className="absolute inset-0 opacity-20">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `
                  radial-gradient(circle at 25% 25%, #ff8933 0%, transparent 50%),
                  radial-gradient(circle at 75% 75%, #ffd54f 0%, transparent 50%),
                  radial-gradient(circle at 75% 25%, #ff6b35 0%, transparent 50%),
                  radial-gradient(circle at 25% 75%, #ffb347 0%, transparent 50%)
                `,
                  backgroundSize: "200px 200px",
                  animation: "mesh-move 20s ease-in-out infinite",
                }}
              />
            </div>
          </div>

          {/* Ultra-modern floating elements */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Spectacular gradient orbs with unique animations */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
                x: [0, 50, 0],
              }}
              transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-orange-400/30 to-yellow-400/20 rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                scale: [1.1, 0.9, 1.1],
                rotate: [360, 180, 0],
                y: [0, -30, 0],
              }}
              transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-tl from-yellow-400/25 to-orange-400/15 rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                scale: [0.8, 1.3, 0.8],
                opacity: [0.3, 0.6, 0.3],
                rotate: [0, 360],
              }}
              transition={{ duration: 35, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-orange-300/20 to-yellow-300/15 rounded-full blur-3xl"
            />

            {/* Revolutionary floating mathematical symbols */}
            <motion.div
              animate={{
                rotate: [0, 360],
                y: [0, -40, 0],
                scale: [1, 1.3, 1],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                y: { duration: 8, repeat: Infinity, ease: "easeInOut" },
                scale: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              }}
              className="absolute top-32 left-1/4 text-orange-500/60"
              style={{
                textShadow:
                  "0 0 30px rgba(255, 137, 51, 0.8), 0 0 60px rgba(255, 137, 51, 0.4)",
                filter: "drop-shadow(0 0 20px rgba(255, 137, 51, 0.6))",
              }}
            >
              <MathSymbol symbol="∫" size="4xl" />
            </motion.div>

            <motion.div
              animate={{
                rotate: [360, 0],
                x: [0, 35, 0],
                scale: [1, 1.4, 1],
                opacity: [0.5, 0.9, 0.5],
              }}
              transition={{
                rotate: { duration: 18, repeat: Infinity, ease: "linear" },
                x: { duration: 10, repeat: Infinity, ease: "easeInOut" },
                scale: { duration: 7, repeat: Infinity, ease: "easeInOut" },
                opacity: { duration: 5, repeat: Infinity, ease: "easeInOut" },
              }}
              className="absolute top-40 right-1/4 text-yellow-600/70"
              style={{
                textShadow:
                  "0 0 25px rgba(255, 193, 7, 0.9), 0 0 50px rgba(255, 193, 7, 0.5)",
                filter: "drop-shadow(0 0 15px rgba(255, 193, 7, 0.7))",
              }}
            >
              <MathSymbol symbol="∑" size="4xl" />
            </motion.div>

            <motion.div
              animate={{
                scale: [0.9, 1.5, 0.9],
                rotate: [0, 180, 360],
                y: [0, -25, 0],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute bottom-28 left-1/3 text-orange-400/50"
              style={{
                textShadow: "0 0 20px rgba(255, 171, 64, 0.8)",
                filter: "drop-shadow(0 0 10px rgba(255, 171, 64, 0.6))",
              }}
            >
              <MathSymbol symbol="π" size="3xl" />
            </motion.div>

            <motion.div
              animate={{
                rotate: [0, -360],
                scale: [1, 1.6, 1],
                opacity: [0.4, 0.8, 0.4],
                x: [0, 20, 0],
              }}
              transition={{
                rotate: { duration: 22, repeat: Infinity, ease: "linear" },
                scale: { duration: 9, repeat: Infinity, ease: "easeInOut" },
                opacity: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                x: { duration: 12, repeat: Infinity, ease: "easeInOut" },
              }}
              className="absolute bottom-40 right-1/3 text-yellow-500/60"
              style={{
                textShadow:
                  "0 0 35px rgba(255, 235, 59, 0.9), 0 0 70px rgba(255, 235, 59, 0.4)",
                filter: "drop-shadow(0 0 25px rgba(255, 235, 59, 0.7))",
              }}
            >
              <MathSymbol symbol="∞" size="4xl" />
            </motion.div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Revolutionary Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-center mb-20"
            >
              {/* Ultra-modern badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.8,
                  delay: 0.3,
                  type: "spring",
                  bounce: 0.4,
                }}
                className="relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-100/90 to-yellow-100/90 backdrop-blur-xl border-2 border-gradient-to-r from-orange-300/60 to-yellow-300/60 mb-12 shadow-2xl"
                style={{
                  boxShadow:
                    "0 20px 60px rgba(255, 137, 51, 0.3), inset 0 2px 0 rgba(255, 255, 255, 0.4)",
                  border: "2px solid transparent",
                  backgroundImage:
                    "linear-gradient(white, white), linear-gradient(135deg, rgba(255, 137, 51, 0.4), rgba(255, 193, 7, 0.4))",
                  backgroundOrigin: "border-box",
                  backgroundClip: "content-box, border-box",
                }}
              >
                <motion.div
                  animate={{
                    scale: [1, 1.4, 1],
                    rotate: [0, 180, 360],
                    boxShadow: [
                      "0 0 20px rgba(255, 137, 51, 0.6)",
                      "0 0 30px rgba(255, 137, 51, 0.8)",
                      "0 0 20px rgba(255, 137, 51, 0.6)",
                    ],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-4 h-4 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full shadow-lg"
                />
                <span
                  className="font-bold text-lg tracking-wide uppercase bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent"
                  style={{ textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}
                >
                  {language === "en"
                    ? "✨ Elite Services ✨"
                    : "✨ Serviços Premium ✨"}
                </span>
                <motion.div
                  animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="text-2xl"
                >
                  🎯
                </motion.div>
              </motion.div>

              {/* Epic Title with revolutionary styling */}
              <motion.h2
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.4 }}
                className="text-6xl md:text-7xl lg:text-8xl font-black mb-12 leading-[0.9] tracking-tight relative"
                style={{
                  background:
                    "linear-gradient(135deg, #1a1a1a 0%, #ff8933 25%, #ffd54f 50%, #ff6b35 75%, #1a1a1a 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  textShadow:
                    "0 0 60px rgba(255, 137, 51, 0.5), 0 0 120px rgba(255, 137, 51, 0.3)",
                  filter: "drop-shadow(0 5px 15px rgba(0, 0, 0, 0.3))",
                }}
              >
                {t("servicesTitle", language)}

                {/* Animated underline */}
                <motion.div
                  initial={{ scaleX: 0, opacity: 0 }}
                  whileInView={{ scaleX: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
                  className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-48 h-2 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 rounded-full"
                  style={{
                    boxShadow:
                      "0 0 30px rgba(255, 137, 51, 0.8), 0 0 60px rgba(255, 137, 51, 0.4)",
                  }}
                />
              </motion.h2>

              {/* Dynamic subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-xl md:text-2xl text-slate-700 font-medium max-w-3xl mx-auto leading-relaxed"
                style={{ textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}
              >
                {language === "en"
                  ? "Unlock your mathematical potential with personalized tutoring that transforms challenges into victories"
                  : "Desbloqueie seu potencial matemático com aulas personalizadas que transformam desafios em vitórias"}
              </motion.p>
            </motion.div>

            {/* Revolutionary Services Grid - Ultra-Premium Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
              {[
                {
                  icon: "🎓",
                  mathSymbol: "f(x)",
                  title:
                    language === "en"
                      ? "One-to-One Tutoring"
                      : "Aulas Individuais",
                  description:
                    language === "en"
                      ? "Personalised lessons tailored to your unique learning style and pace"
                      : "Aulas personalizadas adaptadas ao seu estilo e ritmo de aprendizagem únicos",
                  duration:
                    language === "en"
                      ? "60 minutes per session"
                      : "60 minutos por sessão",
                  features:
                    language === "en"
                      ? [
                          "Custom Learning Plan",
                          "Flexible Scheduling",
                          "Progress Tracking",
                          "Homework Support",
                        ]
                      : [
                          "Plano de Aprendizagem Personalizado",
                          "Horários Flexíveis",
                          "Acompanhamento do Progresso",
                          "Suporte com Deveres",
                        ],
                  colors: {
                    primary: "from-orange-500 to-orange-600",
                    secondary: "from-orange-400 to-orange-500",
                    glow: "rgba(255, 137, 51, 0.6)",
                    bg: "from-orange-50 to-orange-100",
                  },
                  delay: 0.2,
                },
                {
                  icon: "👥",
                  mathSymbol: "∑",
                  title:
                    language === "en" ? "Group Sessions" : "Sessões em Grupo",
                  description:
                    language === "en"
                      ? "Collaborative learning in small, focused groups for maximum engagement"
                      : "Aprendizagem colaborativa em pequenos grupos focados para máximo envolvimento",
                  duration:
                    language === "en"
                      ? "60 minutes per class, 6 classes total"
                      : "60 minutos por aula, 6 aulas no total",
                  features:
                    language === "en"
                      ? [
                          "Small Groups (3-5)",
                          "Interactive Learning",
                          "Peer Collaboration",
                          "Shared Resources",
                        ]
                      : [
                          "Grupos Pequenos (3-5)",
                          "Aprendizagem Interativa",
                          "Colaboração entre Pares",
                          "Recursos Compartilhados",
                        ],
                  colors: {
                    primary: "from-yellow-500 to-amber-500",
                    secondary: "from-yellow-400 to-amber-400",
                    glow: "rgba(255, 193, 7, 0.6)",
                    bg: "from-yellow-50 to-yellow-100",
                  },
                  delay: 0.4,
                },
                {
                  icon: "🎯",
                  mathSymbol: "∫",
                  title:
                    language === "en"
                      ? "GCSE & A-Level Preparation"
                      : "Preparação GCSE & A-Level",
                  description:
                    language === "en"
                      ? "Strategic preparation for GCSE, A-Level, and university entrance examinations"
                      : "Preparação estratégica para exames GCSE, A-Level e entrada universitária",
                  duration:
                    language === "en"
                      ? "60 minutes per session"
                      : "60 minutos por sessão",
                  features:
                    language === "en"
                      ? [
                          "Exam Strategies",
                          "Practice Tests",
                          "Time Management",
                          "Confidence Building",
                        ]
                      : [
                          "Estratégias de Exame",
                          "Testes Práticos",
                          "Gestão de Tempo",
                          "Construção de Confiança",
                        ],
                  colors: {
                    primary: "from-orange-600 to-yellow-500",
                    secondary: "from-orange-500 to-yellow-400",
                    glow: "rgba(255, 152, 0, 0.6)",
                    bg: "from-orange-50 to-yellow-50",
                  },
                  delay: 0.6,
                },
              ].map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 100, rotateX: -15 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 1,
                    delay: service.delay,
                    type: "spring",
                    bounce: 0.4,
                  }}
                  whileHover={{
                    y: -20,
                    scale: 1.05,
                    rotateX: 5,
                    transition: { duration: 0.4, ease: "easeOut" },
                  }}
                  className="group relative perspective-1000"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Revolutionary Card Design */}
                  <div
                    className={`relative h-full p-8 rounded-3xl bg-gradient-to-br ${service.colors.bg} backdrop-blur-xl border-2 border-white/60 shadow-2xl group-hover:shadow-4xl transition-all duration-700 transform-gpu`}
                    style={{
                      boxShadow: `
                        0 25px 80px rgba(0, 0, 0, 0.1),
                        0 0 0 1px rgba(255, 255, 255, 0.2),
                        inset 0 2px 0 rgba(255, 255, 255, 0.4),
                        0 0 60px ${service.colors.glow.replace("0.6", "0.2")}
                      `,
                    }}
                  >
                    {/* Dynamic glow effect */}
                    <div
                      className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${service.colors.primary} opacity-0 group-hover:opacity-20 transition-opacity duration-700 blur-2xl`}
                    />

                    {/* Floating mathematical symbol */}
                    <motion.div
                      animate={{
                        rotate: [0, 360],
                        scale: [1, 1.2, 1],
                        opacity: [0.7, 1, 0.7],
                      }}
                      transition={{
                        rotate: {
                          duration: 20,
                          repeat: Infinity,
                          ease: "linear",
                        },
                        scale: {
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut",
                        },
                        opacity: {
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        },
                      }}
                      className="absolute -top-6 -right-6 w-16 h-16 rounded-2xl bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-lg border-2 border-white/40 flex items-center justify-center shadow-xl"
                      style={{
                        boxShadow: `0 10px 30px ${service.colors.glow}, inset 0 1px 0 rgba(255, 255, 255, 0.3)`,
                      }}
                    >
                      <span
                        className="font-bold text-xl bg-gradient-to-r from-slate-700 to-slate-800 bg-clip-text text-transparent"
                        style={{
                          textShadow: `0 0 20px ${service.colors.glow}`,
                        }}
                      >
                        {service.mathSymbol}
                      </span>
                    </motion.div>

                    {/* Ultra-modern icon */}
                    <motion.div
                      whileHover={{ scale: 1.3, rotate: 10 }}
                      className="text-7xl mb-8 transform transition-transform duration-500 group-hover:drop-shadow-2xl"
                      style={{
                        filter: `drop-shadow(0 0 30px ${service.colors.glow})`,
                      }}
                    >
                      {service.icon}
                    </motion.div>

                    {/* Premium title */}
                    <h3
                      className="text-3xl font-black mb-6 leading-tight"
                      style={{
                        background: `linear-gradient(135deg, #1f2937 0%, ${
                          service.colors.primary.split(" ")[1]
                        } 100%)`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        textShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      {service.title}
                    </h3>

                    {/* Enhanced description */}
                    <p className="text-slate-700 text-lg mb-8 leading-relaxed font-medium">
                      {service.description}
                    </p>

                    {/* Ultra-modern duration badge */}
                    <div
                      className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r ${service.colors.bg} backdrop-blur-md border-2 border-white/60 mb-8 shadow-lg`}
                      style={{
                        boxShadow: `0 8px 25px ${service.colors.glow.replace(
                          "0.6",
                          "0.2"
                        )}, inset 0 1px 0 rgba(255, 255, 255, 0.3)`,
                      }}
                    >
                      <motion.div
                        animate={{
                          scale: [1, 1.4, 1],
                          boxShadow: [
                            `0 0 10px ${service.colors.glow}`,
                            `0 0 20px ${service.colors.glow}`,
                            `0 0 10px ${service.colors.glow}`,
                          ],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className={`w-3 h-3 bg-gradient-to-r ${service.colors.primary} rounded-full shadow-lg`}
                      />
                      <span className="text-slate-700 font-bold text-sm tracking-wide">
                        {service.duration}
                      </span>
                    </div>

                    {/* Revolutionary features list */}
                    <div className="space-y-4 mb-10">
                      {service.features.map((feature, featureIndex) => (
                        <motion.div
                          key={featureIndex}
                          initial={{ opacity: 0, x: -30 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 0.6,
                            delay: service.delay + featureIndex * 0.15,
                            type: "spring",
                            bounce: 0.4,
                          }}
                          className="flex items-center gap-4"
                        >
                          <motion.div
                            animate={{
                              rotate: [0, 360],
                              scale: [1, 1.1, 1],
                            }}
                            transition={{
                              rotate: {
                                duration: 10,
                                repeat: Infinity,
                                ease: "linear",
                              },
                              scale: {
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                              },
                            }}
                            className={`w-8 h-8 rounded-xl bg-gradient-to-r ${service.colors.primary} flex items-center justify-center shadow-lg`}
                            style={{
                              boxShadow: `0 4px 15px ${service.colors.glow.replace(
                                "0.6",
                                "0.4"
                              )}, inset 0 1px 0 rgba(255, 255, 255, 0.2)`,
                            }}
                          >
                            <span className="text-white text-sm font-black">
                              ✓
                            </span>
                          </motion.div>
                          <span className="text-slate-700 font-semibold text-base leading-relaxed">
                            {feature}
                          </span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Ultra-premium action button */}
                    <motion.button
                      whileHover={{
                        scale: 1.08,
                        y: -4,
                        boxShadow: `0 20px 40px ${service.colors.glow}, inset 0 2px 0 rgba(255, 255, 255, 0.3)`,
                      }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleBookLessonClick}
                      className={`group/btn relative w-full px-8 py-4 rounded-2xl bg-gradient-to-r ${service.colors.primary} hover:bg-gradient-to-r hover:${service.colors.secondary} transition-all duration-500 font-bold text-white text-lg shadow-2xl`}
                      style={{
                        boxShadow: `0 15px 35px ${service.colors.glow}, inset 0 2px 0 rgba(255, 255, 255, 0.2)`,
                      }}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        <span>
                          {language === "en" ? "Book Now" : "Reservar Agora"}
                        </span>
                        <motion.span
                          animate={{ x: [0, 8, 0] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className="text-xl"
                        >
                          →
                        </motion.span>
                      </span>
                      <div
                        className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${service.colors.secondary} opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500`}
                      />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced About Section with cinematic styling */}
        <section className="py-20 md:py-28 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
          {/* Enhanced decorative background elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-20 w-32 h-32 bg-orange-500/10 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-48 h-48 bg-orange-400/10 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl animate-pulse"></div>

            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-transparent to-yellow-500/5" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/20 to-slate-900/40" />

            {/* Floating math symbols in background */}
            <motion.div
              animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute top-40 right-32 text-orange-400/10"
            >
              <MathSymbol symbol="∂" size="3xl" />
            </motion.div>
            <motion.div
              animate={{ y: [0, -30, 0], rotate: [0, 180, 360] }}
              transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-32 left-32 text-yellow-400/10"
            >
              <MathSymbol symbol="√" size="3xl" />
            </motion.div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left Column - Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="space-y-8"
              >
                {/* Section badge with glassmorphism */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 backdrop-blur-sm border border-orange-400/30 px-6 py-3 rounded-full mb-8"
                >
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                  <span className="text-orange-200 font-semibold text-sm tracking-wide uppercase">
                    {language === "en" ? "About the Tutor" : "Sobre o Tutor"}
                  </span>
                </motion.div>

                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8">
                  <span className="bg-gradient-to-r from-white via-orange-100 to-orange-200 bg-clip-text text-transparent">
                    {t("aboutTitle", language)}
                  </span>
                </h2>

                <div className="space-y-6">
                  <p
                    className="text-xl text-slate-200 leading-relaxed"
                    style={{ textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)" }}
                  >
                    {t("aboutDesc", language)}
                  </p>
                  <p
                    className="text-lg text-slate-300 leading-relaxed"
                    style={{ textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)" }}
                  >
                    {language === "en"
                      ? "With expertise in calculus, algebra, statistics, and more, I help students build confidence and develop problem-solving skills that extend beyond mathematics."
                      : "Com experiência em cálculo, álgebra, estatística e muito mais, ajudo os alunos a desenvolver confiança e habilidades de resolução de problemas que vão além da matemática."}
                  </p>
                </div>

                {/* Enhanced CTA buttons with glassmorphism */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <Link to="/about">
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="group relative overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      style={{
                        boxShadow:
                          "0 10px 25px rgba(255, 137, 51, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                      }}
                    >
                      <span className="relative z-10 font-semibold">
                        {language === "en"
                          ? "Learn More About Me"
                          : "Saiba Mais Sobre Mim"}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                    </motion.button>
                  </Link>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative border-2 border-orange-400 hover:border-orange-300 text-orange-200 hover:text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 backdrop-blur-sm"
                    style={{
                      boxShadow: "0 8px 20px rgba(255, 137, 51, 0.2)",
                    }}
                  >
                    <span className="relative z-10">
                      {language === "en"
                        ? "View Credentials"
                        : "Ver Credenciais"}
                    </span>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/20 to-orange-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.button>
                </motion.div>

                {/* Achievement stats with glassmorphism */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="grid grid-cols-3 gap-6 pt-8"
                >
                  {[
                    {
                      number: "5+",
                      label:
                        language === "en"
                          ? "Years Experience"
                          : "Anos de Experiência",
                    },
                    {
                      number: "300+",
                      label:
                        language === "en"
                          ? "Students Taught"
                          : "Alunos Ensinados",
                    },
                    {
                      number: "95%",
                      label:
                        language === "en" ? "Success Rate" : "Taxa de Sucesso",
                    },
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="group relative p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 hover:border-orange-400/50 transition-all duration-300 text-center"
                      style={{
                        boxShadow:
                          "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                      }}
                    >
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative">
                        <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-orange-100 to-orange-200 bg-clip-text text-transparent mb-1">
                          {stat.number}
                        </div>
                        <div className="text-sm text-slate-300 group-hover:text-slate-200 font-medium transition-colors">
                          {stat.label}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Right Column - Enhanced 3D Visual with dark theme */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative"
              >
                {/* Main cube container with enhanced dark styling */}
                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  <div className="relative bg-gradient-to-br from-slate-800/80 via-slate-700/60 to-slate-800/80 rounded-2xl p-12 shadow-2xl border border-orange-400/20 backdrop-blur-sm">
                    <RubiksCube3D />

                    {/* Decorative glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-orange-500/10 to-yellow-500/10 rounded-2xl pointer-events-none"></div>
                  </div>
                </div>

                {/* Floating animated math symbols with enhanced dark theme positioning */}
                <motion.div
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                    scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                  }}
                  className="absolute -top-8 -left-8 text-orange-400/80 drop-shadow-lg"
                  style={{ textShadow: "0 0 20px rgba(255, 137, 51, 0.6)" }}
                >
                  <MathSymbol symbol="∞" size="3xl" className="!text-6xl" />
                </motion.div>

                <motion.div
                  animate={{
                    y: [0, -20, 0],
                    rotate: [0, 15, -15, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -bottom-6 -right-6 text-yellow-500/80 drop-shadow-lg"
                  style={{ textShadow: "0 0 20px rgba(255, 193, 7, 0.6)" }}
                >
                  <MathSymbol symbol="∑" size="3xl" className="!text-5xl" />
                </motion.div>

                <motion.div
                  animate={{
                    x: [0, 10, -10, 0],
                    rotate: [0, -360],
                  }}
                  transition={{
                    x: { duration: 8, repeat: Infinity, ease: "easeInOut" },
                    rotate: { duration: 25, repeat: Infinity, ease: "linear" },
                  }}
                  className="absolute top-1/4 -right-12 text-orange-300/60 drop-shadow-md"
                  style={{ textShadow: "0 0 15px rgba(255, 171, 64, 0.4)" }}
                >
                  <MathSymbol symbol="π" size="2xl" className="!text-4xl" />
                </motion.div>

                <motion.div
                  animate={{
                    rotate: [0, -180, -360],
                    scale: [0.8, 1.2, 0.8],
                  }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute bottom-1/3 -left-10 text-orange-400/50 drop-shadow-sm"
                  style={{ textShadow: "0 0 10px rgba(255, 137, 51, 0.3)" }}
                >
                  <MathSymbol symbol="√" size="xl" className="!text-3xl" />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        <TestimonialsSection />

        {/* Enhanced CTA Section with cinematic dark styling */}
        <section className="py-20 bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-500 text-white relative overflow-hidden">
          {/* Enhanced animated background patterns */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/4 left-1/4 w-64 h-64 border border-white/10 rounded-full"
            ></motion.div>
            <motion.div
              animate={{ rotate: [360, 0] }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute bottom-1/4 right-1/4 w-48 h-48 border border-white/5 rounded-full"
            ></motion.div>

            {/* Enhanced floating math symbols in background */}
            <motion.div
              animate={{ y: [0, -30, 0], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-20 left-20 text-white/15"
              style={{ textShadow: "0 0 20px rgba(255, 255, 255, 0.3)" }}
            >
              <MathSymbol symbol="∫" size="3xl" />
            </motion.div>
            <motion.div
              animate={{ y: [0, 20, 0], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-20 right-20 text-white/15"
              style={{ textShadow: "0 0 20px rgba(255, 255, 255, 0.3)" }}
            >
              <MathSymbol symbol="∑" size="3xl" />
            </motion.div>
            <motion.div
              animate={{ x: [0, 30, 0], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 right-1/4 text-white/10"
              style={{ textShadow: "0 0 15px rgba(255, 255, 255, 0.2)" }}
            >
              <MathSymbol symbol="π" size="2xl" />
            </motion.div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              {/* Enhanced section badge with glow */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/30 rounded-full px-6 py-3 mb-8"
                style={{ boxShadow: "0 8px 32px rgba(255, 255, 255, 0.1)" }}
              >
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-white/90 font-semibold tracking-wide">
                  {language === "en"
                    ? "Ready to Start?"
                    : "Pronto para Começar?"}
                </span>
              </motion.div>

              <h2
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight"
                style={{
                  textShadow:
                    "0 0 20px rgba(255, 255, 255, 0.3), 0 0 40px rgba(255, 255, 255, 0.2)",
                  filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))",
                }}
              >
                {language === "en"
                  ? "Ready to Elevate Your Math Skills?"
                  : "Pronto para Elevar Suas Habilidades Matemáticas?"}
              </h2>

              <p
                className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed"
                style={{ textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)" }}
              >
                {language === "en"
                  ? "Book your first session today and experience the difference personalized tutoring can make."
                  : "Agende sua primeira sessão hoje e experimente a diferença que a tutoria personalizada pode fazer."}
              </p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBookLessonClick}
                  className="group relative overflow-hidden bg-white text-orange-600 hover:text-orange-700 text-xl px-12 py-4 rounded-xl font-bold shadow-2xl hover:shadow-white/20 transition-all duration-300"
                  style={{
                    boxShadow:
                      "0 10px 25px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.9)",
                  }}
                >
                  <span className="relative z-10 flex items-center gap-3">
                    <span className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></span>
                    {t("bookLesson", language)}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-100 to-yellow-100 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-xl"></div>
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
