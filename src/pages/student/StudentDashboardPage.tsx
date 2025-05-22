
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
  
  // Convert language to 'en' or 'pt' for the data functions
  const dataLanguage = language === 'pt' ? 'pt' : 'en';
  
  // Get data
  const progressData = getProgressData(dataLanguage);
  const upcomingLessons = getUpcomingLessons(dataLanguage);
  const recentLessons = getRecentLessons(dataLanguage);
  const formatDate = createDateFormatter(dataLanguage);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <h1 className="text-3xl font-bold">
          {language === 'en' ? 'Welcome back, ' : 'Bem-vindo(a) de volta, '} 
          {user?.name.split(' ')[0]}!
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ProgressChart progressData={progressData} language={dataLanguage} />
        <UpcomingLessons 
          upcomingLessons={upcomingLessons} 
          language={dataLanguage} 
          formatDate={formatDate} 
        />
      </div>

      <RecentLessonHistory 
        recentLessons={recentLessons} 
        language={dataLanguage} 
        formatDate={formatDate} 
      />
    </div>
  );
};

export default StudentDashboardPage;
