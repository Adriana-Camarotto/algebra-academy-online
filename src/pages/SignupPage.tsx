import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserRole } from "@/lib/auth";
import { t } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useAuthStore } from "@/lib/auth";
import AnimatedMathBackground from "@/components/AnimatedMathBackground";
import { RoleSelector } from "@/components/auth/RoleSelector";
import { SignupForm } from "@/components/auth/SignupForm";
import { ArrowLeft, Shield, Zap, Users, Sparkles, Star } from "lucide-react";
import MathSymbol from "@/components/MathSymbol";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";

const SignupPage: React.FC = () => {
  const { language } = useAuthStore();
  const { signUp, loading: authLoading } = useSupabaseAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
  };

  const handleSignup = async (
    email: string,
    password: string,
    name: string
  ) => {
    if (!selectedRole) return;

    setLoading(true);
    const { error } = await signUp(email, password, {
      name,
      role: selectedRole,
    });

    if (!error) {
      navigate("/dashboard");
    }

    setLoading(false);
  };

  // Enhanced canvas animation effect like the hero
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const mathSymbols = [
      "∫",
      "∂",
      "∑",
      "π",
      "∞",
      "α",
      "β",
      "γ",
      "δ",
      "λ",
      "μ",
      "σ",
      "φ",
      "ψ",
      "Ω",
      "√",
      "∆",
      "∇",
      "≈",
      "≡",
      "≤",
      "≥",
      "±",
      "×",
      "÷",
      "²",
      "³",
      "⁴",
      "⁵",
    ];

    class SignupParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      symbol: string;
      opacity: number;
      size: number;
      rotation: number;
      rotationSpeed: number;
      color: string;
      pulsePhase: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.symbol =
          mathSymbols[Math.floor(Math.random() * mathSymbols.length)];
        this.opacity = Math.random() * 0.3 + 0.1;
        this.size = Math.random() * 20 + 15;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        this.color = this.getRandomColor();
        this.pulsePhase = Math.random() * Math.PI * 2;
      }

      getRandomColor(): string {
        const colors = [
          "#ff8933",
          "#ff6b1a",
          "#ff9f40",
          "#ffb366",
          "#ffa64d",
          "#f26419",
          "#e55604",
          "#d84315",
          "#ff7043",
          "#ff5722",
          "#ffcc02",
          "#ffd54f",
          "#fff176",
          "#ffeb3b",
          "#ffc107",
        ];
        return colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;
        this.pulsePhase += 0.02;

        if (this.x < -50) this.x = canvas.width + 50;
        if (this.x > canvas.width + 50) this.x = -50;
        if (this.y < -50) this.y = canvas.height + 50;
        if (this.y > canvas.height + 50) this.y = -50;
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        const pulse = Math.sin(this.pulsePhase) * 0.3 + 0.7;
        const glowSize = this.size * pulse;

        ctx.shadowColor = this.color;
        ctx.shadowBlur = 15;
        ctx.globalAlpha = this.opacity * 0.6;

        ctx.fillStyle = this.color;
        ctx.font = `${glowSize}px 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.symbol, 0, 0);

        ctx.shadowBlur = 0;
        ctx.globalAlpha = this.opacity;
        ctx.font = `${
          this.size * pulse
        }px 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif`;
        ctx.fillStyle = "#ffffff";
        ctx.fillText(this.symbol, 0, 0);

        ctx.restore();
      }
    }

    const particles: SignupParticle[] = [];
    for (let i = 0; i < 35; i++) {
      particles.push(new SignupParticle());
    }

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.max(canvas.width, canvas.height) / 2
      );
      gradient.addColorStop(0, "rgba(255, 137, 51, 0.02)");
      gradient.addColorStop(0.5, "rgba(255, 107, 26, 0.015)");
      gradient.addColorStop(1, "rgba(30, 41, 59, 0.005)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex relative overflow-hidden">
      {/* Enhanced Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-60"
        style={{ mixBlendMode: "screen" }}
      />

      {/* Enhanced Gradient Overlays */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-yellow-500/10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/20 to-slate-900/40" />
        <div className="absolute inset-0 bg-gradient-to-tr from-orange-600/5 via-transparent to-amber-400/5" />
      </div>

      {/* Left Side - Enhanced Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10">
        {/* Floating Mathematical Symbols */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{
              rotate: [0, 360],
              y: [0, -20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { duration: 30, repeat: Infinity, ease: "linear" },
              y: { duration: 8, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 6, repeat: Infinity, ease: "easeInOut" },
            }}
            className="absolute top-20 left-16 text-orange-400/30"
            style={{ textShadow: "0 0 20px rgba(255, 137, 51, 0.4)" }}
          >
            <MathSymbol symbol="∫" size="3xl" />
          </motion.div>

          <motion.div
            animate={{
              rotate: [360, 0],
              x: [0, 15, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              rotate: { duration: 25, repeat: Infinity, ease: "linear" },
              x: { duration: 10, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            }}
            className="absolute top-32 right-16 text-yellow-400/25"
            style={{ textShadow: "0 0 15px rgba(255, 193, 7, 0.3)" }}
          >
            <MathSymbol symbol="π" size="2xl" />
          </motion.div>

          <motion.div
            animate={{
              scale: [0.8, 1.2, 0.8],
              rotate: [0, 180, 360],
              y: [0, -10, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-32 left-20 text-orange-300/20"
            style={{ textShadow: "0 0 10px rgba(255, 171, 64, 0.2)" }}
          >
            <MathSymbol symbol="∑" size="3xl" />
          </motion.div>

          <motion.div
            animate={{
              rotate: [0, -360],
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              rotate: { duration: 40, repeat: Infinity, ease: "linear" },
              scale: { duration: 12, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: 8, repeat: Infinity, ease: "easeInOut" },
            }}
            className="absolute bottom-20 right-24 text-yellow-500/25"
            style={{ textShadow: "0 0 12px rgba(255, 235, 59, 0.3)" }}
          >
            <MathSymbol symbol="∞" size="2xl" />
          </motion.div>
        </div>

        <div className="flex flex-col justify-center px-12 w-full">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            {/* Enhanced App Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center mb-8"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="text-orange-400 mr-4"
                style={{ textShadow: "0 0 20px rgba(255, 137, 51, 0.6)" }}
              >
                <MathSymbol symbol="∑" size="3xl" />
              </motion.div>
              <span
                className="text-4xl font-bold bg-gradient-to-r from-white via-orange-100 to-orange-200 bg-clip-text text-transparent"
                style={{ textShadow: "0 0 10px rgba(255, 137, 51, 0.3)" }}
              >
                {t("appName", language)}
              </span>
            </motion.div>

            {/* Enhanced Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl font-bold mb-6 leading-tight"
              style={{
                background:
                  "linear-gradient(135deg, #ffffff 0%, #ff8933 30%, #ffd54f 70%, #ffffff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textShadow:
                  "0 0 20px rgba(255, 137, 51, 0.3), 0 0 40px rgba(255, 137, 51, 0.2)",
                filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))",
              }}
            >
              {language === "en"
                ? "Join Our Mathematics Community"
                : "Junte-se à Nossa Comunidade de Matemática"}
            </motion.h1>

            {/* Enhanced Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-xl text-slate-200 mb-8 leading-relaxed"
              style={{ textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)" }}
            >
              {language === "en"
                ? "Start your journey to mathematical excellence today"
                : "Comece hoje a sua jornada para a excelência matemática"}
            </motion.p>
          </motion.div>

          {/* Enhanced Features List */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="space-y-6"
          >
            {[
              {
                icon: Shield,
                title:
                  language === "en" ? "Secure & Trusted" : "Seguro e Confiável",
                description:
                  language === "en"
                    ? "Your data is protected with industry-standard security"
                    : "Os seus dados estão protegidos com segurança padrão da indústria",
                delay: 0.1,
              },
              {
                icon: Zap,
                title:
                  language === "en" ? "Instant Access" : "Acesso Instantâneo",
                description:
                  language === "en"
                    ? "Get started immediately after registration"
                    : "Comece imediatamente após o registo",
                delay: 0.2,
              },
              {
                icon: Users,
                title:
                  language === "en"
                    ? "Join 500+ Students"
                    : "Junte-se a 500+ Estudantes",
                description:
                  language === "en"
                    ? "Part of a growing community of learners"
                    : "Parte de uma comunidade crescente de aprendizes",
                delay: 0.3,
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.7 + feature.delay }}
                whileHover={{ scale: 1.02, x: 10 }}
                className="group flex items-center space-x-4"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="bg-gradient-to-br from-orange-500/20 to-yellow-500/20 backdrop-blur-md border border-orange-400/30 rounded-full p-4 group-hover:shadow-lg transition-all duration-300"
                  style={{ boxShadow: "0 8px 25px rgba(255, 137, 51, 0.2)" }}
                >
                  <feature.icon className="h-6 w-6 text-orange-400 group-hover:text-orange-300 transition-colors" />
                </motion.div>
                <div>
                  <h3
                    className="font-semibold text-orange-200 group-hover:text-orange-100 transition-colors text-lg"
                    style={{ textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)" }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="text-slate-300 group-hover:text-slate-200 transition-colors"
                    style={{ textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)" }}
                  >
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right Side - Enhanced Signup Form */}
      <div className="flex-1 flex items-center justify-center px-8 py-12 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full max-w-md"
        >
          {/* Enhanced Glassmorphism Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-gradient-to-br from-slate-800/40 to-slate-900/60 backdrop-blur-2xl border border-slate-600/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
            style={{
              boxShadow: `
                0 25px 50px rgba(0, 0, 0, 0.5),
                0 0 50px rgba(255, 137, 51, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, 0.1)
              `,
            }}
          >
            {/* Inner Glow */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-500/5 via-transparent to-yellow-500/5 pointer-events-none" />

            {/* Animated Border Effect */}
            <motion.div
              animate={{
                background: [
                  "conic-gradient(from 0deg, rgba(255, 137, 51, 0.3), rgba(255, 213, 79, 0.3), rgba(255, 137, 51, 0.3))",
                  "conic-gradient(from 360deg, rgba(255, 137, 51, 0.3), rgba(255, 213, 79, 0.3), rgba(255, 137, 51, 0.3))",
                ],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-3xl p-[2px] opacity-50"
            >
              <div className="w-full h-full rounded-3xl bg-gradient-to-br from-slate-800/40 to-slate-900/60" />
            </motion.div>

            <div className="relative z-10">
              {/* Mobile App Title */}
              <div className="lg:hidden mb-8 text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  className="flex items-center justify-center mb-4"
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="text-orange-400 mr-3"
                    style={{ textShadow: "0 0 15px rgba(255, 137, 51, 0.5)" }}
                  >
                    <MathSymbol symbol="∑" size="2xl" />
                  </motion.div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-white via-orange-200 to-yellow-200 bg-clip-text text-transparent">
                    {t("appName", language)}
                  </span>
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-2xl font-bold text-white mb-2"
                  style={{ textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)" }}
                >
                  {language === "en" ? "Create Account" : "Criar Conta"}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-slate-300"
                  style={{ textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)" }}
                >
                  {language === "en"
                    ? "Join our mathematics community"
                    : "Junte-se à nossa comunidade de matemática"}
                </motion.p>
              </div>

              {/* Enhanced Form Title for Desktop */}
              <div className="hidden lg:block mb-8 text-center">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-3xl font-bold mb-3"
                  style={{
                    background:
                      "linear-gradient(135deg, #ffffff 0%, #ff8933 50%, #ffd54f 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    textShadow: "0 0 15px rgba(255, 137, 51, 0.3)",
                  }}
                >
                  {language === "en"
                    ? "Create Your Account"
                    : "Crie a Sua Conta"}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="text-slate-300 text-lg"
                  style={{ textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)" }}
                >
                  {language === "en"
                    ? "Start your mathematical journey"
                    : "Comece a sua jornada matemática"}
                </motion.p>
              </div>

              {/* Role Selector or Form */}
              <div className="space-y-6">
                {!selectedRole ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  >
                    <RoleSelector
                      onRoleSelect={handleRoleSelect}
                      language={language}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-6"
                  >
                    <motion.button
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedRole(null)}
                      className="flex items-center text-orange-400 hover:text-orange-300 mb-6 transition-colors group"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                      {language === "en"
                        ? "Back to role selection"
                        : "Voltar à selecção de papel"}
                    </motion.button>

                    <SignupForm
                      role={selectedRole}
                      onSubmit={handleSignup}
                      loading={loading || authLoading}
                      language={language}
                    />
                  </motion.div>
                )}
              </div>

              {/* Enhanced Footer */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="mt-8 text-center space-y-4"
              >
                <p
                  className="text-slate-300"
                  style={{ textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)" }}
                >
                  {language === "en"
                    ? "Already have an account?"
                    : "Já tem uma conta?"}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => navigate("/login")}
                    className="ml-2 text-orange-400 hover:text-orange-300 font-semibold transition-colors underline decoration-orange-400/50 hover:decoration-orange-300"
                    style={{ textShadow: "0 0 10px rgba(255, 137, 51, 0.3)" }}
                  >
                    {t("login", language)}
                  </motion.button>
                </p>

                <div className="flex items-center justify-center space-x-4 text-xs text-slate-400">
                  <motion.button
                    whileHover={{ scale: 1.05, color: "#ff8933" }}
                    onClick={() => navigate("/privacy")}
                    className="hover:text-orange-400 transition-colors"
                  >
                    {language === "en"
                      ? "Privacy Policy"
                      : "Política de Privacidade"}
                  </motion.button>
                  <span className="text-slate-600">•</span>
                  <motion.button
                    whileHover={{ scale: 1.05, color: "#ff8933" }}
                    onClick={() => navigate("/terms")}
                    className="hover:text-orange-400 transition-colors"
                  >
                    {language === "en"
                      ? "Terms of Service"
                      : "Termos de Serviço"}
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupPage;
