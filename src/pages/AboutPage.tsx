
import React from 'react';
import { useAuthStore } from '@/lib/auth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { t } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Info, BookOpen, Medal, GraduationCap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const AboutPage: React.FC = () => {
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
                {language === 'en' ? 'About Me' : 'Sobre Mim'}
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
                  ? 'Dedicated to helping students achieve excellence in mathematics through personalized tutoring.' 
                  : 'Dedicado a ajudar os alunos a alcançar a excelência em matemática por meio de tutoria personalizada.'}
              </motion.p>
            </div>
          </div>
        </section>

        {/* Profile Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1560785496-3c9d27877182?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=800&q=80"
                    alt="Math Tutor Portrait"
                    className="rounded-lg shadow-xl w-full max-w-md mx-auto"
                  />
                  <div className="absolute -bottom-4 -right-4 bg-primary text-white p-4 rounded-lg shadow-lg">
                    <p className="font-bold">
                      {language === 'en' ? '10+ Years Experience' : '10+ Anos de Experiência'}
                    </p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex items-center mb-4">
                  <Info className="text-primary mr-2" size={24} />
                  <h2 className="text-3xl font-bold gradient-text">
                    {language === 'en' ? 'Who I Am' : 'Quem Eu Sou'}
                  </h2>
                </div>
                
                <p className="text-lg text-gray-700 mb-6">
                  {language === 'en' 
                    ? '5555Hello! My name is Dr. Sarah Johnson, and I am a passionate mathematics tutor with over a decade of experience teaching students from elementary school to university level.' 
                    : 'Olá! Meu nome é Dra. Sarah Johnson e sou uma tutora de matemática apaixonada com mais de uma década de experiência ensinando alunos do ensino fundamental ao universitário.'}
                </p>
                
                <p className="text-lg text-gray-700 mb-6">
                  {language === 'en'
                    ? 'I hold a Ph.D. in Mathematics from MIT and have previously taught at several prestigious universities. My approach combines rigorous academic knowledge with patient, student-centered teaching methods.'
                    : 'Tenho doutorado em Matemática pelo MIT e já lecionei em várias universidades de prestígio. Minha abordagem combina conhecimento acadêmico rigoroso com métodos de ensino pacientes e centrados no aluno.'}
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="flex items-start">
                    <BookOpen className="text-primary mr-2 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold">
                        {language === 'en' ? 'Education' : 'Educação'}
                      </h3>
                      <p className="text-sm text-gray-600">Ph.D. Mathematics, MIT</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Medal className="text-primary mr-2 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold">
                        {language === 'en' ? 'Certifications' : 'Certificações'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {language === 'en' ? 'Advanced Teaching Certificate' : 'Certificado de Ensino Avançado'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <GraduationCap className="text-primary mr-2 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold">
                        {language === 'en' ? 'Students Taught' : 'Alunos Ensinados'}
                      </h3>
                      <p className="text-sm text-gray-600">500+</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <BookOpen className="text-primary mr-2 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold">
                        {language === 'en' ? 'Specialization' : 'Especialização'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {language === 'en' ? 'Calculus, Algebra, Statistics' : 'Cálculo, Álgebra, Estatística'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <Button size="lg" className="bg-tutor-primary hover:bg-tutor-primary/90">
                  {language === 'en' ? 'Download Resume' : 'Baixar Currículo'}
                </Button>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Philosophy Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl mx-auto text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-6 gradient-text">
                {language === 'en' ? 'My Teaching Philosophy' : 'Minha Filosofia de Ensino'}
              </h2>
              <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
              <p className="text-lg text-gray-700">
                {language === 'en'
                  ? 'I believe that every student has the potential to excel in mathematics when provided with the right guidance and approach.'
                  : 'Acredito que cada aluno tem o potencial de se destacar em matemática quando recebe a orientação e abordagem certas.'}
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-none shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-primary">
                    {language === 'en' ? 'Student-Centered Learning' : 'Aprendizado Centrado no Aluno'}
                  </h3>
                  <p className="text-gray-700">
                    {language === 'en'
                      ? 'I adapt my teaching style to match each student\'s unique learning needs and pace, ensuring concepts are thoroughly understood.'
                      : 'Adapto meu estilo de ensino para corresponder às necessidades e ao ritmo de aprendizagem exclusivos de cada aluno, garantindo que os conceitos sejam totalmente compreendidos.'}
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-primary">
                    {language === 'en' ? 'Building Confidence' : 'Construindo Confiança'}
                  </h3>
                  <p className="text-gray-700">
                    {language === 'en'
                      ? 'Many students struggle with math anxiety. I create a supportive environment where mistakes are viewed as learning opportunities.'
                      : 'Muitos alunos lutam com ansiedade matemática. Crio um ambiente de apoio onde os erros são vistos como oportunidades de aprendizado.'}
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-primary">
                    {language === 'en' ? 'Real-World Applications' : 'Aplicações no Mundo Real'}
                  </h3>
                  <p className="text-gray-700">
                    {language === 'en'
                      ? 'I connect abstract mathematical concepts to practical, real-world situations, making learning more engaging and meaningful.'
                      : 'Conecto conceitos matemáticos abstratos a situações práticas do mundo real, tornando o aprendizado mais envolvente e significativo.'}
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
