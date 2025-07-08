
import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/auth';
import ProgressChart from '@/components/student/ProgressChart';
import UpcomingLessons from '@/components/student/UpcomingLessons';
import RecentLessonHistory from '@/components/student/RecentLessonHistory';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { 
  getProgressData, 
  getRecentLessons 
} from '@/utils/studentDashboardData';

const StudentDashboardPage = () => {
  const { language, user } = useAuthStore();
  const [upcomingLessons, setUpcomingLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Convert language to 'en' or 'pt' for the data functions
  const dataLanguage = language === 'pt' ? 'pt' : 'en';
  
  // Load upcoming lessons from Supabase
  const loadUpcomingLessons = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'scheduled')
        .gte('lesson_date', new Date().toISOString().split('T')[0])
        .order('lesson_date', { ascending: true })
        .limit(5);

      if (error) {
        console.error('Error loading upcoming lessons:', error);
        return;
      }

      // Transform data to match UpcomingLessons component format
      const transformedLessons = data?.map(booking => ({
        id: booking.id,
        title: getServiceName(booking.service_type),
        date: booking.lesson_date,
        time: booking.lesson_time
      })) || [];

      setUpcomingLessons(transformedLessons);
    } catch (error) {
      console.error('Error loading upcoming lessons:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUpcomingLessons();
  }, [user]);

  // Get service name
  const getServiceName = (serviceType: string) => {
    const services = {
      'individual': language === 'en' ? 'Individual Tutoring' : 'Tutoria Individual',
      'group': language === 'en' ? 'Group Sessions' : 'Sessões em Grupo',
      'exam-prep': language === 'en' ? 'Exam Preparation' : 'Preparação para Exames'
    };
    return services[serviceType] || serviceType;
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return language === 'en' 
      ? format(date, 'MMM dd, yyyy')
      : format(date, 'dd/MM/yyyy');
  };
  
  // Get mock data for other components
  const progressData = getProgressData(dataLanguage);
  const recentLessons = getRecentLessons(dataLanguage);

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
