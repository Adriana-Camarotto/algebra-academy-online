
import React from 'react';
import { useAuthStore } from '@/lib/auth';
import { t } from '@/lib/i18n';
import { motion } from 'framer-motion';

const features = [
  {
    icon: (
      <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
    name: 'service1',
    description: 'service1Desc',
  },
  {
    icon: (
      <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
    name: 'service2',
    description: 'service2Desc',
  },
  {
    icon: (
      <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    name: 'service3',
    description: 'service3Desc',
  },
];

const FeaturesSection: React.FC = () => {
  const { language } = useAuthStore();

  return (
    <section className="py-16 md:py-24 bg-tutor-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
            {t('servicesTitle', language)}
          </h2>
          <div className="w-24 h-1 bg-tutor-accent mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="math-card"
            >
              <div className="text-tutor-primary mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{t(feature.name as any, language)}</h3>
              <p className="text-gray-600">{t(feature.description as any, language)}</p>
              {/* Add duration info */}
              <div className="mt-3 text-sm text-gray-500">
                {feature.name === 'service1' && (
                  <span>{language === 'en' ? '60 minutes per session' : '60 minutos por sessão'}</span>
                )}
                {feature.name === 'service2' && (
                  <span>{language === 'en' ? '60 minutes per class, 6 classes total' : '60 minutos por aula, 6 aulas no total'}</span>
                )}
                {feature.name === 'service3' && (
                  <span>{language === 'en' ? '60 minutes per session' : '60 minutos por sessão'}</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
