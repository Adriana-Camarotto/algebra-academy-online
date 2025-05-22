
import React from 'react';
import { useAuthStore } from '@/lib/auth';
import ProgressChart from '@/components/student/ProgressChart';
import UpcomingLessons from '@/components/student/UpcomingLessons';
import RecentLessonHistory from '@/components/student/RecentLessonHistory';
import { 
  getProgressData, 
  getUpcomingLessons, 
  getRecentLessons, 
  createDateFormatter 
} from '@/utils/studentDashboardData';

const StudentDashboardPage = () => {
  const { language, user } = useAuthStore();
  
  // Get data
  const progressData = getProgressData(language);
  const upcomingLessons = getUpcomingLessons(language);
  const recentLessons = getRecentLessons(language);
  const formatDate = createDateFormatter(language);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <h1 className="text-3xl font-bold">
          {language === 'en' ? 'Welcome back, ' : 'Bem-vindo(a) de volta, '} 
          {user?.name.split(' ')[0]}!
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ProgressChart progressData={progressData} language={language} />
        <UpcomingLessons 
          upcomingLessons={upcomingLessons} 
          language={language} 
          formatDate={formatDate} 
        />
      </div>

      <RecentLessonHistory 
        recentLessons={recentLessons} 
        language={language} 
        formatDate={formatDate} 
      />
    </div>
  );
};

export default StudentDashboardPage;
