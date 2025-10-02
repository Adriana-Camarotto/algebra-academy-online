import React from "react";
import { useAuthStore } from "@/lib/auth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { t } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import {
  Info,
  BookOpen,
  Medal,
  GraduationCap,
  Star,
  Award,
  Users,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import MathSymbol from "@/components/MathSymbol";

const AboutPage: React.FC = () => {
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
                    ? "Passionate Mathematics Educator"
                    : "Educadora Apaixonada por Matemática"}
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
                {language === "en" ? "About Me" : "Sobre Mim"}
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
                  ? "Dedicated to helping students achieve excellence in mathematics through personalized, innovative tutoring approaches."
                  : "Dedicada a ajudar os alunos a alcançar a excelência em matemática através de abordagens de tutoria personalizadas e inovadoras."}
              </motion.p>
            </div>
          </div>
        </section>

        {/* Enhanced Profile Section */}
        <section className="py-20 md:py-32 bg-gradient-to-br from-gray-50 via-white to-orange-50 relative overflow-hidden">
          {/* Decorative Background */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200/30 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-200/20 rounded-full blur-3xl" />
            <motion.div
              animate={{ x: [0, 100, 0], rotate: [0, 180, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/3 left-1/4 text-orange-300/20"
            >
              <MathSymbol symbol="√" size="2xl" />
            </motion.div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Image Column with Enhanced Styling */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative group"
              >
                <div className="absolute -inset-4 bg-gradient-to-r from-primary-400 to-orange-400 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
                <div className="relative bg-white p-8 rounded-3xl shadow-2xl border border-orange-100">
                  <img
                    src="/assets/images/tutor-profile.png"
                    alt="Math Tutor Portrait"
                    className="rounded-2xl w-full max-w-md mx-auto shadow-lg"
                  />

                  {/* Floating Elements */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute -top-6 -right-6 bg-gradient-to-r from-primary-500 to-orange-500 text-white p-4 rounded-2xl shadow-xl"
                  >
                    <GraduationCap className="w-8 h-8" />
                  </motion.div>

                  <motion.div
                    animate={{ x: [0, 10, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute -bottom-6 -left-6 bg-white border-4 border-orange-300 text-primary-600 p-3 rounded-full shadow-lg"
                  >
                    <BookOpen className="w-6 h-6" />
                  </motion.div>
                </div>
              </motion.div>

              {/* Content Column */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                {/* Section Header */}
                <div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-100 to-orange-100 px-4 py-2 rounded-full mb-6"
                  >
                    <Info className="w-4 h-4 text-primary-600" />
                    <span className="text-primary-700 font-semibold text-sm tracking-wide uppercase">
                      {language === "en" ? "Get to Know Me" : "Conheça-me"}
                    </span>
                  </motion.div>

                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
                    {language === "en" ? "Who I Am" : "Quem Eu Sou"}
                  </h2>
                </div>

                {/* Description */}
                <div className="space-y-6">
                  <p className="text-xl text-gray-700 leading-relaxed">
                    {language === "en"
                      ? "Hello! My name is Dr. Sarah Johnson, and I am a passionate mathematics tutor with over a decade of experience teaching students from primary school to university level."
                      : "Olá! Meu nome é Dra. Sarah Johnson e sou uma tutora de matemática apaixonada com mais de uma década de experiência a ensinar alunos do ensino básico ao universitário."}
                  </p>

                  <p className="text-lg text-gray-600 leading-relaxed">
                    {language === "en"
                      ? "I hold a Ph.D. in Mathematics from MIT and have previously taught at several prestigious universities. My approach combines rigorous academic knowledge with patient, student-centered teaching methods."
                      : "Tenho doutorado em Matemática pelo MIT e já lecionei em várias universidades de prestígio. Minha abordagem combina conhecimento acadêmico rigoroso com métodos de ensino pacientes e centrados no aluno."}
                  </p>
                </div>

                {/* Enhanced Credentials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      icon: BookOpen,
                      title: language === "en" ? "Education" : "Educação",
                      subtitle: "Ph.D. Mathematics, MIT",
                      color: "text-blue-600 bg-blue-50",
                    },
                    {
                      icon: Medal,
                      title: language === "en" ? "Experience" : "Experiência",
                      subtitle:
                        language === "en"
                          ? "3+ Years Teaching"
                          : "3+ Anos de Ensino",
                      color: "text-green-600 bg-green-50",
                    },
                    {
                      icon: Award,
                      title:
                        language === "en" ? "Specialization" : "Especialização",
                      subtitle:
                        language === "en"
                          ? "Advanced Mathematics"
                          : "Matemática Avançada",
                      color: "text-purple-600 bg-purple-50",
                    },
                    {
                      icon: Users,
                      title: language === "en" ? "Students" : "Alunos",
                      subtitle:
                        language === "en" ? "500+ Taught" : "500+ Ensinados",
                      color: "text-orange-600 bg-orange-50",
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.03, y: -2 }}
                      className="group bg-white border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <div
                        className={`inline-flex p-3 rounded-xl mb-4 ${item.color} group-hover:scale-110 transition-transform duration-200`}
                      >
                        <item.icon className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm">{item.subtitle}</p>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-primary-600 to-orange-500 hover:from-primary-700 hover:to-orange-600 text-white px-8 py-4 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                  >
                    {language === "en" ? "Download Resume" : "Baixar Currículo"}
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="py-16 bg-gradient-to-br from-orange-400 to-orange-500">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl mx-auto text-center mb-12"
            >
              <h2
                className="text-3xl font-bold mb-6"
                style={{ color: "#000000" }}
              >
                {language === "en"
                  ? "My Teaching Philosophy"
                  : "Minha Filosofia de Ensino"}
              </h2>
              <div
                className="w-20 h-1 mx-auto mb-6"
                style={{ backgroundColor: "#000000" }}
              ></div>
              <p className="text-lg font-medium" style={{ color: "#000000" }}>
                {language === "en"
                  ? "I believe that every student has the potential to excel in mathematics when provided with the right guidance and approach."
                  : "Acredito que cada aluno tem o potencial de se destacar em matemática quando recebe a orientação e abordagem certas."}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-none shadow-xl bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-300 hover:shadow-2xl">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-primary">
                    {language === "en"
                      ? "Student-Centered Learning"
                      : "Aprendizado Centrado no Aluno"}
                  </h3>
                  <p className="text-gray-700">
                    {language === "en"
                      ? "I adapt my teaching style to match each student's unique learning needs and pace, ensuring concepts are thoroughly understood."
                      : "Adapto meu estilo de ensino para corresponder às necessidades e ao ritmo de aprendizagem exclusivos de cada aluno, garantindo que os conceitos sejam totalmente compreendidos."}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-xl bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-300 hover:shadow-2xl">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-primary">
                    {language === "en"
                      ? "Building Confidence"
                      : "Construindo Confiança"}
                  </h3>
                  <p className="text-gray-700">
                    {language === "en"
                      ? "Many students struggle with math anxiety. I create a supportive environment where mistakes are viewed as learning opportunities."
                      : "Muitos alunos lutam com ansiedade matemática. Crio um ambiente de apoio onde os erros são vistos como oportunidades de aprendizado."}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-xl bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-300 hover:shadow-2xl">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-primary">
                    {language === "en"
                      ? "Real-World Applications"
                      : "Aplicações no Mundo Real"}
                  </h3>
                  <p className="text-gray-700">
                    {language === "en"
                      ? "I connect abstract mathematical concepts to practical, real-world situations, making learning more engaging and meaningful."
                      : "Conecto conceitos matemáticos abstratos a situações práticas do mundo real, tornando o aprendizado mais envolvente e significativo."}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
