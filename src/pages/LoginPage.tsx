import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
import { LoginForm } from "@/components/auth/LoginForm";
import { ArrowLeft, Shield, Zap, Users, LogIn, Sparkles } from "lucide-react";
import MathSymbol from "@/components/MathSymbol";
import { motion } from "framer-motion";

// Login Particle class for canvas animation
class LoginParticle {
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
  pulse: number;
  pulseSpeed: number;

  constructor(canvas: HTMLCanvasElement) {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.8;
    this.vy = (Math.random() - 0.5) * 0.8;

    const symbols = [
      "∫",
      "∑",
      "√",
      "π",
      "∞",
      "∂",
      "α",
      "β",
      "γ",
      "δ",
      "θ",
      "λ",
      "μ",
      "σ",
      "φ",
      "ψ",
      "Ω",
    ];
    this.symbol = symbols[Math.floor(Math.random() * symbols.length)];

    this.opacity = Math.random() * 0.3 + 0.1;
    this.size = Math.random() * 20 + 15;
    this.rotation = Math.random() * 360;
    this.rotationSpeed = (Math.random() - 0.5) * 2;

    const colors = ["#ff8933", "#ffd54f", "#ffab40", "#ffc947"];
    this.color = colors[Math.floor(Math.random() * colors.length)];

    this.pulse = 0;
    this.pulseSpeed = Math.random() * 0.02 + 0.01;
  }

  update(canvas: HTMLCanvasElement) {
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.rotationSpeed;
    this.pulse += this.pulseSpeed;

    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

    this.x = Math.max(0, Math.min(canvas.width, this.x));
    this.y = Math.max(0, Math.min(canvas.height, this.y));
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);

    const pulseScale = 1 + Math.sin(this.pulse) * 0.1;
    ctx.scale(pulseScale, pulseScale);

    ctx.globalAlpha = this.opacity * (0.8 + Math.sin(this.pulse) * 0.2);
    ctx.fillStyle = this.color;
    ctx.font = `${this.size}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.shadowColor = this.color;
    ctx.shadowBlur = 8;
    ctx.fillText(this.symbol, 0, 0);

    ctx.restore();
  }
}

const LoginPageFixed: React.FC = () => {
  const { language, user, isAuthenticated } = useAuthStore();
  const { signIn, signOut, loading: authLoading } = useSupabaseAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Canvas animation setup
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

    // Create particles
    const particles: LoginParticle[] = [];
    for (let i = 0; i < 45; i++) {
      particles.push(new LoginParticle(canvas));
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.update(canvas);
        particle.draw(ctx);
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  // Get redirect path from location state or default to dashboard
  const from = location.state?.from?.pathname || "/dashboard";

  // Only redirect if coming from a protected route (not manual navigation to /login)
  useEffect(() => {
    if (isAuthenticated && user && location.state?.from) {
      console.log(
        "✅ Usuário já autenticado - redirecionando de rota protegida..."
      );

      let redirectUrl = "/dashboard";
      if (user.role === "admin") {
        redirectUrl = "/admin";
      } else if (user.role === "tutor") {
        redirectUrl = "/tutor";
      } else if (user.role === "student") {
        redirectUrl = "/student";
      }

      console.log(`🎯 Redirecionando usuário autenticado para: ${redirectUrl}`);
      navigate(redirectUrl, { replace: true });
    }
  }, [isAuthenticated, user, navigate, location.state]);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
  };

  const handleLogin = async (email: string, password: string) => {
    console.log("🔥 USANDO SISTEMA DE LOGIN CORRIGIDO");
    setLoading(true);

    try {
      const { error } = await signIn(email, password);

      if (!error) {
        console.log("✅ Login bem-sucedido - redirecionando...");

        // Não usar setTimeout - usar o estado do hook diretamente
        // O redirecionamento será feito pelo App.tsx baseado no estado de autenticação
        console.log(
          `🎯 Login realizado com sucesso, aguardando redirecionamento automático...`
        );
      }
    } catch (err) {
      console.error("❌ Erro inesperado no login:", err);
    } finally {
      setLoading(false);
    }
  };

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
              rotate: { duration: 25, repeat: Infinity, ease: "linear" },
              y: { duration: 7, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 5, repeat: Infinity, ease: "easeInOut" },
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
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              x: { duration: 8, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            }}
            className="absolute top-32 right-16 text-yellow-400/25"
            style={{ textShadow: "0 0 15px rgba(255, 193, 7, 0.3)" }}
          >
            <MathSymbol symbol="√" size="2xl" />
          </motion.div>

          <motion.div
            animate={{
              scale: [0.8, 1.2, 0.8],
              rotate: [0, 180, 360],
              y: [0, -10, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-32 left-20 text-orange-300/20"
            style={{ textShadow: "0 0 10px rgba(255, 171, 64, 0.2)" }}
          >
            <MathSymbol symbol="π" size="3xl" />
          </motion.div>

          <motion.div
            animate={{
              rotate: [0, -360],
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              rotate: { duration: 35, repeat: Infinity, ease: "linear" },
              scale: { duration: 10, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: 6, repeat: Infinity, ease: "easeInOut" },
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
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
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
                ? "Welcome Back to Excellence"
                : "Bem-vindo de Volta à Excelência"}
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
                ? "Continue your mathematical journey with us"
                : "Continue a sua jornada matemática connosco"}
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
                title: language === "en" ? "Secure Login" : "Login Seguro",
                description:
                  language === "en"
                    ? "Advanced security for your account protection"
                    : "Segurança avançada para protecção da sua conta",
                delay: 0.1,
              },
              {
                icon: Zap,
                title:
                  language === "en" ? "Instant Access" : "Acesso Instantâneo",
                description:
                  language === "en"
                    ? "Quick access to all your learning materials"
                    : "Acesso rápido a todos os seus materiais de estudo",
                delay: 0.2,
              },
              {
                icon: Users,
                title:
                  language === "en"
                    ? "Learning Community"
                    : "Comunidade de Aprendizagem",
                description:
                  language === "en"
                    ? "Connect with tutors and fellow students"
                    : "Conecte-se com tutores e outros estudantes",
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

      {/* Right Side - Enhanced Login Form */}
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
                      duration: 18,
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
                  {t("login", language)}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-slate-300"
                  style={{ textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)" }}
                >
                  {language === "en"
                    ? "Access your mathematics dashboard"
                    : "Aceda ao seu dashboard de matemática"}
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
                  {t("login", language)}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="text-slate-300 text-lg"
                  style={{ textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)" }}
                >
                  {selectedRole
                    ? `${t("loginAs", language)} ${t(selectedRole, language)}`
                    : t("selectRole", language)}
                </motion.p>
              </div>

              {/* User Already Authenticated Section */}
              {isAuthenticated && user ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="text-center space-y-6"
                >
                  <div className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 backdrop-blur-sm border border-emerald-400/30 rounded-xl p-6">
                    <div className="flex items-center justify-center mb-4">
                      <div className="bg-emerald-500/20 rounded-full p-3">
                        <LogIn className="h-6 w-6 text-emerald-400" />
                      </div>
                    </div>
                    <p className="text-emerald-200 font-medium text-lg mb-2">
                      {language === "en"
                        ? `You are already logged in as ${user.name}`
                        : `Você já está logado como ${user.name}`}
                    </p>
                    <p className="text-emerald-300/80">
                      {language === "en"
                        ? `Role: ${user.role}`
                        : `Papel: ${user.role}`}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <motion.button
                      whileHover={{
                        scale: 1.02,
                        boxShadow: "0 15px 35px rgba(255, 137, 51, 0.4)",
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        let redirectUrl = "/dashboard";
                        if (user.role === "admin") {
                          redirectUrl = "/admin";
                        } else if (user.role === "tutor") {
                          redirectUrl = "/tutor";
                        } else if (user.role === "student") {
                          redirectUrl = "/student";
                        }
                        navigate(redirectUrl);
                      }}
                      className="w-full py-4 px-6 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold rounded-xl transition-all duration-300 relative overflow-hidden"
                      style={{
                        boxShadow:
                          "0 10px 25px rgba(255, 137, 51, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                      }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.6 }}
                      />
                      <span className="relative z-10 flex items-center justify-center">
                        {language === "en"
                          ? "Go to Dashboard"
                          : "Ir para Dashboard"}
                        <LogIn className="ml-2 h-5 w-5" />
                      </span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={async () => {
                        console.log("🚪 Fazendo logout para novo login...");
                        await signOut();
                        setSelectedRole(null);
                      }}
                      className="w-full py-3 px-6 bg-slate-700/50 backdrop-blur-md border border-slate-600/50 rounded-xl text-slate-200 hover:text-white font-medium transition-all duration-300 hover:bg-slate-600/50"
                    >
                      {language === "en"
                        ? "Logout and Login as Different User"
                        : "Sair e Entrar como Outro Usuário"}
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                /* Normal login flow */
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
                        {language === "en" ? "Change Role" : "Mudar Papel"}
                      </motion.button>

                      <LoginForm
                        role={selectedRole}
                        onSubmit={handleLogin}
                        loading={loading || authLoading}
                        language={language}
                      />
                    </motion.div>
                  )}
                </div>
              )}

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
                    ? "Don't have an account?"
                    : "Não tem uma conta?"}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => navigate("/signup")}
                    className="ml-2 text-orange-400 hover:text-orange-300 font-semibold transition-colors underline decoration-orange-400/50 hover:decoration-orange-300"
                    style={{ textShadow: "0 0 10px rgba(255, 137, 51, 0.3)" }}
                  >
                    {t("signup", language)}
                  </motion.button>
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPageFixed;
