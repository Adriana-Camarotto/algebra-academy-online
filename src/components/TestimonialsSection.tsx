
import React from 'react';
import { useAuthStore } from '@/lib/auth';
import { t } from '@/lib/i18n';
import { motion } from 'framer-motion';

const testimonials = [
  {
    id: 1,
    content: {
      en: "My daughter was struggling with calculus, but after just a few sessions with this tutor, she gained confidence and significantly improved her grades. The personalized approach made all the difference.",
      pt: "Minha filha estava tendo dificuldades com cálculo, mas depois de apenas algumas sessões com esta tutora, ela ganhou confiança e melhorou significativamente suas notas. A abordagem personalizada fez toda a diferença."
    },
    author: "Maria S.",
    role: {
      en: "Parent of High School Student",
      pt: "Mãe de Estudante do Ensino Médio"
    },
    avatar: "https://ui-avatars.com/api/?name=Maria+S&background=fde1d3&color=333",
  },
  {
    id: 2,
    content: {
      en: "I was preparing for my engineering entrance exams and needed help with advanced mathematics. The tutor's clear explanations and practice problems were exactly what I needed to succeed.",
      pt: "Eu estava me preparando para vestibulares de engenharia e precisava de ajuda com matemática avançada. As explicações claras e problemas práticos da tutora eram exatamente o que eu precisava para ter sucesso."
    },
    author: "João P.",
    role: {
      en: "University Student",
      pt: "Estudante Universitário"
    },
    avatar: "https://ui-avatars.com/api/?name=João+P&background=d3e4fd&color=333",
  },
  {
    id: 3,
    content: {
      en: "As someone returning to education after many years, I was nervous about taking a statistics course. This tutor made complex concepts accessible and built my confidence week by week.",
      pt: "Como alguém retornando aos estudos depois de muitos anos, eu estava nervoso sobre fazer um curso de estatística. Esta tutora tornou conceitos complexos acessíveis e construiu minha confiança semana após semana."
    },
    author: "Carlos M.",
    role: {
      en: "Adult Learner",
      pt: "Estudante Adulto"
    },
    avatar: "https://ui-avatars.com/api/?name=Carlos+M&background=e5deff&color=333",
  },
];

const TestimonialsSection: React.FC = () => {
  const { language } = useAuthStore();

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
            {t('testimonials', language)}
          </h2>
          <div className="w-24 h-1 bg-tutor-accent mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="math-card relative"
            >
              <div className="absolute top-0 left-0 transform -translate-x-3 -translate-y-3 text-tutor-primary text-6xl opacity-20">
                "
              </div>
              <div className="relative z-10">
                <p className="text-gray-600 mb-6">
                  {testimonial.content[language]}
                </p>
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    className="h-12 w-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-bold">{testimonial.author}</h4>
                    <p className="text-sm text-gray-500">
                      {testimonial.role[language]}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
