import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/lib/auth";
import { t } from "@/lib/i18n";
import { motion } from "framer-motion";
import {
  Star,
  Award,
  Users,
  TrendingUp,
  BookOpen,
  Calculator,
  Sparkles,
  Zap,
} from "lucide-react";
import MathSymbol from "./MathSymbol";

const HeroSection: React.FC = () => {
  const { language, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleBookLessonClick = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: "/booking" } } });
    } else {
      navigate("/booking");
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Enhanced Mathematical symbols
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
      "∈",
      "∉",
      "∪",
      "∩",
      "⊂",
      "⊃",
      "∀",
      "∃",
      "∴",
      "∵",
      "∠",
      "°",
      "→",
      "←",
      "↑",
      "↓",
    ];

    const equations = [
      "E=mc²",
      "a²+b²=c²",
      "∫f(x)dx",
      "lim x→∞",
      "sin²θ+cos²θ=1",
      "f'(x)",
      "∂f/∂x",
      "Σf(x)",
      "log₂x",
      "√(x²+y²)",
      "e^(iπ)+1=0",
      "∇²f=0",
      "F=ma",
      "PV=nRT",
      "λ=h/p",
      "ΔE=hν",
    ];

    class EnhancedParticle {
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
      trail: Array<{ x: number; y: number; opacity: number }>;
      glowIntensity: number;
      type: "symbol" | "equation";

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 1.2;
        this.vy = (Math.random() - 0.5) * 1.2;
        this.type = Math.random() > 0.7 ? "equation" : "symbol";
        this.symbol =
          this.type === "equation"
            ? equations[Math.floor(Math.random() * equations.length)]
            : mathSymbols[Math.floor(Math.random() * mathSymbols.length)];
        this.opacity = Math.random() * 0.6 + 0.2;
        this.size =
          this.type === "equation"
            ? Math.random() * 15 + 12
            : Math.random() * 25 + 20;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.03;
        this.color = this.getRandomColor();
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.trail = [];
        this.glowIntensity = Math.random() * 0.5 + 0.3;
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
        // Add current position to trail
        this.trail.push({ x: this.x, y: this.y, opacity: this.opacity * 0.5 });
        if (this.trail.length > 8) {
          this.trail.shift();
        }

        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;
        this.pulsePhase += 0.03;

        // Boundary wrapping with smooth transition
        if (this.x < -100) this.x = canvas.width + 100;
        if (this.x > canvas.width + 100) this.x = -100;
        if (this.y < -100) this.y = canvas.height + 100;
        if (this.y > canvas.height + 100) this.y = -100;

        // Update trail opacity
        this.trail.forEach((point) => {
          point.opacity *= 0.95;
        });
      }

      draw() {
        ctx.save();

        // Draw trail with glow effect
        this.trail.forEach((point, index) => {
          if (point.opacity > 0.01) {
            const trailSize =
              this.size * (0.3 + (index / this.trail.length) * 0.7);

            // Glow effect for trail
            ctx.shadowColor = this.color;
            ctx.shadowBlur = 15;
            ctx.globalAlpha = point.opacity * 0.3;

            ctx.font = `${trailSize}px 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif`;
            ctx.fillStyle = this.color;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            ctx.translate(point.x, point.y);
            ctx.fillText(this.symbol, 0, 0);
            ctx.translate(-point.x, -point.y);
          }
        });

        // Main particle with enhanced glow
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        const pulseSize = this.size + Math.sin(this.pulsePhase) * 4;
        const pulseOpacity =
          this.opacity + Math.sin(this.pulsePhase * 1.5) * 0.2;

        // Multiple glow layers for enhanced effect
        for (let i = 0; i < 3; i++) {
          ctx.shadowColor = this.color;
          ctx.shadowBlur = 25 + i * 10;
          ctx.globalAlpha = (pulseOpacity * this.glowIntensity) / (i + 1);

          ctx.font = `${
            pulseSize + i * 2
          }px 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif`;
          ctx.fillStyle = this.color;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          ctx.fillText(this.symbol, 0, 0);
        }

        // Core symbol with sharp definition
        ctx.shadowBlur = 0;
        ctx.globalAlpha = pulseOpacity;
        ctx.font = `${pulseSize}px 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif`;
        ctx.fillStyle = "#ffffff";
        ctx.fillText(this.symbol, 0, 0);

        ctx.restore();
      }
    }

    // Create enhanced particles
    const particles: EnhancedParticle[] = [];
    for (let i = 0; i < 60; i++) {
      particles.push(new EnhancedParticle());
    }

    // Animation loop with performance optimization
    let animationId: number;
    let lastTime = 0;

    const animate = (currentTime: number) => {
      if (currentTime - lastTime >= 16) {
        // ~60fps
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw gradient background overlay
        const gradient = ctx.createRadialGradient(
          canvas.width / 2,
          canvas.height / 2,
          0,
          canvas.width / 2,
          canvas.height / 2,
          Math.max(canvas.width, canvas.height) / 2
        );
        gradient.addColorStop(0, "rgba(255, 137, 51, 0.03)");
        gradient.addColorStop(0.5, "rgba(255, 107, 26, 0.02)");
        gradient.addColorStop(1, "rgba(30, 41, 59, 0.01)");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particles.forEach((particle) => {
          particle.update();
          particle.draw();
        });

        lastTime = currentTime;
      }
      animationId = requestAnimationFrame(animate);
    };

    animate(0);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  const stats = [
    { icon: Star, value: "4.9/5", label: "Rating" },
    { icon: Users, value: "1000+", label: "Students" },
    { icon: Award, value: "98%", label: "Success Rate" },
    { icon: TrendingUp, value: "5+", label: "Years Experience" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Enhanced Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-70"
        style={{ mixBlendMode: "screen" }}
      />

      {/* Enhanced Gradient Overlays */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-yellow-500/10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/20 to-slate-900/40" />
        <div className="absolute inset-0 bg-gradient-to-tr from-orange-600/5 via-transparent to-amber-400/5" />
      </div>

      {/* Floating Mathematical Symbols */}
      <div className="absolute inset-0 pointer-events-none">
        <MathSymbol
          symbol="∫"
          className="absolute top-20 left-10 text-6xl text-orange-400/20 animate-bounce"
        />
        <MathSymbol
          symbol="π"
          className="absolute top-32 right-20 text-5xl text-orange-300/25 animate-pulse"
        />
        <MathSymbol
          symbol="∞"
          className="absolute bottom-40 left-20 text-7xl text-yellow-400/15 animate-bounce"
        />
        <MathSymbol
          symbol="Σ"
          className="absolute bottom-20 right-10 text-6xl text-orange-500/20 animate-pulse"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Enhanced Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-orange-500/20 to-yellow-500/20 backdrop-blur-sm border border-orange-400/30 mb-8"
          >
            <Sparkles className="w-5 h-5 text-orange-400" />
            <span className="text-orange-100 font-medium">
              Advanced Math Tutoring
            </span>
            <Zap className="w-5 h-5 text-yellow-400" />
          </motion.div>

          {/* Enhanced Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-orange-100 to-orange-200 bg-clip-text text-transparent leading-tight"
            style={{
              textShadow:
                "0 0 20px rgba(255, 137, 51, 0.3), 0 0 40px rgba(255, 137, 51, 0.2)",
              filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))",
            }}
          >
            {t("heroTitle", language)}
          </motion.h1>

          {/* Enhanced Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-xl md:text-2xl lg:text-3xl text-slate-200 mb-8 max-w-4xl mx-auto leading-relaxed"
            style={{
              textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
            }}
          >
            {t("heroSubtitle", language)}
          </motion.p>

          {/* Enhanced Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group relative p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 hover:border-orange-400/50 transition-all duration-300"
                style={{
                  boxShadow:
                    "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                }}
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <stat.icon className="w-8 h-8 text-orange-400 mx-auto mb-3 group-hover:text-orange-300 transition-colors" />
                  <div className="text-2xl font-bold text-white mb-1 group-hover:text-orange-100 transition-colors">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-300 group-hover:text-slate-200 transition-colors">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Enhanced CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBookLessonClick}
              className="group relative px-10 py-4 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
              style={{
                boxShadow:
                  "0 10px 25px rgba(255, 137, 51, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <BookOpen className="w-6 h-6" />
                {t("bookLesson", language)}
              </span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/services"
                className="group relative px-10 py-4 rounded-full bg-transparent border-2 border-orange-400 hover:border-orange-300 text-orange-100 hover:text-white text-lg font-semibold transition-all duration-300 backdrop-blur-sm"
                style={{
                  boxShadow: "0 8px 20px rgba(255, 137, 51, 0.2)",
                }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Calculator className="w-6 h-6" />
                  {t("learnMore", language)}
                </span>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500/20 to-orange-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Enhanced Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
    </section>
  );
};

export default HeroSection;
