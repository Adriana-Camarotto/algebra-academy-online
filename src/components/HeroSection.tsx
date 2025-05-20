
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/lib/auth';
import { t } from '@/lib/i18n';
import AnimatedMathBackground from './AnimatedMathBackground';
import { motion } from 'framer-motion';

const HeroSection: React.FC = () => {
  const { language } = useAuthStore();

  return (
    <section className="hero-section overflow-hidden">
      <AnimatedMathBackground count={20} />
      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            {t('heroTitle', language)}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/80">
            {t('heroSubtitle', language)}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/services" 
              className="btn-accent text-lg px-8 py-3"
            >
              {t('learnMore', language)}
            </Link>
            <Link 
              to="/booking" 
              className="bg-white text-tutor-primary hover:bg-white/90 text-lg px-8 py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
            >
              {t('bookLesson', language)}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
