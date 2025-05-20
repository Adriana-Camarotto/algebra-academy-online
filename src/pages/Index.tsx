
import React from 'react';
import { useAuthStore } from '@/lib/auth';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { t } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import MathSymbol from '@/components/MathSymbol';
import { Link } from 'react-router-dom';

const Index: React.FC = () => {
  const { language } = useAuthStore();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <HeroSection />
        
        <FeaturesSection />
        
        {/* About Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-text">
                  {t('aboutTitle', language)}
                </h2>
                <p className="text-lg text-gray-700 mb-6">
                  {t('aboutDesc', language)}
                </p>
                <p className="text-lg text-gray-700 mb-8">
                  {language === 'en'
                    ? 'With expertise in calculus, algebra, statistics, and more, I help students build confidence and develop problem-solving skills that extend beyond mathematics.'
                    : 'Com experiência em cálculo, álgebra, estatística e muito mais, ajudo os alunos a desenvolver confiança e habilidades de resolução de problemas que vão além da matemática.'}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button className="bg-tutor-primary hover:bg-tutor-primary/90">
                    {language === 'en' ? 'Learn More About Me' : 'Saiba Mais Sobre Mim'}
                  </Button>
                  <Button variant="outline">
                    {language === 'en' ? 'View Credentials' : 'Ver Credenciais'}
                  </Button>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="rounded-lg overflow-hidden shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1560785496-3c9d27877182?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=800&q=80"
                    alt="Math Tutor"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-6 -left-6 text-tutor-primary animate-bounce-slow">
                  <MathSymbol symbol="∑" size="3xl" />
                </div>
                <div className="absolute -bottom-6 -right-6 text-tutor-secondary animate-spin-slow">
                  <MathSymbol symbol="∞" size="3xl" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        <TestimonialsSection />
        
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
                  ? 'Ready to Elevate Your Math Skills?'
                  : 'Pronto para Elevar Suas Habilidades Matemáticas?'}
              </h2>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                {language === 'en'
                  ? 'Book your first session today and experience the difference personalized tutoring can make.'
                  : 'Agende sua primeira sessão hoje e experimente a diferença que a tutoria personalizada pode fazer.'}
              </p>
              <Link to="/booking" className="btn-accent text-lg px-8 py-3">
                {t('bookLesson', language)}
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
