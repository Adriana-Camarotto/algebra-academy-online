
// Mock data for the student dashboard
export const getProgressData = (language: 'en' | 'pt') => [
  { month: language === 'en' ? 'Jan' : 'Jan', score: 65 },
  { month: language === 'en' ? 'Feb' : 'Fev', score: 70 },
  { month: language === 'en' ? 'Mar' : 'Mar', score: 68 },
  { month: language === 'en' ? 'Apr' : 'Abr', score: 75 },
  { month: language === 'en' ? 'May' : 'Mai', score: 82 },
  { month: language === 'en' ? 'Jun' : 'Jun', score: 87 },
];

export const getUpcomingLessons = (language: 'en' | 'pt') => [
  {
    id: 1,
    title: language === 'en' ? 'Calculus I' : 'Cálculo I',
    date: '2025-05-25',
    time: '15:00',
  },
  {
    id: 2,
    title: language === 'en' ? 'Algebra' : 'Álgebra',
    date: '2025-05-27',
    time: '14:30',
  },
];

export const getRecentLessons = (language: 'en' | 'pt') => [
  {
    id: 1,
    title: language === 'en' ? 'Statistics' : 'Estatística',
    date: '2025-05-18',
    score: 85,
  },
  {
    id: 2,
    title: language === 'en' ? 'Trigonometry' : 'Trigonometria',
    date: '2025-05-15',
    score: 90,
  },
];

// Format date based on language
export const createDateFormatter = (language: 'en' | 'pt') => {
  return (dateString: string) => {
    const date = new Date(dateString);
    return language === 'en'
      ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      : date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };
};
