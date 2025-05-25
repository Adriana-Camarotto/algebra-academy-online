
import React from 'react';
import { useAuthStore } from '@/lib/auth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BookingWizard from '@/components/BookingWizard';
import { motion } from 'framer-motion';

const BookingPage: React.FC = () => {
  const { language } = useAuthStore();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {language === 'en' ? 'Book a Lesson' : 'Agendar uma Aula'}
            </h1>
            <p className="text-lg text-gray-600">
              {language === 'en' 
                ? 'Follow the steps below to schedule your math tutoring session.' 
                : 'Siga os passos abaixo para agendar sua sessão de tutoria de matemática.'}
            </p>
          </motion.div>

          <BookingWizard />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BookingPage;
