import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/lib/auth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { t } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Briefcase,
  Users,
  BookOpen,
  Award,
  CheckCircle2,
  Star,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MathSymbol from "@/components/MathSymbol";

const ServicesPage: React.FC = () => {
  const { language, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleBookingClick = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: "/booking" } } });
    } else {
      navigate("/booking");
    }
  };

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
                    ? "Comprehensive Learning Solutions"
                    : "Soluções Completas de Aprendizagem"}
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
                {language === "en" ? "My Services" : "Meus Serviços"}
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
                  ? "Comprehensive mathematics tutoring services tailored to your specific learning goals."
                  : "Serviços abrangentes de tutoria de matemática adaptados aos seus objetivos específicos de aprendizado."}
              </motion.p>
            </div>
          </div>
        </section>

        {/* Services Overview */}
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-100 to-orange-100 px-4 py-2 rounded-full mb-6">
                <Briefcase className="text-primary-600" size={20} />
                <span className="text-primary-700 font-semibold text-sm tracking-wide uppercase">
                  {language === "en"
                    ? "Services Overview"
                    : "Visão Geral dos Serviços"}
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
                {language === "en" ? "What I Offer" : "O Que Ofereço"}
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {language === "en"
                  ? "From one-on-one tutoring to group sessions and GCSE Retakes, I offer a range of services to help you excel in mathematics."
                  : "De tutoria individual a sessões em grupo e preparação para exames, ofereço uma variedade de serviços para ajudá-lo a se destacar em matemática."}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-sm transition-all hover:shadow-3xl hover:-translate-y-2 hover:bg-white group">
                  <CardHeader className="pb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-primary-100 to-orange-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                      <BookOpen className="text-primary-600" size={28} />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      {t("service1", language)}
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      {t("service1Desc", language)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle2 className="text-primary mr-2 mt-0.5 h-5 w-5 flex-shrink-0" />
                        <span className="text-gray-700">
                          {language === "en"
                            ? "Customized lesson plans"
                            : "Planos de aula personalizados"}
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="text-primary mr-2 mt-0.5 h-5 w-5 flex-shrink-0" />
                        <span className="text-gray-700">
                          {language === "en"
                            ? "Flexible scheduling"
                            : "Agendamento flexível"}
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="text-primary mr-2 mt-0.5 h-5 w-5 flex-shrink-0" />
                        <span className="text-gray-700">
                          {language === "en"
                            ? "Progress tracking"
                            : "Acompanhamento de progresso"}
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter className="flex-col items-start">
                    <div className="font-bold text-2xl mb-4 text-primary">
                      0.01{" "}
                      <span className="text-sm font-normal text-gray-600">
                        / {t("hours", language)}
                      </span>
                    </div>
                    <Button onClick={handleBookingClick} className="w-full">
                      {language === "en"
                        ? "Book a Session"
                        : "Agendar uma Sessão"}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-sm transition-all hover:shadow-3xl hover:-translate-y-2 hover:bg-white group">
                  <CardHeader className="pb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-primary-100 to-orange-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                      <Users className="text-primary-600" size={28} />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      {t("service2", language)}
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      {t("service2Desc", language)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <CheckCircle2 className="text-primary-600 mr-3 mt-0.5 h-5 w-5 flex-shrink-0" />
                        <span className="text-gray-700">
                          {language === "en"
                            ? "3-5 students per group"
                            : "3-5 alunos por grupo"}
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="text-primary-600 mr-3 mt-0.5 h-5 w-5 flex-shrink-0" />
                        <span className="text-gray-700">
                          {language === "en"
                            ? "Topic-focused sessions"
                            : "Sessões focadas em tópicos"}
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="text-primary-600 mr-3 mt-0.5 h-5 w-5 flex-shrink-0" />
                        <span className="text-gray-700">
                          {language === "en"
                            ? "Collaborative learning"
                            : "Aprendizado colaborativo"}
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter className="flex-col items-start">
                    <div className="font-bold text-3xl mb-4 text-primary-600">
                      0.01{" "}
                      <span className="text-sm font-normal text-gray-600">
                        / {t("hours", language)}
                      </span>
                    </div>
                    <Button
                      onClick={handleBookingClick}
                      className="w-full bg-gradient-to-r from-primary-600 to-orange-500 hover:from-primary-700 hover:to-orange-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {language === "en"
                        ? "Join a Group"
                        : "Entrar em um Grupo"}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-sm transition-all hover:shadow-3xl hover:-translate-y-2 hover:bg-white group">
                  <CardHeader className="pb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-primary-100 to-orange-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                      <Award className="text-primary-600" size={28} />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      {t("service3", language)}
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      {t("service3Desc", language)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <CheckCircle2 className="text-primary-600 mr-3 mt-0.5 h-5 w-5 flex-shrink-0" />
                        <span className="text-gray-700">
                          {language === "en"
                            ? "Exam strategies & techniques"
                            : "Estratégias e técnicas para exames"}
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="text-primary-600 mr-3 mt-0.5 h-5 w-5 flex-shrink-0" />
                        <span className="text-gray-700">
                          {language === "en"
                            ? "Practice tests with feedback"
                            : "Testes práticos com feedback"}
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="text-primary-600 mr-3 mt-0.5 h-5 w-5 flex-shrink-0" />
                        <span className="text-gray-700">
                          {language === "en"
                            ? "Last-minute crash courses"
                            : "Cursos intensivos de última hora"}
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter className="flex-col items-start">
                    <div className="font-bold text-3xl mb-4 text-primary-600">
                      0.01{" "}
                      <span className="text-sm font-normal text-gray-600">
                        / {t("hours", language)}
                      </span>
                    </div>
                    <Button
                      onClick={handleBookingClick}
                      className="w-full bg-gradient-to-r from-primary-600 to-orange-500 hover:from-primary-700 hover:to-orange-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {language === "en"
                        ? "Prepare for Exam"
                        : "Preparar para Exame"}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Subject Areas */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-6 gradient-text">
                {language === "en" ? "Subject Areas" : "Áreas de Estudo"}
              </h2>
              <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                {language === "en"
                  ? "I provide tutoring across a wide range of mathematical subjects for all academic levels."
                  : "Forneço tutoria em uma ampla gama de disciplinas matemáticas para todos os níveis acadêmicos."}
              </p>
            </div>

            <Tabs defaultValue="elementary" className="max-w-4xl mx-auto">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="elementary">
                  {language === "en" ? "Elementary" : "Fundamental"}
                </TabsTrigger>
                <TabsTrigger value="middle">
                  {language === "en" ? "Middle School" : "Ensino Médio"}
                </TabsTrigger>
                <TabsTrigger value="high">
                  {language === "en" ? "High School" : "Ensino Médio Avançado"}
                </TabsTrigger>
                <TabsTrigger value="college">
                  {language === "en" ? "College" : "Universidade"}
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="elementary"
                className="p-6 bg-white rounded-lg shadow-md mt-4"
              >
                <h3 className="text-xl font-bold mb-4 text-primary">
                  {language === "en"
                    ? "Primary School Maths"
                    : "Matemática do Ensino Fundamental"}
                </h3>
                <ul className="grid grid-cols-2 gap-3">
                  <li className="flex items-start">
                    <CheckCircle2 className="text-primary mr-2 mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span>
                      {language === "en"
                        ? "Basic Arithmetic"
                        : "Aritmética Básica"}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="text-primary mr-2 mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span>{language === "en" ? "Fractions" : "Frações"}</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="text-primary mr-2 mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span>{language === "en" ? "Decimals" : "Decimais"}</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="text-primary mr-2 mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span>
                      {language === "en" ? "Measurements" : "Medidas"}
                    </span>
                  </li>
                </ul>
              </TabsContent>

              <TabsContent
                value="middle"
                className="p-6 bg-white rounded-lg shadow-md mt-4"
              >
                <h3 className="text-xl font-bold mb-4 text-primary">
                  {language === "en"
                    ? "Secondary School Maths"
                    : "Matemática do Ensino Médio"}
                </h3>
                <ul className="grid grid-cols-2 gap-3">
                  <li className="flex items-start">
                    <CheckCircle2 className="text-primary mr-2 mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span>
                      {language === "en" ? "Pre-Algebra" : "Pré-Álgebra"}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="text-primary mr-2 mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span>
                      {language === "en"
                        ? "Basic Geometry"
                        : "Geometria Básica"}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="text-primary mr-2 mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span>
                      {language === "en" ? "Data Analysis" : "Análise de Dados"}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="text-primary mr-2 mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span>
                      {language === "en"
                        ? "Ratios & Proportions"
                        : "Razões e Proporções"}
                    </span>
                  </li>
                </ul>
              </TabsContent>

              <TabsContent
                value="high"
                className="p-6 bg-white rounded-lg shadow-md mt-4"
              >
                <h3 className="text-xl font-bold mb-4 text-primary">
                  {language === "en"
                    ? "A-Level Maths"
                    : "Matemática do Ensino Médio Avançado"}
                </h3>
                <ul className="grid grid-cols-2 gap-3">
                  <li className="flex items-start">
                    <CheckCircle2 className="text-primary mr-2 mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span>
                      {language === "en" ? "Algebra I & II" : "Álgebra I e II"}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="text-primary mr-2 mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span>{language === "en" ? "Geometry" : "Geometria"}</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="text-primary mr-2 mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span>
                      {language === "en" ? "Pre-Calculus" : "Pré-Cálculo"}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="text-primary mr-2 mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span>
                      {language === "en" ? "Trigonometry" : "Trigonometria"}
                    </span>
                  </li>
                </ul>
              </TabsContent>

              <TabsContent
                value="college"
                className="p-6 bg-white rounded-lg shadow-md mt-4"
              >
                <h3 className="text-xl font-bold mb-4 text-primary">
                  {language === "en"
                    ? "University Maths"
                    : "Matemática Universitária"}
                </h3>
                <ul className="grid grid-cols-2 gap-3">
                  <li className="flex items-start">
                    <CheckCircle2 className="text-primary mr-2 mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span>
                      {language === "en"
                        ? "Calculus I, II, & III"
                        : "Cálculo I, II e III"}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="text-primary mr-2 mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span>
                      {language === "en" ? "Linear Algebra" : "Álgebra Linear"}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="text-primary mr-2 mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span>
                      {language === "en"
                        ? "Differential Equations"
                        : "Equações Diferenciais"}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="text-primary mr-2 mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span>
                      {language === "en" ? "Statistics" : "Estatística"}
                    </span>
                  </li>
                </ul>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-math-gradient text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {language === "en"
                  ? "Ready to Transform Your Maths Skills?"
                  : "Pronto para Transformar Suas Habilidades Matemáticas?"}
              </h2>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                {language === "en"
                  ? "Book your first session today and receive a free 30-minute consultation."
                  : "Agende sua primeira sessão hoje e receba uma consulta gratuita de 30 minutos."}
              </p>
              <Button
                onClick={handleBookingClick}
                size="lg"
                variant="secondary"
                className="px-8 py-6 text-lg"
              >
                {language === "en" ? "Get Started Now" : "Comece Agora"}
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ServicesPage;
