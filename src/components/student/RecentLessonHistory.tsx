
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface RecentLessonHistoryProps {
  recentLessons: Array<{
    id: number;
    title: string;
    date: string;
    score: number;
  }>;
  language: 'en' | 'pt';
  formatDate: (dateString: string) => string;
}

const RecentLessonHistory: React.FC<RecentLessonHistoryProps> = ({ recentLessons, language, formatDate }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{language === 'en' ? 'Recent Lesson History' : 'Histórico de Aulas Recentes'}</CardTitle>
        <CardDescription>
          {language === 'en' ? 'Your most recent completed lessons' : 'Suas aulas concluídas mais recentes'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">{language === 'en' ? 'Subject' : 'Matéria'}</th>
                <th className="text-left py-3 px-4">{language === 'en' ? 'Date' : 'Data'}</th>
                <th className="text-left py-3 px-4">{language === 'en' ? 'Score' : 'Pontuação'}</th>
              </tr>
            </thead>
            <tbody>
              {recentLessons.map(lesson => (
                <tr key={lesson.id} className="border-b">
                  <td className="py-3 px-4">{lesson.title}</td>
                  <td className="py-3 px-4">{formatDate(lesson.date)}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="h-2 w-full max-w-24 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full" 
                          style={{ width: `${lesson.score}%` }}
                        ></div>
                      </div>
                      <span className="ml-2">{lesson.score}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentLessonHistory;
