
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface UpcomingLessonsProps {
  upcomingLessons: Array<{
    id: number;
    title: string;
    date: string;
    time: string;
  }>;
  language: 'en' | 'pt';
  formatDate: (dateString: string) => string;
}

const UpcomingLessons: React.FC<UpcomingLessonsProps> = ({ upcomingLessons, language, formatDate }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{language === 'en' ? 'Upcoming Lessons' : 'Próximas Aulas'}</CardTitle>
        <CardDescription>
          {language === 'en' ? 'Your scheduled sessions' : 'Suas sessões agendadas'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {upcomingLessons.length > 0 ? (
          <div className="space-y-4">
            {upcomingLessons.map(lesson => (
              <div key={lesson.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <div>
                  <p className="font-medium">{lesson.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(lesson.date)} • {lesson.time}
                  </p>
                </div>
                <div className="h-2 w-2 rounded-full bg-primary"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            {language === 'en' ? 'No upcoming lessons' : 'Sem aulas agendadas'}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingLessons;
