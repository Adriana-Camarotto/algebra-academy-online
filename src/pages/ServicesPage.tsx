
import React from 'react';
import { useAuthStore } from '@/lib/auth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { t } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Briefcase, Users, BookOpen, Award, CheckCircle2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ServicesPage: React.FC = () => {
  const { language } = useAuthStore();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-12 md:py-20 bg-tutor-dark text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center">
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-bold mb-6"
              >
                {language === 'en' ? 'My Services' : 'Meus Serviços'}
              </motion.h1>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="w-20 h-1 bg-primary mb-8"
              ></motion.div>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-lg md:text-xl max-w-3xl"
              >
                {language === 'en' 
                  ? 'Comprehensive mathematics tutoring services tailored to your specific learning goals.' 
                  : 'Serviços abrangentes de tutoria de matemática adaptados aos seus objetivos específicos de aprendizado.'}
              </motion.p>
            </div>
          </div>
        </section>

        {/* Services Overview */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center mb-4">
                <Briefcase className="text-primary mr-2" size={28} />
                <h2 className="text-3xl font-bold gradient-text">
                  {language === 'en' ? 'Services Overview' : 'Visão Geral dos Serviços'}
                </h2>
              </div>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                {language === 'en'
                  ? 'From one-on-one tutoring to group sessions and exam preparation, I offer a range of services to help you excel in mathematics.'
                  : 'De tutoria individual a sessões em grupo e preparação para exames, ofereço uma variedade de serviços para ajudá-lo a se destacar em matemática.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-none shadow-lg transition-all hover:shadow-xl hover:-translate-y-1">
                <CardHeader className="pb-2">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <BookOpen className="text-primary" size={28} />
                  </div>
                  <CardTitle className="text-xl">
                    {t('service1', language)}
                  </CardTitle>
                  <CardDescription>
                    {t('service1Desc', language)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle2 className="text-primary mr-2 mt-0.5 h-5 w-5 flex-shrink-0" />
                      <span className="text-gray-700">
                        {language === 'en' ? 'Customized lesson plans' : 'Planos de aula personalizados'}
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="text-primary mr-2 mt-0.5 h-5 w-5 flex-shrink-0" />
                      <span className="text-gray-700">
                        {language === 'en' ? 'Flexible scheduling' : 'Agendamento flexível'}
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="text-primary mr-2 mt-0.5 h-5 w-5 flex-shrink-0" />
                      <span className="text-gray-700">
                        {language === 'en' ? 'Progress tracking' : 'Acompanhamento de progresso'}
                      </span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="flex-col items-start">
                  <div className="font-bold text-2xl mb-4 text-primary">
                    $60 <span className="text-sm font-normal text-gray-600">/ {t('hours', language)}</span>
                  </div>
                  <Button className="w-full">
                    {language === 'en' ? 'Book a Session' : 'Agendar uma Sessão'}
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border-none shadow-lg transition-all hover:shadow-xl hover:-translate-y-1">
                <CardHeader className="pb-2">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Users className="text-primary" size={28} />
                  </div>
                  <CardTitle className="text-xl">
                    {t('service2', language)}
                  </CardTitle>
                  <CardDescription>
                    {t('service2Desc', language)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle2 className="text-primary mr-2 mt-0.5 h-5 w-5 flex-shrink-0" />
                      <span className="text-gray-700">
                        {language === 'en' ? '3-5 students per group' : '3-5 alunos por grupo'}
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="text-primary mr-2 mt-0.5 h-5 w-5 flex-shrink-0" />
                      <span className="text-gray-700">
                        {language === 'en' ? 'Topic-focused sessions' : 'Sessões focadas em tópicos'}
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="text-primary mr-2 mt-0.5 h-5 w-5 flex-shrink-0" />
                      <span className="text-gray-700">
                        {language === 'en' ? 'Collaborative learning' : 'Aprendizado colaborativo'}
                      </span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="flex-col items-start">
                  <div className="font-bold text-2xl mb-4 text-primary">
                    $35 <span className="text-sm font-normal text-gray-600">/ {t('hours', language)}</span>
                  </div>
                  <Button className="w-full">
                    {language === 'en' ? 'Join a Group' : 'Entrar em um Grupo'}
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border-none shadow-lg transition-all hover:shadow-xl hover:-translate-y-1">
                <CardHeader className="pb-2">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Award className="text-primary" size={28} />
                  </div>
                  <CardTitle className="text-xl">
                    {t('service3', language)}
                  </CardTitle>
                  <CardDescription>
                    {t('service3Desc', language)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle2 className="text-primary mr-2 mt-0.5 h-5 w-5 flex-shrink-0" />
                      <span className="text-gray-700">
                        {language === 'en' ? 'Exam strategies & techniques' : 'Estratégias e técnicas para exames'}
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="text-primary mr-2 mt-0.5 h-5 w-5 flex-shrink-0" />
                      <span className="text-gray-700">
                        {language === 'en' ? 'Practice tests with feedback' : 'Testes práticos com feedback'}
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="text-primary mr-2 mt-0.5 h-5 w-5 flex-shrink-0" />
                      <span className="text-gray-700">
                        {language === 'en' ? 'Last-minute crash courses' : 'Cursos intensivos de última hora'}
                      </span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="flex-col items-start">
                  <div className="font-bold text-2xl mb-4 text-primary">
                    $75 <span className="text-sm font-normal text-gray-600">/ {t('hours', language)}</span>
                  </div>
                  <Button className="w-full">
                    {language === 'en' ? 'Prepare for Exam' : 'Preparar para Exame'}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* Subject Areas */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-6 gradient-text">
                {language === 'en' ? 'Subject Areas' : 'Áreas de Estudo'}
              </h2>
              <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                {language === 'en'
                  ? 'I provide tutoring across a wide range of mathematical subjects for all academic levels.'
                  : 'Forneço tutoria em uma ampla gama de disciplinas matemáticas para todos os níveis acadêmicos.'}
              </p>
            </div>

            <Tabs defaultValue="elementary" className="max-w-4xl mx-auto">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="elementary">
                  {language === 'en' ? 'Elementary' : 'Fundamental'}
                </TabsTrigger>
                <TabsTrigger value="middle">
                  {language === 'en' ? 'Middle School' : 'Ensino Médio'}
                </TabsTrigger>
                <TabsTrigger value="high">
                  {language === 'en' ? 'High School' : 'Ensino Médio Avançado'}
                </TabsTrigger>
                <TabsTrigger value="college">
                  {language === 'en' ? 'College' : 'Universidade'}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="elementary" className="p-6 bg-white rounded-lg shadow-md mt-4">
                <h3 className="text-xl font-bold mb-4 text-primary">
                  {language === 'en' ? 'Elementary School Math' : 'Matemática do Ensino Fundamental'}
                </h3>
                <ul className="grid grid-cols-2 gap-3">
                  <li className="flex items-start">
                    <CheckCircle2 className="text-primary mr-2 mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span>{language === 'en' ? 'Basic Arithmetic' : 'Aritmética Básica'}</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="text-primary mr-2 mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span>{language === 'en' ? 'Fractions' : 'Frações'}</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="text-primary mr-2 mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span>{language === 'en' ? 'Decimals' : 'Decimais'}</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="text-primary mr-2 mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span>{language === 'en' ? 'Measurements' : 'Medidas'}</span>
                  </li>
                </ul>
              </TabsContent>
              
              <TabsContent value="middle" className="p-6 bg-white rounded-lg shadow-md mt-4">
                <h3 className="text-xl font-bold mb-4 text-primary">
                  {language === 'en' ? 'Middle School Math' : 'Matemática do Ensino Médio'}
                </h3>
                <ul className="grid grid-cols-2 gap-3">
                  <li className="flex items-start">
                    <CheckCircle2 className="text-primary mr-2 mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span>{language === 'en' ? 'Pre-Algebra' : 'Pré-Álgebra'}</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="text-primary mr-2 mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span>{language === 'en' ? 'Basic Geometry' : 'Geometria Básica'}</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="text-primary mr-2 mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span>{language === 'en' ? 'Data Analysis' : 'Análise de Dados'}</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="text-primary mr-2 mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span>{language === 'en' ? 'Ratios & Proportions' : 'Razões e Proporções'}</span>
                  </li>
                </ul>
              </TabsContent>
              
              <TabsContent value="high" className="p-6 bg-white rounded-lg shadow-md mt-4">
                <h3 className="text-xl font-bold mb-4 text-primary">
                  {language === 'en' ? 'High School Math' : 'Matemática do Ensino Médio Avançado'}
                </h3>
                <ul className="grid grid-cols-2 gap-3">
                  <li className="flex items-start">
                    <CheckCircle2 className="text-primary mr-2 mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span>{language === 'en' ? 'Algebra I & II' : 'Álgebra I e II'}</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="text-primary mr-2 mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span>{language === 'en' ? 'Geometry' : 'Geometria'}</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="text-primary mr-2 mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span>{language === 'en' ? 'Pre-Calculus' : 'Pré-Cálculo'}</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="text-primary mr-2 mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span>{language === 'en' ? 'Trigonometry' : 'Trigonometria'}</span>
                  </li>
                </ul>
              </TabsContent>
              
              <TabsContent value="college" className="p-6 bg-white rounded-lg shadow-md mt-4">
                <h3 className="text-xl font-bold mb-4 text-primary">
                  {language === 'en' ? 'College Math' : 'Matemática Universitária'}
                </h3>
                <ul className="grid grid-cols-2 gap-3">
                  <li className="flex items-start">
                    <CheckCircle2 className="text-primary mr-2 mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span>{language === 'en' ? 'Calculus I, II, & III' : 'Cálculo I, II e III'}</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="text-primary mr-2 mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span>{language === 'en' ? 'Linear Algebra' : 'Álgebra Linear'}</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="text-primary mr-2 mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span>{language === 'en' ? 'Differential Equations' : 'Equações Diferenciais'}</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="text-primary mr-2 mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span>{language === 'en' ? 'Statistics' : 'Estatística'}</span>
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
                {language === 'en'
                  ? 'Ready to Transform Your Math Skills?'
                  : 'Pronto para Transformar Suas Habilidades Matemáticas?'}
              </h2>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                {language === 'en'
                  ? 'Book your first session today and receive a free 30-minute consultation.'
                  : 'Agende sua primeira sessão hoje e receba uma consulta gratuita de 30 minutos.'}
              </p>
              <Button size="lg" variant="secondary" className="px-8 py-6 text-lg">
                {language === 'en' ? 'Get Started Now' : 'Comece Agora'}
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
